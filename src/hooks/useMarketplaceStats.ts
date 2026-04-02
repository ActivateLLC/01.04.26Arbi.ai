/**
 * React Query hook for fetching marketplace statistics
 * Includes auto-refresh and caching
 */

import { useQuery } from '@tanstack/react-query';
import { getMarketplaceStats, MarketplaceStats } from '../../services/arbiService';

interface UseMarketplaceStatsOptions {
  refetchInterval?: number | false;
  enabled?: boolean;
}

/**
 * Fetch marketplace statistics with auto-refresh
 *
 * @param options - Configuration options
 * @returns React Query result with marketplace stats
 */
export const useMarketplaceStats = (options?: UseMarketplaceStatsOptions) => {
  const { refetchInterval = 30 * 1000, enabled = true } = options || {}; // 30 seconds default

  return useQuery({
    queryKey: ['marketplace', 'stats'],
    queryFn: async () => {
      try {
        const data = await getMarketplaceStats();
        return data;
      } catch (error) {
        console.error('Failed to fetch marketplace stats:', error);
        throw new Error('Failed to fetch marketplace statistics. Please try again.');
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: false,
    enabled,
  });
};
