import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { CoachRepository } from '../../repositories/auth/coach.repository';
import { ClientRepository } from '../../repositories/auth/client.repository';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { DatabaseModule } from 'apps/api/src/database/database.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CoachRepository, ClientRepository, JwtStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
