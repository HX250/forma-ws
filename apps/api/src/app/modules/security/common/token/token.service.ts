import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { SecurityService } from '@forma-ws/backend-shared';
import { AuthPayload, UserType } from '@forma-ws/domain';

@Injectable()
export class TokenService {
  constructor(private readonly securityService: SecurityService) {}

  generateAndSetTokens(payload: AuthPayload, res: Response): void {
    const tokens = this.securityService.generateTokens(payload);
    this.securityService.setCookies(res, tokens);
  }

  clearTokens(res: Response): void {
    this.securityService.clearCookies(res);
  }

  verifyRefreshToken(refreshToken: string): AuthPayload {
    return this.securityService.verifyRefreshToken(refreshToken);
  }

  createAuthPayload(
    id: string,
    email: string,
    userType: UserType
  ): AuthPayload {
    return {
      sub: id,
      email,
      userType,
    };
  }
}
