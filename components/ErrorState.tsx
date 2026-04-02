import React, { ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorStateProps {
  error?: Error | null;
  errorInfo?: ErrorInfo | null;
  onReset?: () => void;
  message?: string;
  showDetails?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  errorInfo,
  onReset,
  message,
  showDetails = false,
}) => {
  const defaultMessage = 'Something went wrong';
  const displayMessage = message || error?.message || defaultMessage;

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-900/50 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 md:p-12 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
              <AlertTriangle size={48} className="text-red-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-3">
            Oops! Something Went Wrong
          </h1>

          {/* Message */}
          <p className="text-slate-400 text-center mb-8">
            {displayMessage}
          </p>

          {/* Error Details (Collapsible) */}
          {showDetails && error && (
            <details className="mb-8 bg-slate-950/50 rounded-xl p-4 border border-slate-800">
              <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                Technical Details
              </summary>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Error:</div>
                  <pre className="text-xs text-red-400 bg-slate-950 p-3 rounded overflow-x-auto">
                    {error.toString()}
                  </pre>
                </div>
                {error.stack && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Stack Trace:</div>
                    <pre className="text-xs text-slate-500 bg-slate-950 p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {errorInfo?.componentStack && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Component Stack:</div>
                    <pre className="text-xs text-slate-500 bg-slate-950 p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onReset && (
              <button
                onClick={onReset}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            )}
            <button
              onClick={handleReload}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Reload Page
            </button>
            <button
              onClick={handleGoHome}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Go Home
            </button>
          </div>

          {/* Support Message */}
          <p className="text-center text-xs text-slate-500 mt-8">
            If this problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  );
};
