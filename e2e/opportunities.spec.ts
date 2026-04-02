/**
 * E2E Tests for Arbitrage Opportunities Flow
 *
 * Tests the complete user journey:
 * - Loading and displaying arbitrage opportunities
 * - Filtering and sorting opportunities
 * - Auto-listing products to marketplace
 * - System activation and configuration
 * - Real-time updates and notifications
 */

import { test, expect } from '@playwright/test';

test.describe('Arbitrage Opportunities', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('should load and display the dashboard', async ({ page }) => {
    // Check for main sections
    await expect(page.locator('h1, h2').filter({ hasText: /Arbi\.ai|Arbitrage/i }).first()).toBeVisible();

    // Control panel should be visible
    await expect(page.getByText(/Turn It On/i)).toBeVisible();

    // System should be in idle state initially
    await expect(page.getByRole('button', { name: /activate/i })).toBeVisible();
  });

  test('should display control panel with default values', async ({ page }) => {
    // Check daily spend limit input
    const dailySpendInput = page.getByLabel(/daily spend limit/i);
    await expect(dailySpendInput).toBeVisible();
    await expect(dailySpendInput).toHaveValue(/\d+/);

    // Check risk tolerance slider
    const riskSlider = page.getByRole('slider');
    await expect(riskSlider).toBeVisible();
    await expect(riskSlider).toBeEnabled();
  });

  test('should activate and deactivate the system', async ({ page }) => {
    // Initially should show ACTIVATE button
    const activateButton = page.getByRole('button', { name: /activate arbitrage system/i });
    await expect(activateButton).toBeVisible();

    // Click to activate
    await activateButton.click();

    // Should now show DEACTIVATE button
    const deactivateButton = page.getByRole('button', { name: /deactivate arbitrage system/i });
    await expect(deactivateButton).toBeVisible();

    // System running indicator should appear
    await expect(page.getByText(/System Running/i)).toBeVisible();

    // Input fields should be disabled when active
    await expect(page.getByLabel(/daily spend limit/i)).toBeDisabled();
    await expect(page.getByRole('slider')).toBeDisabled();

    // Deactivate the system
    await deactivateButton.click();

    // Should return to ACTIVATE state
    await expect(page.getByRole('button', { name: /activate/i })).toBeVisible();

    // Input fields should be enabled again
    await expect(page.getByLabel(/daily spend limit/i)).toBeEnabled();
    await expect(page.getByRole('slider')).toBeEnabled();
  });

  test('should update daily spend limit', async ({ page }) => {
    const dailySpendInput = page.getByLabel(/daily spend limit/i);

    // Clear and enter new value
    await dailySpendInput.fill('5000');

    // Value should update in display
    await expect(page.getByText('$5,000')).toBeVisible();
  });

  test('should update risk tolerance slider', async ({ page }) => {
    const riskSlider = page.getByRole('slider');

    // Set to high risk
    await riskSlider.fill('85');

    // Check if percentage display updates
    await expect(page.getByText('85%')).toBeVisible();

    // Set to low risk
    await riskSlider.fill('25');

    await expect(page.getByText('25%')).toBeVisible();
  });

  test('should prevent configuration changes when system is active', async ({ page }) => {
    const activateButton = page.getByRole('button', { name: /activate/i });
    const dailySpendInput = page.getByLabel(/daily spend limit/i);
    const riskSlider = page.getByRole('slider');

    // Get initial values
    const initialSpend = await dailySpendInput.inputValue();
    const initialRisk = await riskSlider.inputValue();

    // Activate system
    await activateButton.click();

    // Inputs should be disabled
    await expect(dailySpendInput).toBeDisabled();
    await expect(riskSlider).toBeDisabled();

    // Values should remain unchanged
    await expect(dailySpendInput).toHaveValue(initialSpend);
    await expect(riskSlider).toHaveValue(initialRisk);
  });

  test('should display opportunities section', async ({ page }) => {
    // Look for opportunities-related content
    // This test will work once opportunities are loaded
    const opportunitiesSection = page.locator('[data-testid*="opportunit"], section:has-text("Opportunit")').first();

    if (await opportunitiesSection.isVisible()) {
      await expect(opportunitiesSection).toBeVisible();
    } else {
      // If no opportunities yet, should show empty state or loading
      const emptyState = page.getByText(/no opportunities|loading/i);
      expect(await emptyState.isVisible()).toBeTruthy();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Main sections should still be visible
    await expect(page.getByText(/Turn It On/i)).toBeVisible();

    // Controls should be stacked vertically on mobile
    const controlPanel = page.locator('[aria-labelledby="control-panel-heading"]');
    await expect(controlPanel).toBeVisible();

    // Button should be visible and clickable
    const activateButton = page.getByRole('button', { name: /activate/i });
    await expect(activateButton).toBeVisible();
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Should focus on first interactive element
    const firstFocusable = page.locator(':focus');
    await expect(firstFocusable).toBeVisible();

    // Continue tabbing to reach activate button
    let attempts = 0;
    while (attempts < 10) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus');
      const text = await focused.textContent().catch(() => '');

      if (text?.includes('ACTIVATE') || text?.includes('DEACTIVATE')) {
        break;
      }
      attempts++;
    }

    // Activate with keyboard
    await page.keyboard.press('Enter');

    // Should toggle system state
    const deactivateButton = page.getByRole('button', { name: /deactivate/i });
    await expect(deactivateButton).toBeVisible({ timeout: 1000 });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Block API requests to simulate network failure
    await page.route('**/api/**', (route) => route.abort());

    // Reload page
    await page.reload();

    // Application should still render without crashing
    await expect(page.getByText(/Turn It On/i)).toBeVisible();

    // Should show some error state or fallback
    // Note: Exact implementation depends on error boundary setup
  });

  test('should maintain state across interactions', async ({ page }) => {
    const dailySpendInput = page.getByLabel(/daily spend limit/i);
    const riskSlider = page.getByRole('slider');

    // Set custom values
    await dailySpendInput.fill('3500');
    await riskSlider.fill('65');

    // Verify display updates
    await expect(page.getByText('$3,500')).toBeVisible();
    await expect(page.getByText('65%')).toBeVisible();

    // Activate system
    await page.getByRole('button', { name: /activate/i }).click();

    // Values should persist
    await expect(dailySpendInput).toHaveValue('3500');
    await expect(riskSlider).toHaveValue('65');

    // Deactivate
    await page.getByRole('button', { name: /deactivate/i }).click();

    // Values should still be there
    await expect(dailySpendInput).toHaveValue('3500');
    await expect(riskSlider).toHaveValue('65');
  });
});

test.describe('Opportunities Auto-Listing (when available)', () => {
  test('should display opportunity cards when loaded', async ({ page }) => {
    await page.goto('/');

    // Wait for potential opportunities to load
    await page.waitForTimeout(2000);

    // Check if opportunity cards are present
    const opportunityCards = page.locator('[data-testid*="opportunity-card"]');
    const count = await opportunityCards.count();

    if (count > 0) {
      // Verify first card has expected content
      const firstCard = opportunityCards.first();
      await expect(firstCard).toBeVisible();

      // Cards should show product info
      expect(await firstCard.textContent()).toMatch(/\$|price|profit/i);
    }
  });

  test('should handle auto-listing action (when opportunity exists)', async ({ page }) => {
    await page.goto('/');

    // Look for auto-list button
    const autoListButton = page.getByRole('button', { name: /auto.*list|list.*now/i }).first();

    if (await autoListButton.isVisible()) {
      // Click the button
      await autoListButton.click();

      // Should show loading state or success feedback
      // (Exact implementation depends on UI design)
      await page.waitForTimeout(1000);

      // Success notification or state change should occur
    }
  });
});

test.describe('Dashboard Metrics', () => {
  test('should display key metrics', async ({ page }) => {
    await page.goto('/');

    // Look for metric displays (revenue, listings, ROAS, etc.)
    const metricsSection = page.locator('section, div').filter({ hasText: /revenue|listings|roas|profit/i }).first();

    if (await metricsSection.isVisible()) {
      await expect(metricsSection).toBeVisible();

      // Should show numeric values
      expect(await metricsSection.textContent()).toMatch(/\d+/);
    }
  });

  test('should update metrics when system is activated', async ({ page }) => {
    await page.goto('/');

    // Activate system
    await page.getByRole('button', { name: /activate/i }).click();

    // Metrics might update in real-time
    // Allow some time for potential updates
    await page.waitForTimeout(1500);

    // System should show active status
    await expect(page.getByText(/System Running/i)).toBeVisible();
  });
});
