// taxi.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { TaxiService } from './taxi.service';

@Controller('taxi')
export class TaxiController {
  constructor(private taxiService: TaxiService) {}

  @Get()
  async getTaxi(
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('minFare') minFare?: number,
    @Query('maxFare') maxFare?: number,
    @Query('minTripDistance') minTripDistance?: number,
    @Query('maxTripDistance') maxTripDistance?: number,
    @Query('paymentType') paymentType?: string,
  ) {
    return this.taxiService.getTaxi(

      startTime.toString().slice(0, -1),
      endTime.toString().slice(0, -1),
      minFare,
      maxFare,
      minTripDistance,
      maxTripDistance,
      paymentType,
    );
  }
}
