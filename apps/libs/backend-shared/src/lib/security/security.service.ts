import { AuthTokens, AuthPayload } from '@forma-ws/domain';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { Response } from 'express';

@Injectable()
export class SecurityService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async setCookies(response: Response, tokens: AuthTokens) {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: this.configService.get<number>(
        'JWT_ACCESS_EXPIRES_IN_MS',
        15 * 60 * 1000
      ),
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: this.configService.get<number>(
        'JWT_REFRESH_EXPIRES_IN_MS',
        7 * 24 * 60 * 60 * 1000
      ),
    });
  }

  async generateTokens(payload: AuthPayload): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d'
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(
    refreshToken: string,
    response: Response
  ): Promise<AuthPayload> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const tokens = await this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType,
      });

      this.setCookies(response, tokens);

      return {
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<AuthPayload> {
    return this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  generateOneTimePassword(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }
}
