import { Module } from '@nestjs/common';
import { Co2Controller } from './co2.controller';
import { Co2Service } from './co2.service';

@Module({
  controllers: [Co2Controller],
  providers: [Co2Service],
})
export class Co2Module {}
