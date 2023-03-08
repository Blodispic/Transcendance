import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { GatewayExceptionFilter } from './app.exceptionFilter';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
  });
  app.useGlobalFilters(new GatewayExceptionFilter());
  app.use(cookieParser());
  await app.listen(4000);
}

bootstrap();
