import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { CoachRepository } from '../../repositories/auth/coach.repository';
import { ClientRepository } from '../../repositories/auth/client.repository';
import { Client, Coach } from '@forma-ws/domain';
import { AuthPayload, AuthTokens } from '@forma-ws/types';
import {
  AuthResponseDto,
  LoginDto,
  RegisterCoachDto,
  RegisterClientDto,
  SetClientPasswordDto,
  UserType,
} from '@forma-ws/shared';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private coachRepository: CoachRepository,
    private clientRepository: ClientRepository
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
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

    return {
      ...tokens,
      userId: user.id,
    };
  }

  async registerCoach(registerDto: RegisterCoachDto): Promise<AuthResponseDto> {
    const existingCoach = await this.coachRepository.findByEmail(
      registerDto.email
    );
    if (existingCoach) {
      throw new ConflictException('Coach with this email already exists');
    }

    const coach = await Coach.createWithHashedPassword(registerDto);

    const savedCoach = await this.coachRepository.save(coach);

    const tokens = await this.generateTokens(savedCoach.getAuthPayload());

    return {
      ...tokens,
      userId: savedCoach.id,
    };
  }

  async registerClient(
    registerDto: RegisterClientDto
  ): Promise<AuthResponseDto> {
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

    const tokens = await this.generateTokens(savedClient.getAuthPayload());

    return {
      ...tokens,
      userId: savedClient.id,
    };
  }

  async setClientPassword(
    clientId: string,
    setPasswordDto: SetClientPasswordDto
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

    return {
      ...tokens,
      userId: updatedClient.id,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      return await this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType,
        coachId: payload.coachId,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
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
