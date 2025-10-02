import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService, Product } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Product | undefined {
    return this.productsService.findOne(id);
  }

  @Get('emission-factors')
  getEmissionFactors() {
    return this.productsService.getEmissionFactors();
  }
}
