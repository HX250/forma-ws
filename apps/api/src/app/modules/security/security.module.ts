import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DatabaseModule,
  SecurityService,
  MailModule,
} from '@forma-ws/backend-shared';

import { SecurityController } from './common/auth.controller';
import { AuthService } from './common/auth.service';
import { TokenService } from './common/token/token.service';
import { CoachSecurityController } from './coach/coach-security.controller';
import { CoachSecurityService } from './coach/coach-security.service';
import { ClientSecurityController } from './client/client-security.controller';
import { ClientSecurityService } from './client/client-security.service';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '15m',
        },
      }),
    }),
  ],
  controllers: [
    SecurityController,
    CoachSecurityController,
    ClientSecurityController,
  ],
  providers: [
    AuthService,
    TokenService,
    CoachSecurityService,
    ClientSecurityService,
    SecurityService,
    JwtStrategy,
  ],
  exports: [
    TokenService,
    CoachSecurityService,
    ClientSecurityService,
    PassportModule,
  ],
})
export class SecurityModule {}
