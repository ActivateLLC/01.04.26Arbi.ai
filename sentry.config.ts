/**
 * Sentry Error Monitoring Configuration
 * Optional: Install @sentry/react with: npm install @sentry/react
 */

// Uncomment and install @sentry/react to enable Sentry
// import * as Sentry from '@sentry/react';
// import { BrowserTracing } from '@sentry/tracing';

export function initSentry(): void {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (!sentryDsn) {
    console.warn('Sentry DSN not configured. Error monitoring is disabled.');
    return;
  }

  // Uncomment to enable Sentry (requires @sentry/react package)
  /*
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || '0.0.0',
    integrations: [
      new BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Filter out certain errors
    beforeSend(event, hint) {
      // Don't send certain errors
      const error = hint.originalException as Error;
      if (error && error.message) {
        // Filter out browser extension errors
        if (error.message.includes('chrome-extension://')) {
          return null;
        }
        // Filter out network errors that are expected
        if (error.message.includes('NetworkError')) {
          return null;
        }
      }
      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
    ],
  });

  console.log('Sentry initialized successfully');
  */

  console.log('Sentry is available but not initialized. Install @sentry/react to enable.');
}

// Export Sentry for use in error boundaries
// export { Sentry };
