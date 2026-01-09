import { Injectable } from '@nestjs/common';
import {
  DatabaseService,
  decimalToNumber,
  prismaToPlain,
} from '@forma-ws/backend-shared';
import {
  ExerciseDetail,
  ExerciseDetailList,
  ExerciseEntryDto,
  ExerciseSummary,
} from '@forma-ws/domain';
import { ExerciseEntry } from '@prisma/client';

@Injectable()
export class ExerciseService {
  constructor(private readonly prisma: DatabaseService) {}

  async searchExercises(query: string): Promise<ExerciseDetailList[]> {
    if (!query || query.length < 2) return [];

    const exercises = await this.prisma.exercise.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { nameSk: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        nameSk: true,
        category: true,
        primaryMuscle: true,
      },
      take: 20,
      orderBy: [{ isVerified: 'desc' }, { name: 'asc' }],
    });

    return prismaToPlain<ExerciseDetailList[]>(exercises);
  }

  async getExerciseById(id: string): Promise<ExerciseDetail> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        nameSk: true,
        category: true,
        primaryMuscle: true,
        isVerified: true,
        isCustom: true,
      },
    });
    return prismaToPlain<ExerciseDetail>(exercise);
  }

  async logExerciseEntry(
    dto: ExerciseEntryDto,
    clientId: string
  ): Promise<boolean> {
    await this.prisma.exerciseEntry.create({
      data: {
        clientId: clientId,
        exerciseId: dto.exerciseId,
        exerciseName: dto.exerciseName,
        exerciseNameSk: dto.exerciseNameSk,
        sets: dto.sets,
        reps: dto.reps,
        weight: dto.weight,
        duration: dto.duration,
        notes: dto.notes,
      },
    });
    return true;
  }

  async deleteExerciseEntry(
    entryId: string,
    clientId: string
  ): Promise<boolean> {
    await this.prisma.exerciseEntry.deleteMany({
      where: { id: entryId, clientId },
    });
    return true;
  }

  async getExerciseTrackingData(
    clientId: string,
    date: Date
  ): Promise<ExerciseSummary> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const entries = await this.prisma.exerciseEntry.findMany({
      where: {
        clientId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: { exercise: true },
      orderBy: { createdAt: 'desc' },
    });

    const summary = this.mapExcersiseData(entries);

    return prismaToPlain<ExerciseSummary>(summary);
  }

  private mapExcersiseData(entries: ExerciseEntry[]): ExerciseSummary {
    return {
      totalExercises: entries.length,
      totalDuration: entries.reduce((sum, e) => sum + e.duration, 0),
      totalSets: entries.reduce((sum, e) => sum + e.sets, 0),
      totalReps: entries.reduce((sum, e) => sum + e.reps, 0),
      entries: entries.map((e) => ({
        id: e.id,
        name: e.exerciseName,
        nameSk: e.exerciseNameSk,
        sets: e.sets,
        reps: e.reps,
        weight: decimalToNumber(e.weight),
        notes: e.notes,
        duration: e.duration,
      })),
    };
  }
}
