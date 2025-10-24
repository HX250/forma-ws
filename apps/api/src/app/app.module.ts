import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { AuthModule } from './modules/auth/auth.module';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !isProduction
        ? join(process.cwd(), 'apps', 'api', 'env', 'dev.env')
        : undefined,
      ignoreEnvFile: isProduction,
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
