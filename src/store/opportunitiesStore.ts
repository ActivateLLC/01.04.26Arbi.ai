/**
 * Opportunities Store - Manage arbitrage opportunities state
 * Handles opportunities list, filters, UI state, and actions
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ArbitrageOpportunity } from '../../types';
import { getArbitrageOpportunities, autoListOpportunity } from '../../services/arbiService';

interface OpportunitiesState {
  // Data
  opportunities: ArbitrageOpportunity[];
  filteredOpportunities: ArbitrageOpportunity[];

  // Filters
  minMargin: number;
  setMinMargin: (margin: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  toggleFilters: () => void;
  resetFilters: () => void;

  // UI State
  loading: boolean;
  error: string | null;
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;

  // Action States
  processingIds: Set<string>;
  dismissedIds: Set<string>;
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;

  // Actions
  fetchOpportunities: () => Promise<void>;
  applyFilters: () => void;
  handleAutoList: (opportunity: ArbitrageOpportunity) => Promise<void>;
  dismissOpportunity: (id: string) => void;
  undoDismiss: (id: string) => void;
  clearDismissed: () => void;
}

export const useOpportunitiesStore = create<OpportunitiesState>()(
  devtools(
    (set, get) => ({
      // Data
      opportunities: [],
      filteredOpportunities: [],

      // Filters
      minMargin: 15,
      setMinMargin: (margin) => {
        set({ minMargin: margin }, false, 'setMinMargin');
        get().applyFilters();
      },
      maxPrice: 500,
      setMaxPrice: (price) => {
        set({ maxPrice: price }, false, 'setMaxPrice');
        get().applyFilters();
      },
      showFilters: false,
      setShowFilters: (show) => set({ showFilters: show }, false, 'setShowFilters'),
      toggleFilters: () => set((state) => ({ showFilters: !state.showFilters }), false, 'toggleFilters'),
      resetFilters: () => {
        set(
          {
            minMargin: 10,
            maxPrice: 1000
          },
          false,
          'resetFilters'
        );
        get().applyFilters();
      },

      // UI State
      loading: false,
      error: null,
      autoRefresh: true,
      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }, false, 'setAutoRefresh'),
      refreshInterval: 300000, // 5 minutes
      setRefreshInterval: (interval) => set({ refreshInterval: interval }, false, 'setRefreshInterval'),

      // Action States
      processingIds: new Set(),
      dismissedIds: new Set(),
      successMessage: null,
      setSuccessMessage: (message) => {
        set({ successMessage: message }, false, 'setSuccessMessage');
        if (message) {
          // Auto-clear after 5 seconds
          setTimeout(() => {
            if (get().successMessage === message) {
              set({ successMessage: null }, false, 'clearSuccessMessage');
            }
          }, 5000);
        }
      },

      // Actions
      fetchOpportunities: async () => {
        try {
          set({ loading: true, error: null }, false, 'fetchOpportunities/start');
          const data = await getArbitrageOpportunities();
          set({ opportunities: data, loading: false }, false, 'fetchOpportunities/success');
          get().applyFilters();
        } catch (err) {
          set(
            {
              error: 'Failed to fetch opportunities. Please try again.',
              loading: false
            },
            false,
            'fetchOpportunities/error'
          );
          console.error(err);
        }
      },

      applyFilters: () => {
        const { opportunities, minMargin, maxPrice, dismissedIds } = get();
        const filtered = opportunities.filter((opp) => {
          if (dismissedIds.has(opp.id)) return false;
          if (opp.profitMargin < minMargin) return false;
          if (opp.supplierPrice > maxPrice) return false;
          return true;
        });
        set({ filteredOpportunities: filtered }, false, 'applyFilters');
      },

      handleAutoList: async (opportunity: ArbitrageOpportunity) => {
        const { processingIds } = get();

        // Add to processing
        set(
          { processingIds: new Set(processingIds).add(opportunity.id) },
          false,
          'handleAutoList/start'
        );

        try {
          const result = await autoListOpportunity(opportunity);

          if (result.success) {
            // Add to dismissed
            const { dismissedIds } = get();
            set(
              {
                dismissedIds: new Set(dismissedIds).add(opportunity.id),
                successMessage: `Successfully listed: ${opportunity.productTitle}`
              },
              false,
              'handleAutoList/success'
            );
            get().applyFilters();
          } else {
            set({ error: 'Failed to create listing. Please try again.' }, false, 'handleAutoList/failure');
          }
        } catch (err) {
          set({ error: 'An error occurred. Please try again.' }, false, 'handleAutoList/error');
          console.error(err);
        } finally {
          // Remove from processing
          const updatedProcessing = new Set(get().processingIds);
          updatedProcessing.delete(opportunity.id);
          set({ processingIds: updatedProcessing }, false, 'handleAutoList/complete');
        }
      },

      dismissOpportunity: (id) => {
        const { dismissedIds } = get();
        set({ dismissedIds: new Set(dismissedIds).add(id) }, false, 'dismissOpportunity');
        get().applyFilters();
      },

      undoDismiss: (id) => {
        const { dismissedIds } = get();
        const updated = new Set(dismissedIds);
        updated.delete(id);
        set({ dismissedIds: updated }, false, 'undoDismiss');
        get().applyFilters();
      },

      clearDismissed: () => {
        set({ dismissedIds: new Set() }, false, 'clearDismissed');
        get().applyFilters();
      },
    }),
    { name: 'OpportunitiesStore' }
  )
);

// Custom hook for convenience with common selectors
export const useOpportunities = () => {
  const store = useOpportunitiesStore();
  return {
    // Data
    opportunities: store.filteredOpportunities,
    opportunityCount: store.filteredOpportunities.length,
    totalOpportunities: store.opportunities.length,

    // Filters
    minMargin: store.minMargin,
    setMinMargin: store.setMinMargin,
    maxPrice: store.maxPrice,
    setMaxPrice: store.setMaxPrice,
    showFilters: store.showFilters,
    toggleFilters: store.toggleFilters,
    resetFilters: store.resetFilters,

    // UI State
    loading: store.loading,
    error: store.error,
    autoRefresh: store.autoRefresh,
    setAutoRefresh: store.setAutoRefresh,
    refreshInterval: store.refreshInterval,

    // Action States
    processingIds: store.processingIds,
    successMessage: store.successMessage,
    clearSuccessMessage: () => store.setSuccessMessage(null),

    // Actions
    fetchOpportunities: store.fetchOpportunities,
    handleAutoList: store.handleAutoList,
    dismissOpportunity: store.dismissOpportunity,
  };
};
