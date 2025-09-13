import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CoachRepository } from '../../repositories/auth/coach.repository';
import { ClientRepository } from '../../repositories/auth/client.repository';
import { AuthPayload } from '@forma-ws/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private coachRepository: CoachRepository,
    private clientRepository: ClientRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          console.error('❌ JWT_SECRET is missing in environment variables');
          throw new Error('JWT_SECRET is not defined');
        }
        return secret;
      })(),
    });
  }

  async validate(payload: AuthPayload) {
    const user =
      payload.userType === 'COACH'
        ? await this.coachRepository.findById(payload.sub)
        : await this.clientRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
