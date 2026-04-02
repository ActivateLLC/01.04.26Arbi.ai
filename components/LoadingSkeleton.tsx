import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'stat' | 'opportunity' | 'text' | 'chart';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'stat':
        return (
          <div className={`bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 animate-pulse ${className}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              <div className="h-8 bg-slate-700 rounded w-3/4"></div>
              <div className="h-2 bg-slate-700 rounded w-1/3"></div>
            </div>
          </div>
        );

      case 'opportunity':
        return (
          <div className={`bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 animate-pulse ${className}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
              <div className="ml-4">
                <div className="w-12 h-12 bg-slate-700 rounded"></div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/50 rounded-xl p-3 space-y-2">
                <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                <div className="h-6 bg-slate-700 rounded w-full"></div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 space-y-2">
                <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                <div className="h-6 bg-slate-700 rounded w-full"></div>
              </div>
            </div>

            {/* Profit Banner */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 space-y-2">
              <div className="h-3 bg-slate-700 rounded w-1/3"></div>
              <div className="h-7 bg-slate-700 rounded w-1/2"></div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-slate-700 rounded-xl"></div>
              <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
              <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className={`bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 animate-pulse ${className}`}>
            <div className="space-y-4">
              <div className="h-4 bg-slate-700 rounded w-1/3 mb-6"></div>
              <div className="h-48 bg-slate-800/50 rounded-xl"></div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          </div>
        );

      case 'card':
      default:
        return (
          <div className={`bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 animate-pulse ${className}`}>
            <div className="space-y-4">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              <div className="h-20 bg-slate-700 rounded"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

// Specialized skeleton components for common use cases
export const StatCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <LoadingSkeleton variant="stat" count={count} />
);

export const OpportunityCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <LoadingSkeleton variant="opportunity" count={count} />
);

export const ChartSkeleton: React.FC = () => (
  <LoadingSkeleton variant="chart" />
);

export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 2,
  className = ''
}) => (
  <LoadingSkeleton variant="text" count={lines} className={className} />
);
