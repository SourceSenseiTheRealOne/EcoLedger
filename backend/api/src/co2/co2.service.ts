import { Injectable } from '@nestjs/common';

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

@Injectable()
export class Co2Service {
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
  calculateFootprint(request: Co2CalculationRequest, bestCo2g: number, worstCo2g: number): Co2CalculationResponse {
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
}
