import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TaxiService {
  private socrataUrl: string;
  private socrataToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, 
  ) {
    this.socrataUrl = this.configService.get<string>('SOCRATA_URL');
    this.socrataToken = this.configService.get<string>('SOCRATA_APP_TOKEN');
  }

  async getTaxi(
    startTime?: string,
    endTime?: string,
    minFare?: number,
    maxFare?: number,
    minTripDistance?: number,
    maxTripDistance?: number,
    paymentType?: string,
  ) {
    let filters = [];

    if (startTime && endTime) {
      filters.push(`pickup_datetime >= '${startTime}' AND pickup_datetime <= '${endTime}'`);
    }
    if (minFare) {
      filters.push(`fare_amount >= ${minFare}`);
    }
    if (maxFare) {
      filters.push(`fare_amount <= ${maxFare}`);
    }
    if (minTripDistance) {
      filters.push(`trip_distance >= ${minTripDistance}`);
    }
    if (maxTripDistance) {
      filters.push(`trip_distance <= ${maxTripDistance}`);
    }
    if (paymentType) {
      filters.push(`payment_type = '${paymentType}'`);
    }

    const whereClause = filters.length > 0 ? filters.join(' AND ') : undefined;

    const params: any = {};

    if (whereClause) {
      params.$where = whereClause;
    }

    try {

      const response = await lastValueFrom(
        this.httpService.get(this.socrataUrl, {
          params,
          headers: {
            'X-App-Token': this.socrataToken, 
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error(
        'Failed to fetch data from Socrata:',
        error.response?.data || error.message,
      );
      throw new Error(`Failed to fetch data from Socrata: ${error.message}`);
    }
  }
}
