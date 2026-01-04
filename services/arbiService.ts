/**
 * Arbi Marketplace API Service
 * Fetches real data from your marketplace backend
 */

export interface ArbiListing {
  listingId: string;
  productTitle: string;
  productDescription: string;
  productPrice: number;
  supplierCost: number;
  profitMargin: number;
  supplierUrl: string;
  productImages: string[];
  createdAt: string;
  isActive: boolean;
}

export interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  totalPotentialRevenue: number;
  totalPotentialProfit: number;
  averageMargin: number;
  topProducts: ArbiListing[];
}

/**
 * Fetch all marketplace listings
 */
export const getMarketplaceListings = async (): Promise<ArbiListing[]> => {
  try {
    // Use relative path - Vite proxy will route to https://api.arbi.creai.dev
    const response = await fetch('/api/marketplace');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.listings || [];
    
  } catch (error) {
    console.error('Failed to fetch marketplace listings:', error);
    return [];
  }
};

/**
 * Calculate marketplace statistics
 */
export const getMarketplaceStats = async (): Promise<MarketplaceStats> => {
  try {
    const listings = await getMarketplaceListings();
    
    // Filter active listings
    const activeListings = listings.filter(l => l.isActive !== false);
    
    // Calculate totals
    const totalPotentialRevenue = listings.reduce((sum, l) => sum + (l.productPrice || 0), 0);
    const totalPotentialProfit = listings.reduce((sum, l) => sum + (l.profitMargin || 0), 0);
    const averageMargin = listings.length > 0 
      ? listings.reduce((sum, l) => sum + (l.profitMargin || 0), 0) / listings.length 
      : 0;
    
    // Get top 5 products by profit margin
    const topProducts = [...listings]
      .sort((a, b) => (b.profitMargin || 0) - (a.profitMargin || 0))
      .slice(0, 5);
    
    return {
      totalListings: listings.length,
      activeListings: activeListings.length,
      totalPotentialRevenue,
      totalPotentialProfit,
      averageMargin,
      topProducts,
    };
    
  } catch (error) {
    console.error('Failed to calculate stats:', error);
    return {
      totalListings: 0,
      activeListings: 0,
      totalPotentialRevenue: 0,
      totalPotentialProfit: 0,
      averageMargin: 0,
      topProducts: [],
    };
  }
};

/**
 * Scrape images for a product
 */
export const scrapeProductImages = async (listingId: string): Promise<{ success: boolean; images?: string[] }> => {
  try {
    const response = await fetch(`/api/scrape-rainforest/${listingId}`, {
      method: 'POST',
    });
    
    const data = await response.json();
    return {
      success: data.success,
      images: data.images,
    };
    
  } catch (error) {
    console.error('Failed to scrape images:', error);
    return { success: false };
  }
};
