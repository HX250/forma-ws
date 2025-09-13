import { Coach } from '@forma-ws/domain';
import { DatabaseService } from '@forma-ws/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CoachRepository {
  constructor(private prisma: DatabaseService) {}

  async findById(id: string): Promise<Coach | null> {
    const coach = await this.prisma.coach.findUnique({
      where: { id },
    });

    if (!coach) return null;

    return this.getParsedCoach(coach);
  }

  async findByEmail(email: string): Promise<Coach | null> {
    const coach = await this.prisma.coach.findUnique({
      where: { email },
    });

    if (!coach) return null;

    return this.getParsedCoach(coach);
  }

  async save(coach: Coach): Promise<Coach> {
    const data = coach.toPrisma();

    const savedCoach = await this.prisma.coach.create({ data });

    return this.getParsedCoach(savedCoach);
  }

  private getParsedCoach(coach: any): Coach {
    return new Coach(
      coach.email,
      coach.password,
      coach.firstName,
      coach.lastName,
      coach.gender,
      coach.yearsOfExperience,
      coach.specializationFields,
      coach.certificates,
      coach.communicationMethods,
      coach.profilePhoto,
      coach.bio,
      coach.pricing.toNumber(),
      coach.availability,
      coach.timezone,
      coach.createdAt,
      coach.updatedAt,
      coach.id
    );
  }
}
