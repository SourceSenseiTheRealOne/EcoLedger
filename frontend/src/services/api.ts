// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:3001'; // Adjust this to match your backend URL

export interface BackendProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  ef: number; // kg CO2 per kg
  bestCo2g: number; // Best case CO2 in grams for ecoScore calculation
  worstCo2g: number; // Worst case CO2 in grams for ecoScore calculation
}

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

// Convert backend product to frontend product format
export const convertBackendToFrontendProduct = (backendProduct: BackendProduct): FrontendProduct => {
  // Calculate ecoScore based on emission factor (kg CO2 per kg)
  // Lower emission factor = higher eco score
  // Scale: 0-5 kg CO2/kg = 100-80, 5-15 = 80-60, 15-30 = 60-40, 30+ = 40-0
  let ecoScore: number;
  const ef = backendProduct.ef;
  
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
    id: backendProduct.id,
    name: backendProduct.name,
    ecoScore: Math.round(ecoScore),
    carbonFootprint: backendProduct.ef, // Use emission factor as carbon footprint
    metadata: `${backendProduct.description} | Category: ${backendProduct.category}`,
    category: backendProduct.category,
    description: backendProduct.description,
    ef: backendProduct.ef,
    bestCo2g: backendProduct.bestCo2g,
    worstCo2g: backendProduct.worstCo2g,
  };
};

export const api = {
  // Fetch all products from backend
  async getProducts(): Promise<FrontendProduct[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const backendProducts: BackendProduct[] = await response.json();
      return backendProducts.map(convertBackendToFrontendProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch single product by ID
  async getProduct(id: string): Promise<FrontendProduct | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const backendProduct: BackendProduct = await response.json();
      return convertBackendToFrontendProduct(backendProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get emission factors
  async getEmissionFactors() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/emission-factors`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching emission factors:', error);
      throw error;
    }
  },
};
