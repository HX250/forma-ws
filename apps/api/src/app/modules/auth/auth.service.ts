import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';
import { SecurityService } from '@forma-ws/backend-shared';
import {
  LoginDto,
  RegisterCoachDto,
  RegisterClientDto,
  SetClientPasswordDto,
  AuthResponse,
  Client,
  Coach,
  UserType,
  AuthPayload,
} from '@forma-ws/domain';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { prismaToPlain } from '../../utils/prisma-to-plain';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly securityService: SecurityService
  ) {}

  async login(dto: LoginDto, res: Response): Promise<AuthResponse> {
    const { email, password, userType } = dto;

    if (userType === UserType.COACH) {
      const coach = await this.prisma.coach.findUnique({ where: { email } });
      if (!coach) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isValid = await bcrypt.compare(password, coach.password);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: AuthPayload = {
        sub: coach.id,
        email: coach.email,
        userType: UserType.COACH,
      };

      const tokens = this.securityService.generateTokens(payload);
      this.securityService.setCookies(res, tokens);

      return {
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType,
      };
    } else {
      const client = await this.prisma.client.findUnique({ where: { email } });
      if (!client) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isValidPassword = await this.validateClientPassword(
        client,
        password
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: AuthPayload = {
        sub: client.id,
        email: client.email,
        userType: UserType.CLIENT,
      };

      const tokens = this.securityService.generateTokens(payload);
      this.securityService.setCookies(res, tokens);

      return {
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType,
      };
    }
  }

  async registerCoach(dto: RegisterCoachDto, res: Response): Promise<Coach> {
    const existingCoach = await this.prisma.coach.findUnique({
      where: { email: dto.email },
    });

    if (existingCoach) {
      throw new ConflictException('Coach with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const coach = await this.prisma.coach.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        yearsOfExperience: dto.yearsOfExperience,
        specializationFields: dto.specializationFields,
        bio: dto.bio,
        pricing: dto.pricing,
        availability: dto.availability
          ? (dto.availability as unknown as Prisma.InputJsonValue)
          : null,
        communicationMethods: dto.communicationMethods,
      },
    });

    const payload: AuthPayload = {
      sub: coach.id,
      email: coach.email,
      userType: UserType.COACH,
    };

    const tokens = this.securityService.generateTokens(payload);
    this.securityService.setCookies(res, tokens);

    return prismaToPlain<Coach>(coach);
  }

  async registerClient(dto: RegisterClientDto): Promise<Client> {
    const existingClient = await this.prisma.client.findUnique({
      where: { email: dto.email },
    });

    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    const oneTimePassword = this.generateOTP();

    const client = await this.prisma.client.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        birthDate: new Date(dto.birthDate),
        currentWeight: dto.currentWeight,
        height: dto.height,
        activityLevel: dto.activityLevel,
        medicalConditions: dto.medicalConditions,
        fitnessExperience: dto.fitnessExperience,
        coachId: dto.coachId,
        oneTimePassword,
        isFirstLogin: true,
        canTrackExercise: dto.canTrackExercise,
        canTrackSleep: dto.canTrackSleep,
        canTrackNutrition: dto.canTrackNutrition,
        canTrackWater: dto.canTrackWater,
      },
    });

    return prismaToPlain<Client>(client);
  }

  async setClientPassword(
    clientId: string,
    dto: SetClientPasswordDto,
    res: Response
  ): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    if (!client.isFirstLogin) {
      throw new BadRequestException('Password already set');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    const updated = await this.prisma.client.update({
      where: { id: clientId },
      data: {
        password: hashedPassword,
        oneTimePassword: null,
        isFirstLogin: false,
      },
    });

    const payload: AuthPayload = {
      sub: updated.id,
      email: updated.email,
      userType: UserType.CLIENT,
    };

    const tokens = this.securityService.generateTokens(payload);
    this.securityService.setCookies(res, tokens);

    return prismaToPlain<Client>(updated);
  }

  async getCurrentUser(payload: AuthPayload): Promise<Client | Coach> {
    if (payload.userType === 'COACH') {
      const coach = await this.prisma.coach.findUnique({
        where: { id: payload.sub },
      });
      if (!coach) throw new UnauthorizedException('Coach not found');
      return prismaToPlain<Coach>(coach);
    } else {
      const client = await this.prisma.client.findUnique({
        where: { id: payload.sub },
        include: {
          coach: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          goals: true,
        },
      });
      if (!client) throw new UnauthorizedException('Client not found');
      return prismaToPlain<Client>(client);
    }
  }

  async logout(res: Response): Promise<void> {
    this.securityService.clearCookies(res);
  }

  async refreshTokens(
    refreshToken: string,
    res: Response
  ): Promise<AuthResponse> {
    try {
      const payload = this.securityService.verifyRefreshToken(refreshToken);
      const tokens = this.securityService.generateTokens(payload);
      this.securityService.setCookies(res, tokens);

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

  private generateOTP(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }
}
