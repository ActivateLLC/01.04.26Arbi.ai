import React, { useEffect, useState } from 'react';
import { Package, DollarSign, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { getMarketplaceStats, MarketplaceStats } from '../services/arbiService';

interface DashboardStats extends MarketplaceStats {
  lastUpdated: string;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketplaceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const marketplaceStats = await getMarketplaceStats();
      
      setStats({
        ...marketplaceStats,
        lastUpdated: new Date().toLocaleTimeString()
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Marketplace API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketplaceData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw className="animate-spin" size={20} aria-hidden="true" />
          <span>Loading marketplace data...</span>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6" role="alert" aria-live="assertive">
        <div className="flex items-center gap-3 text-red-400">
          <Activity size={20} aria-hidden="true" />
          <div>
            <div className="font-semibold">Connection Error</div>
            <div className="text-sm text-red-300 mt-1">{error}</div>
          </div>
        </div>
        <button
          onClick={fetchMarketplaceData}
          aria-label="Retry marketplace connection"
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="marketplace-heading">
      {/* Screen reader status updates */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {loading && 'Refreshing marketplace data...'}
      </div>

      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h2 id="marketplace-heading" className="text-2xl font-bold text-white">Live Marketplace</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time product opportunities from API
          </p>
        </div>
        <button
          onClick={fetchMarketplaceData}
          disabled={loading}
          aria-label={loading ? 'Refreshing marketplace data' : 'Refresh marketplace data'}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} size={16} aria-hidden="true" />
          {loading ? 'Updating...' : 'Refresh'}
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" role="region" aria-label="Marketplace statistics">
        {/* Total Products */}
        <article className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-blue-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20" aria-hidden="true">
              <Package size={24} />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase" aria-hidden="true">Live Count</div>
          </div>
          <div className="text-4xl font-bold text-white font-mono mb-1" aria-label={`${stats?.totalListings || 0} total listings`}>
            {stats?.totalListings.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-slate-400">Total Listings</div>
          <div className="text-xs text-slate-500 mt-2">
            Active: <span aria-label={`${stats?.activeListings || 0} active listings`}>{stats?.activeListings.toLocaleString() || '0'}</span>
          </div>
        </article>

        {/* Potential Revenue */}
        <article className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" aria-hidden="true">
              <DollarSign size={24} />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase" aria-hidden="true">Revenue</div>
          </div>
          <div className="text-4xl font-bold text-white font-mono mb-1" aria-label={`${(stats?.totalPotentialRevenue || 0).toLocaleString()} dollars potential revenue`}>
            ${(stats?.totalPotentialRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-slate-400">Potential Revenue</div>
        </article>

        {/* Potential Profit */}
        <article className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" aria-hidden="true">
              <TrendingUp size={24} />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase" aria-hidden="true">Profit</div>
          </div>
          <div className="text-4xl font-bold text-emerald-400 font-mono mb-1" aria-label={`${(stats?.totalPotentialProfit || 0).toLocaleString()} dollars potential profit`}>
            ${(stats?.totalPotentialProfit || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-slate-400">Potential Profit</div>
        </article>

        {/* Avg Margin */}
        <article className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-violet-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20" aria-hidden="true">
              <Activity size={24} />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase" aria-hidden="true">Margin</div>
          </div>
          <div className="text-4xl font-bold text-white font-mono mb-1" aria-label={`${(stats?.averageMargin || 0).toFixed(2)} dollars average margin`}>
            ${(stats?.averageMargin || 0).toFixed(2)}
          </div>
          <div className="text-sm text-slate-400">Average Margin</div>
        </article>
      </div>

      {/* Last Updated */}
      {stats?.lastUpdated && (
        <div className="text-xs text-slate-500 text-center font-mono">
          Last updated: {stats.lastUpdated}
        </div>
      )}
    </section>
  );
};
