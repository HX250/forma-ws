import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';
import {
  RegisterClientDto,
  SetClientPasswordDto,
  Client,
} from '@forma-ws/domain';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { prismaToPlain } from '../../../../../../libs/backend-shared/src/lib/utils/prisma-to-plain';

@Injectable()
export class ClientSecurityService {
  constructor(private readonly prisma: DatabaseService) {}

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
        birthDate: dto.birthDate,
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
    dto: SetClientPasswordDto
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

    return prismaToPlain<Client>(updated);
  }

  private generateOTP(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }
}
