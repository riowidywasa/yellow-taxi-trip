import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaxiModule } from './taxi/taxi.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TaxiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
