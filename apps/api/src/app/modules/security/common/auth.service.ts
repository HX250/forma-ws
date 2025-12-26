import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { DatabaseService } from '@forma-ws/backend-shared';
import { TokenService } from './token/token.service';
import {
  LoginDto,
  Client,
  Coach,
  AuthPayload,
  UserType,
} from '@forma-ws/domain';
import * as bcrypt from 'bcrypt';
import { prismaToPlain } from '../../../utils/prisma-to-plain';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly tokenService: TokenService
  ) {}

  async login(dto: LoginDto, res: Response): Promise<AuthPayload> {
    const { email, password, userType } = dto;

    const user =
      userType === UserType.COACH
        ? await this.prisma.coach.findUnique({ where: { email } })
        : await this.prisma.client.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid =
      userType === UserType.CLIENT
        ? await this.validateClientPassword(user, password)
        : await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = this.tokenService.createAuthPayload(
      user.id,
      user.email,
      userType
    );

    this.tokenService.generateAndSetTokens(payload, res);

    return {
      sub: payload.sub,
      email: payload.email,
      userType: payload.userType,
    };
  }

  async refreshTokens(
    refreshToken: string,
    res: Response
  ): Promise<AuthPayload> {
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      this.tokenService.generateAndSetTokens(payload, res);

      return {
        sub: payload.sub,
        email: payload.email,
        userType:
          payload.userType === UserType.COACH
            ? UserType.COACH
            : UserType.CLIENT,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: Response): Promise<void> {
    this.tokenService.clearTokens(res);
  }

  async getCurrentUser(payload: AuthPayload): Promise<Coach | Client> {
    if (payload.userType === 'COACH') {
      let coach = await this.prisma.coach.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!coach) throw new UnauthorizedException('Coach not found');

      return prismaToPlain<Coach>(coach);
    } else {
      const client = await this.prisma.client.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isFirstLogin: true,
        },
      });

      if (!client) throw new UnauthorizedException('Client not found');

      return prismaToPlain<Client>(client);
    }
  }

  private async validateClientPassword(
    client: any,
    password: string
  ): Promise<boolean> {
    if (client.isFirstLogin && client.oneTimePassword) {
      return password === client.oneTimePassword;
    }
    if (client.password) {
      return bcrypt.compare(password, client.password);
    }
    return false;
  }
}
