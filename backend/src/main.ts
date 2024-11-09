import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const origin = configService.get<string>('ORIGIN');

  app.enableCors({
    origin: origin,  // Asal yang diizinkan
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Metode HTTP yang diizinkan
    credentials: true,  // Mengizinkan cookie atau header khusus
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
