/**
 * Marketplace Store - Manage marketplace listings and statistics
 * Handles marketplace data fetching and state management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ArbiListing, MarketplaceStats, getMarketplaceListings, getMarketplaceStats } from '../../services/arbiService';

interface MarketplaceState {
  // Data
  listings: ArbiListing[];
  stats: MarketplaceStats | null;

  // UI State
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  fetchListings: () => Promise<void>;
  fetchStats: () => Promise<void>;
  refreshAll: () => Promise<void>;
  clearError: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
  devtools(
    (set, get) => ({
      // Data
      listings: [],
      stats: null,

      // UI State
      loading: false,
      error: null,
      lastUpdated: null,

      // Actions
      fetchListings: async () => {
        try {
          set({ loading: true, error: null }, false, 'fetchListings/start');
          const data = await getMarketplaceListings();
          set(
            {
              listings: data,
              loading: false,
              lastUpdated: new Date()
            },
            false,
            'fetchListings/success'
          );
        } catch (err) {
          set(
            {
              error: 'Failed to fetch marketplace listings.',
              loading: false
            },
            false,
            'fetchListings/error'
          );
          console.error(err);
        }
      },

      fetchStats: async () => {
        try {
          set({ loading: true, error: null }, false, 'fetchStats/start');
          const data = await getMarketplaceStats();
          set(
            {
              stats: data,
              loading: false,
              lastUpdated: new Date()
            },
            false,
            'fetchStats/success'
          );
        } catch (err) {
          set(
            {
              error: 'Failed to fetch marketplace stats.',
              loading: false
            },
            false,
            'fetchStats/error'
          );
          console.error(err);
        }
      },

      refreshAll: async () => {
        try {
          set({ loading: true, error: null }, false, 'refreshAll/start');

          // Fetch both in parallel
          const [listings, stats] = await Promise.all([
            getMarketplaceListings(),
            getMarketplaceStats()
          ]);

          set(
            {
              listings,
              stats,
              loading: false,
              lastUpdated: new Date()
            },
            false,
            'refreshAll/success'
          );
        } catch (err) {
          set(
            {
              error: 'Failed to refresh marketplace data.',
              loading: false
            },
            false,
            'refreshAll/error'
          );
          console.error(err);
        }
      },

      clearError: () => set({ error: null }, false, 'clearError'),
    }),
    { name: 'MarketplaceStore' }
  )
);

// Custom hook for convenience with common selectors
export const useMarketplace = () => {
  const store = useMarketplaceStore();
  return {
    // Data
    listings: store.listings,
    stats: store.stats,
    listingsCount: store.listings.length,
    activeListingsCount: store.listings.filter(l => l.isActive !== false).length,

    // UI State
    loading: store.loading,
    error: store.error,
    lastUpdated: store.lastUpdated,
    hasData: store.stats !== null || store.listings.length > 0,

    // Actions
    fetchStats: store.fetchStats,
    fetchListings: store.fetchListings,
    refreshAll: store.refreshAll,
    clearError: store.clearError,
  };
};
