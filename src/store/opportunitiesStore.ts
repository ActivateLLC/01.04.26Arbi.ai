/**
 * Opportunities Store - Manage opportunities UI state
 * Handles filters, dismissed items, and UI preferences
 * Data fetching is handled by React Query (see src/hooks/useOpportunities.ts)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface OpportunitiesUIState {
  // Filters
  minMargin: number;
  setMinMargin: (margin: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  toggleFilters: () => void;
  resetFilters: () => void;

  // UI Preferences
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;

  // Dismissed Items (persisted)
  dismissedIds: Set<string>;
  dismissOpportunity: (id: string) => void;
  undoDismiss: (id: string) => void;
  clearDismissed: () => void;

  // Success Message
  successMessage: string | null;
  setSuccessMessage: (message: string | null) => void;
}

export const useOpportunitiesUIStore = create<OpportunitiesUIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Filters
        minMargin: 15,
        setMinMargin: (margin) => set({ minMargin: margin }, false, 'setMinMargin'),
        maxPrice: 500,
        setMaxPrice: (price) => set({ maxPrice: price }, false, 'setMaxPrice'),
        showFilters: false,
        setShowFilters: (show) => set({ showFilters: show }, false, 'setShowFilters'),
        toggleFilters: () => set((state) => ({ showFilters: !state.showFilters }), false, 'toggleFilters'),
        resetFilters: () =>
          set(
            {
              minMargin: 10,
              maxPrice: 1000
            },
            false,
            'resetFilters'
          ),

        // UI Preferences
        autoRefresh: true,
        setAutoRefresh: (enabled) => set({ autoRefresh: enabled }, false, 'setAutoRefresh'),
        refreshInterval: 300000, // 5 minutes
        setRefreshInterval: (interval) => set({ refreshInterval: interval }, false, 'setRefreshInterval'),

        // Dismissed Items
        dismissedIds: new Set(),
        dismissOpportunity: (id) => {
          const { dismissedIds } = get();
          set({ dismissedIds: new Set(dismissedIds).add(id) }, false, 'dismissOpportunity');
        },
        undoDismiss: (id) => {
          const { dismissedIds } = get();
          const updated = new Set(dismissedIds);
          updated.delete(id);
          set({ dismissedIds: updated }, false, 'undoDismiss');
        },
        clearDismissed: () => set({ dismissedIds: new Set() }, false, 'clearDismissed'),

        // Success Message
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
      }),
      {
        name: 'opportunities-ui-storage',
        // Persist only filters and preferences, not dismissed items or success message
        partialize: (state) => ({
          minMargin: state.minMargin,
          maxPrice: state.maxPrice,
          autoRefresh: state.autoRefresh,
          refreshInterval: state.refreshInterval,
        }),
      }
    ),
    { name: 'OpportunitiesUIStore' }
  )
);

// Custom hook for convenience with common selectors
export const useOpportunitiesUI = () => {
  const store = useOpportunitiesUIStore();
  return {
    // Filters
    minMargin: store.minMargin,
    setMinMargin: store.setMinMargin,
    maxPrice: store.maxPrice,
    setMaxPrice: store.setMaxPrice,
    showFilters: store.showFilters,
    toggleFilters: store.toggleFilters,
    resetFilters: store.resetFilters,

    // UI Preferences
    autoRefresh: store.autoRefresh,
    setAutoRefresh: store.setAutoRefresh,
    refreshInterval: store.refreshInterval,

    // Dismissed Items
    dismissedIds: store.dismissedIds,
    dismissOpportunity: store.dismissOpportunity,
    clearDismissed: store.clearDismissed,

    // Success Message
    successMessage: store.successMessage,
    setSuccessMessage: store.setSuccessMessage,
  };
};
