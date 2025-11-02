import { DatabaseService } from '../../database/database.service';
import { Coach } from '../../models/auth/coach.model';
import { BaseRepository } from '../base.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoachRepository extends BaseRepository<Coach> {
  constructor(private prisma: DatabaseService) {
    super();
  }

  override async findById(id: string): Promise<Coach | null> {
    const coach = await this.prisma.coach.findUnique({
      where: { id },
    });

    if (!coach) return null;

    return this.parseEntity(coach);
  }

  override async findByEmail(email: string): Promise<Coach | null> {
    const coach = await this.prisma.coach.findUnique({
      where: { email },
    });

    if (!coach) return null;

    return this.parseEntity(coach);
  }

  override async save(coach: Coach): Promise<Coach> {
    const data = coach.toPrisma();

    const savedCoach = await this.prisma.coach.create({ data });

    return this.parseEntity(savedCoach);
  }

  protected override get prismaModel(): Prisma.CoachDelegate {
    return this.prisma.coach;
  }

  protected override parseEntity(coach: any): Coach {
    return Coach.fromPrisma(coach);
  }
}
