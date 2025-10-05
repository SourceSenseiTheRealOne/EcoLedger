// API service using local data (replaces backend)
import { localApiService, Product as LocalProduct } from './local-api';

export interface FrontendProduct {
  id: string;
  name: string;
  ecoScore: number;
  carbonFootprint: number;
  metadata?: string;
  category: string;
  description: string;
  ef: number;
  bestCo2g: number;
  worstCo2g: number;
}

// Convert local product to frontend product format
export const convertLocalToFrontendProduct = (localProduct: LocalProduct): FrontendProduct => {
  // Calculate ecoScore based on emission factor (kg CO2 per kg)
  // Lower emission factor = higher eco score
  // Scale: 0-5 kg CO2/kg = 100-80, 5-15 = 80-60, 15-30 = 60-40, 30+ = 40-0
  let ecoScore: number;
  const ef = localProduct.ef;
  
  if (ef <= 5) {
    ecoScore = Math.max(80, 100 - (ef * 4)); // 100-80 for 0-5 range
  } else if (ef <= 15) {
    ecoScore = Math.max(60, 80 - ((ef - 5) * 2)); // 80-60 for 5-15 range
  } else if (ef <= 30) {
    ecoScore = Math.max(40, 60 - ((ef - 15) * 1.33)); // 60-40 for 15-30 range
  } else {
    ecoScore = Math.max(0, 40 - ((ef - 30) * 0.5)); // 40-0 for 30+ range
  }
  
  return {
    id: localProduct.id,
    name: localProduct.name,
    ecoScore: Math.round(ecoScore),
    carbonFootprint: localProduct.ef, // This is actually the emission factor, not carbon footprint
    metadata: `${localProduct.description} | Category: ${localProduct.category}`,
    category: localProduct.category,
    description: localProduct.description,
    ef: localProduct.ef,
    bestCo2g: localProduct.bestCo2g,
    worstCo2g: localProduct.worstCo2g,
  };
};

export const api = {
  // Fetch all products from local API
  async getProducts(): Promise<FrontendProduct[]> {
    try {
      const localProducts = await localApiService.getProducts();
      return localProducts.map(convertLocalToFrontendProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch single product by ID
  async getProduct(id: string): Promise<FrontendProduct | null> {
    try {
      const localProduct = await localApiService.getProduct(id);
      if (!localProduct) {
        return null;
      }
      return convertLocalToFrontendProduct(localProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get emission factors
  async getEmissionFactors() {
    try {
      return await localApiService.getEmissionFactors();
    } catch (error) {
      console.error('Error fetching emission factors:', error);
      throw error;
    }
  },
};
