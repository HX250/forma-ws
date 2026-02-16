import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import { createMockDatabaseService } from '../../../../../testing/common-mocks';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let databaseService: DatabaseService;

  const mockDatabaseService = createMockDatabaseService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getExerciseTrackingData', () => {
    it('should return exercise entries with exercise details for specified date', async () => {
      const mockEntries = [
        {
          id: '1',
          exerciseId: 'exercise-1',
          duration: 30,
          intensity: 'MODERATE',
          createdAt: new Date(),
          exercise: {
            id: 'exercise-1',
            name: 'Running',
            category: 'CARDIO',
            caloriesPerMinute: 10,
          },
        },
        {
          id: '2',
          exerciseId: 'exercise-2',
          duration: 45,
          intensity: 'HIGH',
          createdAt: new Date(),
          exercise: {
            id: 'exercise-2',
            name: 'Weight Lifting',
            category: 'STRENGTH',
            caloriesPerMinute: 8,
          },
        },
      ];

      mockDatabaseService.exerciseEntry.findMany.mockResolvedValue(mockEntries);

      const result = await service.getExerciseTrackingData(
        'client-123',
        new Date()
      );

      expect(result).toBeDefined();
      expect(result.entries).toBeDefined();
      expect(result.entries.length).toBe(2);
      expect(result.totalExercises).toBe(2);
      expect(mockDatabaseService.exerciseEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            clientId: 'client-123',
          }),
        })
      );
    });

    it('should return empty summary when no entries found', async () => {
      mockDatabaseService.exerciseEntry.findMany.mockResolvedValue([]);

      const result = await service.getExerciseTrackingData(
        'client-123',
        new Date()
      );

      expect(result).toBeDefined();
      expect(result.entries).toEqual([]);
      expect(result.totalExercises).toBe(0);
    });
  });

  describe('logExerciseEntry', () => {
    it('should create a new exercise entry with all fields', async () => {
      const exerciseData = {
        exerciseId: 'exercise-1',
        exerciseName: 'Running',
        exerciseNameSk: 'Beh',
        sets: 0,
        reps: 0,
        weight: 0,
        duration: 30,
        notes: 'Morning run',
      };

      mockDatabaseService.exerciseEntry.create.mockResolvedValue({});

      const result = await service.logExerciseEntry(exerciseData, 'client-123');

      expect(result).toBe(true);
      expect(mockDatabaseService.exerciseEntry.create).toHaveBeenCalled();
    });

    it('should create exercise entry without optional notes', async () => {
      const exerciseData = {
        exerciseId: 'exercise-1',
        exerciseName: 'Cycling',
        exerciseNameSk: 'Bicyklovanie',
        sets: 0,
        reps: 0,
        weight: 0,
        duration: 45,
        notes: '',
      };

      mockDatabaseService.exerciseEntry.create.mockResolvedValue({});

      const result = await service.logExerciseEntry(exerciseData, 'client-123');

      expect(result).toBe(true);
    });
  });

  describe('deleteExerciseEntry', () => {
    it('should delete exercise entry when it exists and belongs to client', async () => {
      mockDatabaseService.exerciseEntry.deleteMany.mockResolvedValue({
        count: 1,
      });

      const result = await service.deleteExerciseEntry(
        'entry-123',
        'client-123'
      );

      expect(result).toBe(true);
      expect(mockDatabaseService.exerciseEntry.deleteMany).toHaveBeenCalledWith(
        {
          where: { id: 'entry-123', clientId: 'client-123' },
        }
      );
    });

    it('should delete exercise entry even when not found', async () => {
      mockDatabaseService.exerciseEntry.deleteMany.mockResolvedValue({
        count: 0,
      });

      const result = await service.deleteExerciseEntry(
        'non-existent',
        'client-123'
      );

      expect(result).toBe(true);
    });

    it('should delete exercise entry for different client', async () => {
      mockDatabaseService.exerciseEntry.deleteMany.mockResolvedValue({
        count: 0,
      });

      const result = await service.deleteExerciseEntry(
        'entry-123',
        'wrong-client'
      );

      expect(result).toBe(true);
    });
  });

  describe('searchExercises', () => {
    it('should return exercises matching search query', async () => {
      const mockExercises = [
        {
          id: 'exercise-1',
          name: 'Running',
          category: 'CARDIO',
          caloriesPerMinute: 10,
        },
        {
          id: 'exercise-2',
          name: 'Treadmill Running',
          category: 'CARDIO',
          caloriesPerMinute: 9,
        },
      ];

      mockDatabaseService.exercise.findMany.mockResolvedValue(mockExercises);

      const result = await service.searchExercises('running');

      expect(result).toEqual(mockExercises);
      expect(mockDatabaseService.exercise.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'running', mode: 'insensitive' } },
              { nameSk: { contains: 'running', mode: 'insensitive' } },
            ],
          },
        })
      );
    });

    it('should limit search results', async () => {
      mockDatabaseService.exercise.findMany.mockResolvedValue([]);

      await service.searchExercises('test');

      expect(mockDatabaseService.exercise.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
        })
      );
    });
  });
});
