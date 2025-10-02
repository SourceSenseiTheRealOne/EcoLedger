import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { Co2Service, Co2CalculationRequest, Co2CalculationResponse } from './co2.service';

@Controller('co2')
export class Co2Controller {
  constructor(private readonly co2Service: Co2Service) {}

  @Get()
  getCo2Info(): { message: string } {
    return { message: 'CO2 calculation service is running' };
  }

  @Post('calculate')
  calculateCo2(
    @Body() request: Co2CalculationRequest,
    @Query('bestCo2g') bestCo2g: number = 10,
    @Query('worstCo2g') worstCo2g: number = 2000
  ): Co2CalculationResponse {
    return this.co2Service.calculateFootprint(request, bestCo2g, worstCo2g);
  }

  @Get('ecoscore-interpretation')
  getEcoScoreInterpretation(@Query('score') score: number): { interpretation: string } {
    return {
      interpretation: this.co2Service.getEcoScoreInterpretation(score)
    };
  }

  @Post('calculate-simple')
  calculateSimple(
    @Body() body: {
      productWeightKg: number;
      efKgCO2PerKg: number;
      packagingG?: number;
      transportG?: number;
    }
  ): { co2Grams: number } {
    const co2Grams = this.co2Service.calculateCO2(
      body.productWeightKg,
      body.efKgCO2PerKg,
      body.packagingG || 0,
      body.transportG || 0
    );
    
    return { co2Grams };
  }
}
