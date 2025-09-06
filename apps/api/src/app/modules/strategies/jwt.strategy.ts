import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { CoachRepository } from '../../repositories/auth/coach.repository';
import { ClientRepository } from '../../repositories/auth/client.repository';
import { AuthPayload } from '@forma-ws/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private coachRepository: CoachRepository,
    private clientRepository: ClientRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: AuthPayload) {
    if (payload.userType === 'COACH') {
      const coach = await this.coachRepository.findById(payload.sub);
      if (!coach) {
        throw new UnauthorizedException();
      }
    } else {
      const client = await this.clientRepository.findById(payload.sub);
      if (!client) {
        throw new UnauthorizedException();
      }
    }

    return payload;
  }
}
