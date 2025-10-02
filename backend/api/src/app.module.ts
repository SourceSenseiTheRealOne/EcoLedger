import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { Co2Module } from './co2/co2.module';

@Module({
  imports: [ProductsModule, Co2Module],
})
export class AppModule {}
