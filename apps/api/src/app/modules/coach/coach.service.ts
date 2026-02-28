import { DatabaseService } from '@forma-ws/backend-shared';
import { prismaToPlain } from '../../../../../libs/backend-shared/src/lib/utils/prisma-to-plain';
import {
  CoachPersonalProfile,
  CoachProfessionalProfile,
  CoachAvailabilityProfile,
  UpdateCoachPersonalDto,
  UpdateCoachProfessionalDto,
  UpdateCoachAvailabilityDto,
  UserType,
} from '@forma-ws/domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoachService {
  constructor(private readonly prisma: DatabaseService) {}

  async getPersonalProfile(coachId: string): Promise<CoachPersonalProfile> {
    const coach = await this.prisma.coach.findUnique({
      where: { id: coachId },
      select: { firstName: true, lastName: true, gender: true },
    });

    if (!coach) throw new NotFoundException(`Coach ${coachId} not found`);

    return prismaToPlain<CoachPersonalProfile>(coach);
  }

  async updatePersonalProfile(
    coachId: string,
    dto: UpdateCoachPersonalDto
  ): Promise<CoachPersonalProfile> {
    await this.assertExists(coachId);

    const updated = await this.prisma.coach.update({
      where: { id: coachId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
      },
      select: { firstName: true, lastName: true, gender: true },
    });

    return prismaToPlain<CoachPersonalProfile>(updated);
  }

  async getProfessionalProfile(
    coachId: string
  ): Promise<CoachProfessionalProfile> {
    const coach = await this.prisma.coach.findUnique({
      where: { id: coachId },
      select: {
        yearsOfExperience: true,
        specializationFields: true,
        bio: true,
        pricing: true,
      },
    });

    if (!coach) throw new NotFoundException(`Coach ${coachId} not found`);

    return prismaToPlain<CoachProfessionalProfile>(coach);
  }

  async updateProfessionalProfile(
    coachId: string,
    dto: UpdateCoachProfessionalDto
  ): Promise<CoachProfessionalProfile> {
    await this.assertExists(coachId);

    const updated = await this.prisma.coach.update({
      where: { id: coachId },
      data: {
        yearsOfExperience: dto.yearsOfExperience,
        specializationFields: dto.specializationFields,
        bio: dto.bio,
        pricing: dto.pricing,
      },
      select: {
        yearsOfExperience: true,
        specializationFields: true,
        bio: true,
        pricing: true,
      },
    });

    return prismaToPlain<CoachProfessionalProfile>(updated);
  }

  async getAvailabilityProfile(
    coachId: string
  ): Promise<CoachAvailabilityProfile> {
    const coach = await this.prisma.coach.findUnique({
      where: { id: coachId },
      select: { availability: true, communicationMethods: true },
    });

    if (!coach) throw new NotFoundException(`Coach ${coachId} not found`);

    return prismaToPlain<CoachAvailabilityProfile>(coach);
  }

  async updateAvailabilityProfile(
    coachId: string,
    dto: UpdateCoachAvailabilityDto
  ): Promise<CoachAvailabilityProfile> {
    await this.assertExists(coachId);

    const updated = await this.prisma.coach.update({
      where: { id: coachId },
      data: {
        availability: dto.availability as unknown as Prisma.InputJsonValue,
        communicationMethods: dto.communicationMethods,
      },
      select: { availability: true, communicationMethods: true },
    });

    return prismaToPlain<CoachAvailabilityProfile>(updated);
  }

  async deleteAccount(coachId: string): Promise<void> {
    await this.assertExists(coachId);
    await this.prisma.coach.delete({ where: { id: coachId } });
  }

  async resolveCoachId(userId: string, userType: string): Promise<string> {
    if (userType === UserType.COACH) return userId;

    const client = await this.prisma.client.findUnique({
      where: { id: userId },
      select: { coachId: true },
    });

    if (!client) throw new NotFoundException(`Client ${userId} not found`);
    return client.coachId;
  }

  private async assertExists(coachId: string): Promise<void> {
    const exists = await this.prisma.coach.findUnique({
      where: { id: coachId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(`Coach ${coachId} not found`);
  }
}
