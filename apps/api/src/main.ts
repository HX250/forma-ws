import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cookieParser from 'cookie-parser'; // Changed import
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const frontendUrl = configService.get<string>(
    'FRONTEND_URL',
    'http://localhost:4200'
  );
  const cookieSecure = configService.get<boolean>('COOKIE_SECURE', false);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(port, '0.0.0.0');

  Logger.log(
    `🚀 Application is running on: http://0.0.0.0:${port}/${globalPrefix}`
  );
  Logger.log(`🌍 Environment: ${nodeEnv}`);
  Logger.log(`🔗 CORS enabled for: ${frontendUrl}`);
  Logger.log(`🍪 Cookies secure: ${cookieSecure}`);

  if (nodeEnv === 'development') {
    Logger.warn('⚠️  Running in DEVELOPMENT mode');
  }
}

bootstrap();
