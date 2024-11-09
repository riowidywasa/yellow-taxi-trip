"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxiService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let TaxiService = class TaxiService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.socrataUrl = this.configService.get('SOCRATA_URL');
        this.socrataToken = this.configService.get('SOCRATA_APP_TOKEN');
    }
    async getTaxi(startTime, endTime, minFare, maxFare, minTripDistance, maxTripDistance, paymentType) {
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
        const params = {};
        if (whereClause) {
            params.$where = whereClause;
        }
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(this.socrataUrl, {
                params,
                headers: {
                    'X-App-Token': this.socrataToken,
                },
            }));
            return response.data;
        }
        catch (error) {
            console.error('Failed to fetch data from Socrata:', error.response?.data || error.message);
            throw new Error(`Failed to fetch data from Socrata: ${error.message}`);
        }
    }
};
exports.TaxiService = TaxiService;
exports.TaxiService = TaxiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], TaxiService);
//# sourceMappingURL=taxi.service.js.map