/**
 * React Query hook for fetching arbitrage opportunities
 * Includes auto-refresh, retry logic, and error handling
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getArbitrageOpportunities } from '../../services/arbiService';
import { ArbitrageOpportunity } from '../../types';

interface UseOpportunitiesOptions {
  refetchInterval?: number | false;
  enabled?: boolean;
}

/**
 * Fetch arbitrage opportunities with auto-refresh
 *
 * @param options - Configuration options
 * @returns React Query result with opportunities data
 */
export const useOpportunities = (options?: UseOpportunitiesOptions) => {
  const { refetchInterval = 5 * 60 * 1000, enabled = true } = options || {};

  return useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      try {
        const data = await getArbitrageOpportunities();
        return data;
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
        throw new Error('Failed to fetch opportunities. Please try again.');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: false,
    enabled,
  });
};
