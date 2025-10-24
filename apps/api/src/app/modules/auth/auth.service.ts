import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

import {
  Client,
  Coach,
  CoachRepository,
  ClientRepository,
} from '@forma-ws/backend-shared';
import {
  AuthResponseDto,
  LoginDto,
  RegisterCoachDto,
  RegisterClientDto,
  SetClientPasswordDto,
  AuthPayload,
  AuthTokens,
  UserType,
} from '@forma-ws/domain';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private coachRepository: CoachRepository,
    private clientRepository: ClientRepository
  ) {}

  async login(
    loginDto: LoginDto,
    response: Response
  ): Promise<AuthResponseDto> {
    const { email, password, userType } = loginDto;
    let user: Coach | Client;

    if (userType === UserType.COACH) {
      user = await this.coachRepository.findByEmail(email);
    } else {
      user = await this.clientRepository.findByEmail(email);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.getAuthPayload());

    this.setCookies(response, tokens);

    return {
      userId: user.id,
      email: user.email,
      userType: userType,
    };
  }

  async registerCoach(
    registerDto: RegisterCoachDto,
    response: Response
  ): Promise<AuthResponseDto> {
    const existingCoach = await this.coachRepository.findByEmail(
      registerDto.email
    );
    if (existingCoach) {
      throw new ConflictException('Coach with this email already exists');
    }

    const coach = await Coach.createWithHashedPassword(registerDto);
    const savedCoach = await this.coachRepository.save(coach);
    const tokens = await this.generateTokens(savedCoach.getAuthPayload());

    this.setCookies(response, tokens);

    return {
      userId: savedCoach.id,
      email: savedCoach.email,
      userType: UserType.COACH,
    };
  }

  async registerClient(
    registerDto: RegisterClientDto
  ): Promise<{ userId: string }> {
    const existingClient = await this.clientRepository.findByEmail(
      registerDto.email
    );
    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    const oneTimePassword = this.generateOneTimePassword();

    const client = await Client.createWithOneTimePassword(
      registerDto.email,
      registerDto.coachId,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.gender,
      new Date(registerDto.birthDate),
      registerDto.currentWeight,
      registerDto.height,
      registerDto.activityLevel,
      registerDto.medicalConditions,
      registerDto.fitnessExperience,
      oneTimePassword
    );

    const savedClient = await this.clientRepository.save(client);

    return {
      userId: savedClient.id,
    };
  }

  async setClientPassword(
    clientId: string,
    setPasswordDto: SetClientPasswordDto,
    response: Response
  ): Promise<AuthResponseDto> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new UnauthorizedException('Client not found');
    }

    if (!client.needsPasswordSetup()) {
      throw new ConflictException('Client already has permanent password');
    }

    await client.setPermamentPassword(setPasswordDto.newPassword);
    const updatedClient = await this.clientRepository.updateAfterPasswordSet(
      client
    );
    const tokens = await this.generateTokens(updatedClient.getAuthPayload());

    this.setCookies(response, tokens);

    return {
      userId: updatedClient.id,
      email: updatedClient.email,
      userType: UserType.CLIENT,
    };
  }

  async refreshTokens(
    refreshToken: string,
    response: Response
  ): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const tokens = await this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType,
        coachId: payload.coachId,
      });

      this.setCookies(response, tokens);

      return {
        userId: payload.sub,
        email: payload.email,
        userType: payload.userType,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async setCookies(response: Response, tokens: AuthTokens) {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', true),
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: this.configService.get<number>(
        'JWT_ACCESS_EXPIRES_IN_MS',
        15 * 60 * 1000
      ),
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<boolean>('COOKIE_SECURE', true),
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: this.configService.get<number>(
        'JWT_REFRESH_EXPIRES_IN_MS',
        7 * 24 * 60 * 60 * 1000
      ),
    });
  }

  private async generateTokens(payload: AuthPayload): Promise<AuthTokens> {
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

  private generateOneTimePassword(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }
}
