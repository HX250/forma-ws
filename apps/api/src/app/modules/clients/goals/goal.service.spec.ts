import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from './goal.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import { GoalType } from '@forma-ws/domain';
import { createMockDatabaseService } from '../../../../testing/common-mocks';

// Helper to create Decimal-like objects
const createDecimal = (value: number) => ({
  toNumber: () => value,
});

describe('GoalsService', () => {
  let service: GoalsService;
  let databaseService: DatabaseService;

  const mockDatabaseService = createMockDatabaseService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getClientTrackingGoals', () => {
    it('should return existing goals when found', async () => {
      const mockGoal = {
        clientId: 'client-123',
        goalType: [GoalType.LOSE_WEIGHT],
        targetWeight: createDecimal(70),
        targetDate: new Date('2024-12-31'),
        caloriesGoal: 2000,
        proteinTarget: createDecimal(150),
        carbTarget: createDecimal(200),
        fatTarget: createDecimal(60),
        fiberTarget: createDecimal(30),
        sugarTarget: createDecimal(50),
        sleepGoal: createDecimal(8),
        waterGoal: createDecimal(2.5),
        weightGoal: createDecimal(5),
        exerciseGoal: createDecimal(30),
      };

      mockDatabaseService.clientGoal.findUnique.mockResolvedValue(mockGoal);

      const result = await service.getClientTrackingGoals('client-123');

      expect(result).toBeDefined();
      expect(result.generalGoals.goalType).toEqual(['LOSE_WEIGHT']);
      expect(mockDatabaseService.clientGoal.findUnique).toHaveBeenCalledWith({
        where: { clientId: 'client-123' },
      });
    });

    it('should create default goals when none exist', async () => {
      const defaultGoal = {
        clientId: 'client-123',
        goalType: [],
        targetWeight: createDecimal(0),
        targetDate: null,
        caloriesGoal: 0,
        proteinTarget: createDecimal(0),
        carbTarget: createDecimal(0),
        fatTarget: createDecimal(0),
        fiberTarget: createDecimal(0),
        sugarTarget: createDecimal(0),
        sleepGoal: createDecimal(0),
        waterGoal: createDecimal(0),
        weightGoal: createDecimal(0),
        exerciseGoal: createDecimal(0),
      };

      mockDatabaseService.clientGoal.findUnique.mockResolvedValue(null);
      mockDatabaseService.clientGoal.create.mockResolvedValue(defaultGoal);

      const result = await service.getClientTrackingGoals('client-123');

      expect(result).toBeDefined();
      expect(mockDatabaseService.clientGoal.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          clientId: 'client-123',
          goalType: [],
        }),
      });
    });
  });

  describe('createOrUpdateGoal', () => {
    const goalDto = {
      goalType: [GoalType.LOSE_WEIGHT],
      targetWeight: 70,
      targetDate: '2024-12-31',
      caloriesGoal: 2000,
      proteinTarget: 150,
      carbTarget: 200,
      fatTarget: 60,
      fiberTarget: 30,
      sugarTarget: 50,
      sleepGoal: 8,
      waterGoal: 2.5,
      weightGoal: 5,
      exerciseGoal: 30,
    };

    it('should create new goal when none exists', async () => {
      mockDatabaseService.clientGoal.findUnique.mockResolvedValue(null);
      mockDatabaseService.clientGoal.upsert.mockResolvedValue({});

      const result = await service.createOrUpdateGoal('client-123', goalDto);

      expect(result).toBe(true);
      expect(mockDatabaseService.clientGoal.upsert).toHaveBeenCalledWith({
        where: { clientId: 'client-123' },
        update: expect.objectContaining({
          goalType: [GoalType.LOSE_WEIGHT],
          targetWeight: 70,
        }),
        create: expect.objectContaining({
          clientId: 'client-123',
          goalType: [GoalType.LOSE_WEIGHT],
        }),
      });
    });

    it('should update existing goal', async () => {
      const existingGoal = { clientId: 'client-123' };
      mockDatabaseService.clientGoal.findUnique.mockResolvedValue(existingGoal);
      mockDatabaseService.clientGoal.upsert.mockResolvedValue({});

      const result = await service.createOrUpdateGoal('client-123', goalDto);

      expect(result).toBe(true);
      expect(mockDatabaseService.clientGoal.upsert).toHaveBeenCalled();
    });
  });
});
