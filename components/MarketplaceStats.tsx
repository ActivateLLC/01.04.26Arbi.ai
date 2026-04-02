import React from 'react';
import { useMarketplaceStats } from '../src/hooks/useMarketplaceStats';
import { StatCardSkeleton } from './LoadingSkeleton';
import { Package, TrendingUp, DollarSign, Percent, AlertTriangle, RefreshCw } from 'lucide-react';

export const MarketplaceStats: React.FC = React.memo(() => {
  const { data: stats, isLoading: loading, error, refetch } = useMarketplaceStats({
    refetchInterval: 30 * 1000, // 30 seconds
    enabled: true,
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8" role="status" aria-live="polite">
        <span className="sr-only">Loading marketplace statistics...</span>
        <StatCardSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center mb-8" role="alert" aria-live="assertive">
        <AlertTriangle size={48} className="text-red-400 mb-4 mx-auto" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-red-400 mb-2">Failed to Load Marketplace Stats</h3>
        <p className="text-red-300 mb-6">
          {error instanceof Error ? error.message : 'Unable to fetch marketplace data. Please try again.'}
        </p>
        <button
          onClick={() => refetch()}
          aria-label="Retry loading marketplace statistics"
          className="px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all flex items-center justify-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <RefreshCw size={18} aria-hidden="true" />
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8" role="region" aria-label="Marketplace statistics">
        {/* Total Products */}
        <StatCard
          icon={<Package size={20} />}
          label="Active Products"
          value={stats.activeListings.toString()}
          subtext={`${stats.totalListings} total`}
          color="emerald"
          ariaLabel={`${stats.activeListings} active products out of ${stats.totalListings} total`}
        />

        {/* Potential Revenue */}
        <StatCard
          icon={<DollarSign size={20} />}
          label="Potential Revenue"
          value={`$${stats.totalPotentialRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtext="If all products sell"
          color="blue"
          ariaLabel={`${stats.totalPotentialRevenue.toLocaleString()} dollars potential revenue if all products sell`}
        />

        {/* Potential Profit */}
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Potential Profit"
          value={`$${stats.totalPotentialProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtext="Gross margin"
          color="violet"
          ariaLabel={`${stats.totalPotentialProfit.toLocaleString()} dollars potential profit gross margin`}
        />

        {/* Average Margin */}
        <StatCard
          icon={<Percent size={20} />}
          label="Avg Margin"
          value={`$${stats.averageMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          subtext="Per product"
          color="amber"
          ariaLabel={`${stats.averageMargin.toLocaleString()} dollars average margin per product`}
        />
      </div>

      {/* Top Products */}
      <section className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8" aria-labelledby="top-products-heading">
        <h3 id="top-products-heading" className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" aria-hidden="true" />
          Top Profit Products
        </h3>

        <ul className="space-y-3" role="list">
          {stats.topProducts.map((product, idx) => (
            <li
              key={product.listingId}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl font-bold text-slate-600" aria-label={`Rank ${idx + 1}`}>
                  #{idx + 1}
                </div>

                {product.productImages && product.productImages.length > 0 ? (
                  <img
                    src={product.productImages[0]}
                    alt={`Product image for ${product.productTitle}`}
                    loading="lazy"
                    className="w-12 h-12 rounded-lg object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center" aria-label="No product image available">
                    <Package size={20} className="text-slate-500" aria-hidden="true" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {product.productTitle}
                  </div>
                  <div className="text-xs text-slate-400">
                    ${product.productPrice?.toLocaleString()} • {product.productImages?.length || 0} images
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400" aria-label={`${product.profitMargin?.toLocaleString(undefined, { maximumFractionDigits: 0 })} dollars profit`}>
                  ${product.profitMargin?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-500">
                  profit
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
});

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: 'emerald' | 'blue' | 'violet' | 'amber';
  ariaLabel?: string;
}> = React.memo(({ icon, label, value, subtext, color, ariaLabel }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <article className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl" aria-label={ariaLabel || `${label}: ${value}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg border ${colorClasses[color]}`} aria-hidden="true">
          {icon}
        </div>
      </div>

      <div>
        <div className="text-slate-400 text-sm font-medium mb-1">{label}</div>
        <div className="text-3xl font-bold text-white font-mono">{value}</div>
        <div className="text-xs text-slate-500 mt-1">{subtext}</div>
      </div>
    </article>
  );
});
