import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest Configuration for Arbi.ai Frontend
 *
 * Provides complete testing setup with:
 * - TypeScript support
 * - React Testing Library integration
 * - DOM environment simulation
 * - Code coverage reporting (target: 80%+)
 * - Path aliases matching tsconfig.json
 */
export default defineConfig({
  plugins: [react()],

  test: {
    // Use jsdom to simulate browser environment for component tests
    environment: 'jsdom',

    // Global setup file with DOM matchers and API mocks
    setupFiles: ['./tests/setup.ts'],

    // Enable global test APIs (describe, it, expect) without imports
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        'vitest.config.ts',
        'vite.config.ts',
        'playwright.config.ts',
        'index.tsx', // Entry point, hard to test
      ],
      // Thresholds to enforce quality
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },

    // Test timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // UI for interactive test debugging
    ui: false,

    // Better error messages
    css: false, // Don't process CSS in tests

    // Include/exclude patterns
    include: ['**/__tests__/**/*.{test,spec}.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'e2e'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
