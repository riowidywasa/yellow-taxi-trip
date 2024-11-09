import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class TaxiService {
    private readonly httpService;
    private readonly configService;
    private socrataUrl;
    private socrataToken;
    constructor(httpService: HttpService, configService: ConfigService);
    getTaxi(startTime?: string, endTime?: string, minFare?: number, maxFare?: number, minTripDistance?: number, maxTripDistance?: number, paymentType?: string): Promise<any>;
}
