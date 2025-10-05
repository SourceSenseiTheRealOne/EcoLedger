/**
 * Local API Service - Replaces NestJS Backend
 * All product data, CO2 calculations, and API endpoints moved to frontend
 */

// Emission Factors (EF) - kg CO2 per kg of product (based on real-world data)
const EF = {
  // Low impact materials
  paper: { kgCO2PerKg: 0.8 },      // Recycled paper
  cardboard: { kgCO2PerKg: 1.2 },  // Cardboard packaging
  glass: { kgCO2PerKg: 1.0 },      // Recycled glass
  bamboo: { kgCO2PerKg: 0.5 },     // Bamboo products
  
  // Medium impact materials
  plastic: { kgCO2PerKg: 6.0 },    // Virgin plastic
  aluminum: { kgCO2PerKg: 8.2 },   // Aluminum (recycled: 2.5)
  steel: { kgCO2PerKg: 1.8 },      // Steel (recycled: 0.5)
  concrete: { kgCO2PerKg: 0.13 },  // Concrete
  
  // High impact materials
  cotton: { kgCO2PerKg: 27.0 },    // Conventional cotton
  polyester: { kgCO2PerKg: 5.5 },  // Polyester fabric
  leather: { kgCO2PerKg: 15.0 },   // Leather
  electronics: { kgCO2PerKg: 25.0 }, // Electronic devices
  
  // Very high impact materials
  beef: { kgCO2PerKg: 60.0 },      // Beef (for comparison)
  cement: { kgCO2PerKg: 0.9 },     // Cement
};

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  ef: number; // kg CO2 per kg
  bestCo2g: number; // Best case CO2 in grams for ecoScore calculation
  worstCo2g: number; // Worst case CO2 in grams for ecoScore calculation
}

export interface Co2CalculationRequest {
  productWeightKg: number;
  efKgCO2PerKg: number;
  packagingG?: number;
  transportG?: number;
}

export interface Co2CalculationResponse {
  co2Grams: number;
  ecoScore: number;
  breakdown: {
    baseCo2: number;
    packagingCo2: number;
    transportCo2: number;
    totalCo2: number;
  };
}

export interface EmissionFactor {
  material: string;
  kgCO2PerKg: number;
  description: string;
}

class LocalApiService {
  private readonly products: Product[] = [
    // EXCELLENT ECO SCORE (80-100) - Low impact materials
    {
      id: '1',
      name: 'Bamboo Cutlery Set',
      category: 'bamboo',
      description: 'Reusable bamboo cutlery set with carrying case',
      ef: EF.bamboo.kgCO2PerKg,
      bestCo2g: 2,
      worstCo2g: 10,
    },
    {
      id: '2',
      name: 'Recycled Paper Notebook',
      category: 'paper',
      description: 'A4 notebook made from 100% recycled paper',
      ef: EF.paper.kgCO2PerKg,
      bestCo2g: 3,
      worstCo2g: 15,
    },
    {
      id: '3',
      name: 'Recycled Glass Bottle',
      category: 'glass',
      description: '500ml glass bottle made from recycled glass',
      ef: EF.glass.kgCO2PerKg,
      bestCo2g: 5,
      worstCo2g: 20,
    },
    {
      id: '4',
      name: 'Cardboard Packaging Box',
      category: 'cardboard',
      description: 'Eco-friendly cardboard packaging box',
      ef: EF.cardboard.kgCO2PerKg,
      bestCo2g: 4,
      worstCo2g: 25,
    },
    
    // GOOD ECO SCORE (60-79) - Medium impact materials
    {
      id: '5',
      name: 'Recycled Steel Water Bottle',
      category: 'steel',
      description: 'Stainless steel water bottle made from recycled steel',
      ef: 0.5, // Recycled steel
      bestCo2g: 8,
      worstCo2g: 50,
    },
    {
      id: '6',
      name: 'Recycled Aluminum Can',
      category: 'aluminum',
      description: '330ml aluminum can made from recycled aluminum',
      ef: 2.5, // Recycled aluminum
      bestCo2g: 10,
      worstCo2g: 60,
    },
    {
      id: '7',
      name: 'Concrete Building Block',
      category: 'concrete',
      description: 'Standard concrete building block',
      ef: EF.concrete.kgCO2PerKg,
      bestCo2g: 1,
      worstCo2g: 5,
    },
    {
      id: '8',
      name: 'Polyester Jacket',
      category: 'polyester',
      description: 'Lightweight polyester jacket',
      ef: EF.polyester.kgCO2PerKg,
      bestCo2g: 15,
      worstCo2g: 100,
    },
    
    // AVERAGE ECO SCORE (40-59) - High impact materials
    {
      id: '9',
      name: 'Virgin Plastic Bottle',
      category: 'plastic',
      description: '500ml plastic bottle made from virgin plastic',
      ef: EF.plastic.kgCO2PerKg,
      bestCo2g: 20,
      worstCo2g: 150,
    },
    {
      id: '10',
      name: 'Aluminum Foil',
      category: 'aluminum',
      description: 'Standard aluminum foil roll',
      ef: EF.aluminum.kgCO2PerKg,
      bestCo2g: 25,
      worstCo2g: 200,
    },
    {
      id: '11',
      name: 'Cotton T-Shirt',
      category: 'cotton',
      description: '100% cotton t-shirt',
      ef: EF.cotton.kgCO2PerKg,
      bestCo2g: 30,
      worstCo2g: 300,
    },
    {
      id: '12',
      name: 'Leather Wallet',
      category: 'leather',
      description: 'Genuine leather wallet',
      ef: EF.leather.kgCO2PerKg,
      bestCo2g: 40,
      worstCo2g: 400,
    },
    
    // POOR ECO SCORE (20-39) - Very high impact materials
    {
      id: '13',
      name: 'Smartphone',
      category: 'electronics',
      description: 'Smartphone with high energy consumption',
      ef: EF.electronics.kgCO2PerKg,
      bestCo2g: 100,
      worstCo2g: 800,
    },
    {
      id: '14',
      name: 'Cement Block',
      category: 'cement',
      description: 'Standard cement building block',
      ef: EF.cement.kgCO2PerKg,
      bestCo2g: 5,
      worstCo2g: 50,
    },
    {
      id: '15',
      name: 'Laptop Computer',
      category: 'electronics',
      description: 'Laptop computer with high energy consumption',
      ef: 30.0, // Higher than smartphone due to larger size
      bestCo2g: 200,
      worstCo2g: 1200,
    },
    {
      id: '16',
      name: 'Beef Jerky (for comparison)',
      category: 'beef',
      description: 'Dried beef jerky - extremely high carbon footprint',
      ef: EF.beef.kgCO2PerKg,
      bestCo2g: 300,
      worstCo2g: 2000,
    },
  ];

  private readonly emissionFactors: EmissionFactor[] = [
    { material: 'bamboo', kgCO2PerKg: EF.bamboo.kgCO2PerKg, description: 'Bamboo products' },
    { material: 'paper', kgCO2PerKg: EF.paper.kgCO2PerKg, description: 'Recycled paper' },
    { material: 'cardboard', kgCO2PerKg: EF.cardboard.kgCO2PerKg, description: 'Cardboard packaging' },
    { material: 'glass', kgCO2PerKg: EF.glass.kgCO2PerKg, description: 'Recycled glass' },
    { material: 'steel', kgCO2PerKg: EF.steel.kgCO2PerKg, description: 'Steel (recycled: 0.5)' },
    { material: 'aluminum', kgCO2PerKg: EF.aluminum.kgCO2PerKg, description: 'Aluminum (recycled: 2.5)' },
    { material: 'concrete', kgCO2PerKg: EF.concrete.kgCO2PerKg, description: 'Concrete' },
    { material: 'plastic', kgCO2PerKg: EF.plastic.kgCO2PerKg, description: 'Virgin plastic' },
    { material: 'polyester', kgCO2PerKg: EF.polyester.kgCO2PerKg, description: 'Polyester fabric' },
    { material: 'cotton', kgCO2PerKg: EF.cotton.kgCO2PerKg, description: 'Conventional cotton' },
    { material: 'leather', kgCO2PerKg: EF.leather.kgCO2PerKg, description: 'Leather' },
    { material: 'electronics', kgCO2PerKg: EF.electronics.kgCO2PerKg, description: 'Electronic devices' },
    { material: 'cement', kgCO2PerKg: EF.cement.kgCO2PerKg, description: 'Cement' },
    { material: 'beef', kgCO2PerKg: EF.beef.kgCO2PerKg, description: 'Beef (for comparison)' },
  ];

  /**
   * Get all products
   */
  async getProducts(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }

  /**
   * Get product by ID
   */
  async getProduct(id: string): Promise<Product | undefined> {
    return Promise.resolve(this.products.find(product => product.id === id));
  }

  /**
   * Get emission factors
   */
  async getEmissionFactors(): Promise<EmissionFactor[]> {
    return Promise.resolve(this.emissionFactors);
  }

  /**
   * Calculate CO2 emissions in grams
   */
  calculateCO2(
    productWeightKg: number,
    efKgCO2PerKg: number,
    packagingG: number = 0,
    transportG: number = 0
  ): number {
    const baseG = productWeightKg * efKgCO2PerKg * 1000; // kg->g
    return Math.round(baseG + packagingG + transportG);  // return grams CO2e
  }

  /**
   * Calculate EcoScore from CO2 grams (0-100 scale)
   * Lower CO2 = Higher score
   */
  ecoScoreFromCo2(co2g: number, best: number, worst: number): number {
    const ratio = (co2g - best) / Math.max(1, (worst - best));
    return Math.max(0, Math.min(100, Math.round(100 * (1 - ratio))));
  }

  /**
   * Calculate complete CO2 footprint with EcoScore
   */
  calculateFootprint(
    request: Co2CalculationRequest, 
    bestCo2g: number, 
    worstCo2g: number
  ): Co2CalculationResponse {
    const baseCo2 = request.productWeightKg * request.efKgCO2PerKg * 1000;
    const packagingCo2 = request.packagingG || 0;
    const transportCo2 = request.transportG || 0;
    const totalCo2 = Math.round(baseCo2 + packagingCo2 + transportCo2);
    
    const ecoScore = this.ecoScoreFromCo2(totalCo2, bestCo2g, worstCo2g);

    return {
      co2Grams: totalCo2,
      ecoScore,
      breakdown: {
        baseCo2: Math.round(baseCo2),
        packagingCo2,
        transportCo2,
        totalCo2,
      },
    };
  }

  /**
   * Get EcoScore interpretation
   */
  getEcoScoreInterpretation(ecoScore: number): string {
    if (ecoScore >= 90) return 'Excellent - Very sustainable';
    if (ecoScore >= 80) return 'Very Good - Highly sustainable';
    if (ecoScore >= 70) return 'Good - Sustainable';
    if (ecoScore >= 60) return 'Fair - Moderately sustainable';
    if (ecoScore >= 50) return 'Average - Room for improvement';
    if (ecoScore >= 40) return 'Below Average - Needs improvement';
    if (ecoScore >= 30) return 'Poor - Not very sustainable';
    if (ecoScore >= 20) return 'Very Poor - Unsustainable';
    return 'Critical - Extremely unsustainable';
  }

  /**
   * Simple CO2 calculation
   */
  calculateSimple(request: {
    productWeightKg: number;
    efKgCO2PerKg: number;
    packagingG?: number;
    transportG?: number;
  }): { co2Grams: number } {
    const co2Grams = this.calculateCO2(
      request.productWeightKg,
      request.efKgCO2PerKg,
      request.packagingG || 0,
      request.transportG || 0
    );
    
    return { co2Grams };
  }

  /**
   * Get CO2 service info
   */
  getCo2Info(): { message: string } {
    return { message: 'CO2 calculation service is running' };
  }
}

// Export singleton instance
export const localApiService = new LocalApiService();

// Export types for use in other files
export type { Product, Co2CalculationRequest, Co2CalculationResponse, EmissionFactor };
