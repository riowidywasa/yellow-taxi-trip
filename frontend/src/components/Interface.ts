export interface FilterValues {
 startTime: string;
 endTime: string;
 minFare: number;
 maxFare: number;
 minTripDistance: number;
 maxTripDistance: number;
 paymentType: string;
}

export interface TaxiData {
 pickup_latitude: number;
 pickup_longitude: number;
 dropoff_latitude: number;
 dropoff_longitude: number;
 fare_amount: number;
 trip_distance: number;
 payment_type: string;
 pickup_datetime: string;
 drop_datetime: string;
}


