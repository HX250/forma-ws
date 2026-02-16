import { Test, TestingModule } from '@nestjs/testing';
import { GoalsController } from './goal.controller';
import { GoalsService } from './goal.service';
import { GoalType } from '@forma-ws/domain';

describe('GoalsController', () => {
  let controller: GoalsController;
  let service: GoalsService;

  const mockGoalsService = {
    getClientTrackingGoals: jest.fn(),
    createOrUpdateGoal: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalsController],
      providers: [{ provide: GoalsService, useValue: mockGoalsService }],
    }).compile();

    controller = module.get<GoalsController>(GoalsController);
    service = module.get<GoalsService>(GoalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getClientTrackingGoals', () => {
    it('should return client tracking goals', async () => {
      const mockGoals = {
        generalGoals: {
          goalType: ['WEIGHT_LOSS'],
          weightGoal: 5,
          targetWeight: 70,
          targetDate: new Date('2024-12-31'),
        },
        trackingGoal: {
          nutritionGoals: {
            caloriesGoal: 2000,
            proteinTarget: 150,
            carbTarget: 200,
            fatTarget: 60,
            fiberTarget: 30,
            sugarTarget: 50,
          },
          sleepGoal: 8,
          waterGoal: 2.5,
          exerciseGoal: 30,
        },
      };

      mockGoalsService.getClientTrackingGoals.mockResolvedValue(mockGoals);

      const result = await controller.getClientTrackingGoals('client-123');

      expect(result).toEqual(mockGoals);
      expect(mockGoalsService.getClientTrackingGoals).toHaveBeenCalledWith(
        'client-123'
      );
    });
  });

  describe('createOrUpdateGoal', () => {
    it('should create or update client goals successfully', async () => {
      const goalDto = {
        goalType: [GoalType.LOSE_WEIGHT, GoalType.BUILD_MUSCLE],
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

      mockGoalsService.createOrUpdateGoal.mockResolvedValue(true);

      const result = await controller.createOrUpdateGoal('client-123', goalDto);

      expect(result).toBe(true);
      expect(mockGoalsService.createOrUpdateGoal).toHaveBeenCalledWith(
        'client-123',
        goalDto
      );
    });

    it('should handle goal updates with partial data', async () => {
      const partialGoalDto = {
        goalType: [GoalType.LOSE_WEIGHT],
        targetWeight: 75,
        caloriesGoal: 1800,
      };

      mockGoalsService.createOrUpdateGoal.mockResolvedValue(true);

      const result = await controller.createOrUpdateGoal(
        'client-123',
        partialGoalDto as any
      );

      expect(result).toBe(true);
      expect(mockGoalsService.createOrUpdateGoal).toHaveBeenCalledWith(
        'client-123',
        partialGoalDto
      );
    });
  });
});
