import { Injectable, ConflictException } from '@nestjs/common';
import { DatabaseService } from '@forma-ws/backend-shared';
import { RegisterCoachDto, Coach } from '@forma-ws/domain';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { prismaToPlain } from '../../../../../../libs/backend-shared/src/lib/utils/prisma-to-plain';

@Injectable()
export class CoachSecurityService {
  constructor(private readonly prisma: DatabaseService) {}

  async registerCoach(dto: RegisterCoachDto): Promise<Coach> {
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

    return prismaToPlain<Coach>(coach);
  }
}
