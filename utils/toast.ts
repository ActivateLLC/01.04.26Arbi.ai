import toast from 'react-hot-toast';

/**
 * Toast notification utilities
 * Provides a consistent interface for showing toast notifications throughout the app
 */

interface ToastOptions {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
}

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
};

/**
 * Show a success toast notification
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
    style: {
      background: '#064e3b',
      color: '#6ee7b7',
      border: '1px solid #10b981',
      borderRadius: '12px',
      padding: '16px',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#064e3b',
    },
  });
};

/**
 * Show an error toast notification
 */
export const showError = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
    style: {
      background: '#450a0a',
      color: '#fca5a5',
      border: '1px solid #ef4444',
      borderRadius: '12px',
      padding: '16px',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#450a0a',
    },
  });
};

/**
 * Show an info toast notification
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    icon: '💡',
    style: {
      background: '#0c4a6e',
      color: '#93c5fd',
      border: '1px solid #3b82f6',
      borderRadius: '12px',
      padding: '16px',
    },
  });
};

/**
 * Show a warning toast notification
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    icon: '⚠️',
    style: {
      background: '#451a03',
      color: '#fbbf24',
      border: '1px solid #f59e0b',
      borderRadius: '12px',
      padding: '16px',
    },
  });
};

/**
 * Show a loading toast notification
 * Returns a toast ID that can be used to dismiss or update the toast
 */
export const showLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, {
    ...defaultOptions,
    ...options,
    style: {
      background: '#1e293b',
      color: '#cbd5e1',
      border: '1px solid #475569',
      borderRadius: '12px',
      padding: '16px',
    },
  });
};

/**
 * Dismiss a toast by ID
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Show a promise-based toast
 * Automatically shows loading, success, and error states
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options?: ToastOptions
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      ...defaultOptions,
      ...options,
      style: {
        background: '#1e293b',
        color: '#cbd5e1',
        border: '1px solid #475569',
        borderRadius: '12px',
        padding: '16px',
      },
      success: {
        style: {
          background: '#064e3b',
          color: '#6ee7b7',
          border: '1px solid #10b981',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#064e3b',
        },
      },
      error: {
        style: {
          background: '#450a0a',
          color: '#fca5a5',
          border: '1px solid #ef4444',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#450a0a',
        },
      },
    }
  );
};
