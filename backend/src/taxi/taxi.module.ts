import { Module } from "@nestjs/common";
import { TaxiController } from "./taxi.controller";
import { TaxiService } from "./taxi.service";
import { HttpModule } from "@nestjs/axios";


@Module({
 imports: [HttpModule],
 controllers: [TaxiController],
 providers: [TaxiService],
})

export class TaxiModule {}