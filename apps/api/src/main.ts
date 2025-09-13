import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the ConfigService instance to access environment variables.
  const configService = app.get(ConfigService);

  // --- BEGIN DEBUGGING CODE ---
  // Log the value of the JWT_SECRET to see what the application is reading.
  // This will confirm if the variable is being correctly loaded at startup.
  const jwtSecret = configService.get<string>('JWT_SECRET');
  Logger.log(`[DEBUG] JWT_SECRET value: "${jwtSecret}"`, 'Bootstrap');
  // --- END DEBUGGING CODE ---

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  app.enableCors();
  await app.listen(port, '0.0.0.0');

  Logger.log(
    `🚀 Application is running on: http://0.0.0.0:${port}/${globalPrefix}`
  );
}

bootstrap();
