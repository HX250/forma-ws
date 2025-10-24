import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  const allowedOrigin = 'http://localhost:4200';
  app.enableCors({
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    // 🔑 THIS MUST BE TRUE for the browser to send cookies
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(port, '0.0.0.0');

  Logger.log(
    `🚀 Application is running on: http://0.0.0.0:${port}/${globalPrefix}`
  );
}

bootstrap();
