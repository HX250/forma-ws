import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '@forma-ws/backend-shared';

interface AuthPayload {
  sub: string;
  email: string;
  userType: 'COACH' | 'CLIENT';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: DatabaseService) {
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
        ? await this.prisma.coach.findUnique({ where: { id: payload.sub } })
        : await this.prisma.client.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
