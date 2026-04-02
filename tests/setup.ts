/**
 * Global Test Setup for Arbi.ai Frontend
 *
 * This file runs before all tests and provides:
 * 1. DOM matchers from @testing-library/jest-dom
 * 2. Global fetch API mocking
 * 3. Console error/warning suppression for known issues
 * 4. Mock implementations for browser APIs not in jsdom
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * Mock global fetch API
 * All tests can override this with custom responses using vi.mocked(global.fetch)
 */
global.fetch = vi.fn();

/**
 * Mock window.matchMedia (not available in jsdom)
 * Required for responsive components and media queries
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * Mock IntersectionObserver (not available in jsdom)
 * Required for lazy loading and visibility detection
 */
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn().mockReturnValue([]),
}));

/**
 * Mock ResizeObserver (not available in jsdom)
 * Required for responsive charts and layout components
 */
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

/**
 * Suppress console errors for known non-critical issues
 * Helps keep test output clean and focused on real problems
 */
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Suppress React act() warnings - we handle them with Testing Library
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    // Suppress known warnings that don't affect tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('ReactDOM.render') || args[0].includes('findDOMNode'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

/**
 * Reset all mocks between tests to prevent test pollution
 */
afterEach(() => {
  vi.clearAllMocks();
});
