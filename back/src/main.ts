import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://10.11.8.1:3000',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
