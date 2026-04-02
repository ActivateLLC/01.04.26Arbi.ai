/**
 * React Query mutation hook for auto-listing opportunities
 * Includes optimistic updates and automatic cache invalidation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { autoListOpportunity } from '../../services/arbiService';
import { ArbitrageOpportunity } from '../../types';

interface AutoListResult {
  success: boolean;
  listingId?: string;
}

interface UseAutoListOptions {
  onSuccess?: (data: AutoListResult, opportunity: ArbitrageOpportunity) => void;
  onError?: (error: Error, opportunity: ArbitrageOpportunity) => void;
}

/**
 * Mutation hook for auto-listing opportunities
 *
 * Features:
 * - Optimistic updates to remove opportunity from list
 * - Automatic cache invalidation
 * - Success/error callbacks for UI feedback
 *
 * @param options - Configuration options
 * @returns React Query mutation result
 */
export const useAutoList = (options?: UseAutoListOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (opportunity: ArbitrageOpportunity) => {
      const result = await autoListOpportunity(opportunity);

      if (!result.success) {
        throw new Error('Failed to create listing');
      }

      return result;
    },

    // Optimistic update: immediately remove opportunity from cache
    onMutate: async (opportunity: ArbitrageOpportunity) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['opportunities'] });

      // Snapshot the previous value
      const previousOpportunities = queryClient.getQueryData<ArbitrageOpportunity[]>(['opportunities']);

      // Optimistically update to remove the opportunity
      if (previousOpportunities) {
        queryClient.setQueryData<ArbitrageOpportunity[]>(
          ['opportunities'],
          previousOpportunities.filter(opp => opp.id !== opportunity.id)
        );
      }

      // Return context with the snapshot
      return { previousOpportunities };
    },

    // On success, invalidate to ensure we have fresh data
    onSuccess: (data, opportunity) => {
      // Invalidate opportunities query
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });

      // Invalidate marketplace stats to reflect new listing
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'stats'] });

      // Call custom success handler if provided
      if (options?.onSuccess) {
        options.onSuccess(data, opportunity);
      }
    },

    // On error, rollback the optimistic update
    onError: (error, opportunity, context) => {
      // Rollback to previous opportunities
      if (context?.previousOpportunities) {
        queryClient.setQueryData(['opportunities'], context.previousOpportunities);
      }

      // Call custom error handler if provided
      if (options?.onError) {
        options.onError(error as Error, opportunity);
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },

    retry: 1,
    retryDelay: 1000,
  });
};
