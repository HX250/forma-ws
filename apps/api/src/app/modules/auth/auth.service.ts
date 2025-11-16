import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';

import {
  Client,
  Coach,
  CoachRepository,
  ClientRepository,
  SecurityService,
} from '@forma-ws/backend-shared';
import {
  LoginDto,
  RegisterCoachDto,
  RegisterClientDto,
  SetClientPasswordDto,
  AuthPayload,
  UserType,
} from '@forma-ws/domain';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private securityService: SecurityService,
    private coachRepository: CoachRepository,
    private clientRepository: ClientRepository
  ) {}

  async login(loginDto: LoginDto, response: Response): Promise<AuthPayload> {
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

    const tokens = await this.securityService.generateTokens(
      user.getAuthPayload()
    );

    this.securityService.setCookies(response, tokens);

    return {
      sub: user.id,
      email: user.email,
      userType: userType,
    };
  }

  async registerCoach(
    registerDto: RegisterCoachDto,
    response: Response
  ): Promise<AuthPayload> {
    const existingCoach = await this.coachRepository.findByEmail(
      registerDto.email
    );
    if (existingCoach) {
      throw new ConflictException('Coach with this email already exists');
    }

    const coach = await Coach.createWithHashedPassword(registerDto);
    const savedCoach = await this.coachRepository.save(coach);
    const tokens = await this.securityService.generateTokens(
      savedCoach.getAuthPayload()
    );

    this.securityService.setCookies(response, tokens);

    return {
      sub: savedCoach.id,
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
      oneTimePassword,
      registerDto.canTrackExercise,
      registerDto.canTrackSleep,
      registerDto.canTrackNutrition,
      registerDto.canTrackWater
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
  ): Promise<AuthPayload> {
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
    const tokens = await this.securityService.generateTokens(
      updatedClient.getAuthPayload()
    );

    this.securityService.setCookies(response, tokens);

    return {
      sub: updatedClient.id,
      email: updatedClient.email,
      userType: UserType.CLIENT,
    };
  }

  async getCurrentUser(authPayload: AuthPayload): Promise<Client | Coach> {
    const { sub, userType } = authPayload;

    const repository =
      userType === UserType.COACH
        ? this.coachRepository
        : this.clientRepository;
    const user = await repository.findById(sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user.toJSON();
  }

  private generateOneTimePassword(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }
}
