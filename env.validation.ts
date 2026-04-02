/**
 * Environment Variable Validation
 * Validates required environment variables at build/runtime
 */

interface EnvConfig {
  VITE_API_BASE_URL: string;
  VITE_GEMINI_API_KEY?: string;
  VITE_SENTRY_DSN?: string;
  VITE_ENABLE_ANALYTICS?: string;
  VITE_APP_VERSION?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates required environment variables
 */
export function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required variables
  if (!import.meta.env.VITE_API_BASE_URL) {
    errors.push('VITE_API_BASE_URL is required');
  } else if (!isValidUrl(import.meta.env.VITE_API_BASE_URL)) {
    errors.push('VITE_API_BASE_URL must be a valid URL');
  }

  // Optional but recommended
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    warnings.push(
      'VITE_GEMINI_API_KEY is not set. AI features may not work properly. ' +
      'Note: This should be moved to backend for production security.'
    );
  }

  // Sentry DSN validation
  if (import.meta.env.VITE_SENTRY_DSN && !isValidSentryDsn(import.meta.env.VITE_SENTRY_DSN)) {
    warnings.push('VITE_SENTRY_DSN appears to be invalid');
  }

  // Production-specific validations
  if (import.meta.env.PROD) {
    if (!import.meta.env.VITE_SENTRY_DSN) {
      warnings.push('VITE_SENTRY_DSN is not set in production. Error monitoring is disabled.');
    }

    if (import.meta.env.VITE_API_BASE_URL?.includes('localhost')) {
      errors.push('VITE_API_BASE_URL should not point to localhost in production');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validates Sentry DSN format
 */
function isValidSentryDsn(dsn: string): boolean {
  try {
    const parsed = new URL(dsn);
    return parsed.protocol === 'https:' && parsed.hostname.includes('sentry.io');
  } catch {
    return false;
  }
}

/**
 * Gets typed environment configuration
 */
export function getEnvConfig(): EnvConfig {
  return {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
    VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION || '0.0.0',
  };
}

/**
 * Logs environment validation results
 */
export function logEnvValidation(): void {
  const result = validateEnv();

  if (result.errors.length > 0) {
    console.error('Environment Validation Errors:');
    result.errors.forEach(error => console.error(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.warn('Environment Validation Warnings:');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  if (result.isValid && result.warnings.length === 0) {
    console.log('Environment validation passed successfully');
  }

  if (!result.isValid) {
    throw new Error('Environment validation failed. Please check your .env configuration.');
  }
}

// Run validation on import in development
if (import.meta.env.DEV) {
  logEnvValidation();
}
