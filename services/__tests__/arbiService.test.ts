/**
 * Unit Tests for Arbi Service
 *
 * Tests all marketplace API interactions:
 * - Fetching listings and calculating stats
 * - Image scraping functionality
 * - Arbitrage opportunity evaluation
 * - Auto-listing workflow with error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getMarketplaceListings,
  getMarketplaceStats,
  scrapeProductImages,
  getArbitrageOpportunities,
  evaluateOpportunity,
  autoListOpportunity,
  type ArbiListing,
} from '../arbiService';
import type { ArbitrageOpportunity } from '../../types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('arbiService', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('getMarketplaceListings', () => {
    it('should fetch and return marketplace listings successfully', async () => {
      const mockListings: ArbiListing[] = [
        {
          listingId: 'listing-1',
          productTitle: 'Test Product 1',
          productDescription: 'Description 1',
          productPrice: 100,
          supplierCost: 60,
          profitMargin: 40,
          supplierUrl: 'https://supplier.com/product1',
          productImages: ['image1.jpg'],
          createdAt: '2026-04-01T00:00:00Z',
          isActive: true,
        },
        {
          listingId: 'listing-2',
          productTitle: 'Test Product 2',
          productDescription: 'Description 2',
          productPrice: 200,
          supplierCost: 120,
          profitMargin: 80,
          supplierUrl: 'https://supplier.com/product2',
          productImages: ['image2.jpg'],
          createdAt: '2026-04-01T00:00:00Z',
          isActive: true,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ listings: mockListings }),
      });

      const result = await getMarketplaceListings();

      expect(mockFetch).toHaveBeenCalledWith('/api/marketplace');
      expect(result).toEqual(mockListings);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when API returns non-ok status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getMarketplaceListings();

      expect(result).toEqual([]);
    });

    it('should return empty array when fetch throws error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getMarketplaceListings();

      expect(result).toEqual([]);
    });

    it('should handle response with no listings field', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await getMarketplaceListings();

      expect(result).toEqual([]);
    });
  });

  describe('getMarketplaceStats', () => {
    it('should calculate correct statistics from listings', async () => {
      const mockListings: ArbiListing[] = [
        {
          listingId: 'listing-1',
          productTitle: 'Product 1',
          productDescription: 'Desc 1',
          productPrice: 100,
          supplierCost: 60,
          profitMargin: 40,
          supplierUrl: 'https://test.com',
          productImages: [],
          createdAt: '2026-04-01T00:00:00Z',
          isActive: true,
        },
        {
          listingId: 'listing-2',
          productTitle: 'Product 2',
          productDescription: 'Desc 2',
          productPrice: 200,
          supplierCost: 120,
          profitMargin: 80,
          supplierUrl: 'https://test.com',
          productImages: [],
          createdAt: '2026-04-01T00:00:00Z',
          isActive: false,
        },
        {
          listingId: 'listing-3',
          productTitle: 'Product 3',
          productDescription: 'Desc 3',
          productPrice: 150,
          supplierCost: 100,
          profitMargin: 50,
          supplierUrl: 'https://test.com',
          productImages: [],
          createdAt: '2026-04-01T00:00:00Z',
          isActive: true,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ listings: mockListings }),
      });

      const stats = await getMarketplaceStats();

      expect(stats.totalListings).toBe(3);
      expect(stats.activeListings).toBe(2);
      expect(stats.totalPotentialRevenue).toBe(450);
      expect(stats.totalPotentialProfit).toBe(170);
      expect(stats.averageMargin).toBeCloseTo(56.67, 1);
      expect(stats.topProducts).toHaveLength(3);
      expect(stats.topProducts[0].profitMargin).toBe(80);
    });

    it('should return zero stats when no listings exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ listings: [] }),
      });

      const stats = await getMarketplaceStats();

      expect(stats.totalListings).toBe(0);
      expect(stats.activeListings).toBe(0);
      expect(stats.totalPotentialRevenue).toBe(0);
      expect(stats.totalPotentialProfit).toBe(0);
      expect(stats.averageMargin).toBe(0);
      expect(stats.topProducts).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'));

      const stats = await getMarketplaceStats();

      expect(stats.totalListings).toBe(0);
    });
  });

  describe('scrapeProductImages', () => {
    it('should successfully scrape product images', async () => {
      const mockResponse = {
        success: true,
        images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await scrapeProductImages('listing-123');

      expect(mockFetch).toHaveBeenCalledWith('/api/scrape-rainforest/listing-123', {
        method: 'POST',
      });
      expect(result.success).toBe(true);
      expect(result.images).toEqual(['image1.jpg', 'image2.jpg', 'image3.jpg']);
    });

    it('should handle scraping failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Scraping failed'));

      const result = await scrapeProductImages('listing-123');

      expect(result.success).toBe(false);
      expect(result.images).toBeUndefined();
    });
  });

  describe('getArbitrageOpportunities', () => {
    it('should fetch arbitrage opportunities successfully', async () => {
      const mockOpportunities: ArbitrageOpportunity[] = [
        {
          id: 'opp-1',
          productTitle: 'High Margin Product',
          productUrl: 'https://market.com/product1',
          supplierUrl: 'https://supplier.com/product1',
          supplierPlatform: 'AliExpress',
          supplierPrice: 50,
          marketPrice: 120,
          estimatedProfit: 70,
          profitMargin: 58.33,
          score: 95,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ opportunities: mockOpportunities }),
      });

      const result = await getArbitrageOpportunities();

      expect(mockFetch).toHaveBeenCalledWith('/api/arbitrage/opportunities');
      expect(result).toEqual(mockOpportunities);
      expect(result[0].score).toBe(95);
    });

    it('should return empty array on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getArbitrageOpportunities();

      expect(result).toEqual([]);
    });
  });

  describe('evaluateOpportunity', () => {
    it('should evaluate a product URL successfully', async () => {
      const mockEvaluation = {
        viable: true,
        profitMargin: 45,
        score: 88,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvaluation,
      });

      const result = await evaluateOpportunity('https://example.com/product', 40);

      expect(mockFetch).toHaveBeenCalledWith('/api/arbitrage/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productUrl: 'https://example.com/product',
          targetMargin: 40,
        }),
      });
      expect(result).toEqual(mockEvaluation);
    });

    it('should throw error when evaluation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(evaluateOpportunity('https://example.com/product')).rejects.toThrow();
    });
  });

  describe('autoListOpportunity', () => {
    const mockOpportunity: ArbitrageOpportunity = {
      id: 'opp-1',
      productTitle: 'Test Product',
      productUrl: 'https://market.com/product',
      supplierUrl: 'https://supplier.com/product',
      supplierPlatform: 'AliExpress',
      supplierPrice: 50,
      marketPrice: 100,
      estimatedProfit: 50,
      profitMargin: 50,
    };

    it('should successfully auto-list an opportunity', async () => {
      // Mock listing creation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          listingId: 'listing-new-123',
        }),
      });

      // Mock image scraping (fire and forget)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Mock campaign launch (fire and forget)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await autoListOpportunity(mockOpportunity);

      expect(result.success).toBe(true);
      expect(result.listingId).toBe('listing-new-123');

      // Verify listing creation call
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/marketplace/list',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should handle listing creation failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await autoListOpportunity(mockOpportunity);

      expect(result.success).toBe(false);
      expect(result.listingId).toBeUndefined();
    });

    it('should handle missing listingId in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }), // No listingId
      });

      const result = await autoListOpportunity(mockOpportunity);

      expect(result.success).toBe(false);
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await autoListOpportunity(mockOpportunity);

      expect(result.success).toBe(false);
    });
  });
});
