import { TaxiService } from './taxi.service';
export declare class TaxiController {
    private taxiService;
    constructor(taxiService: TaxiService);
    getTaxi(startTime?: string, endTime?: string, minFare?: number, maxFare?: number, minTripDistance?: number, maxTripDistance?: number, paymentType?: string): Promise<any>;
}
