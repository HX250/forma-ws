import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@forma-ws/backend-shared';
import { SecurityModule } from './modules/security/security.module';
import { ClientsModule } from './modules/clients/clients.module';

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
    SecurityModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
