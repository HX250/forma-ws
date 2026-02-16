import { Test, TestingModule } from '@nestjs/testing';
import { WeightService } from './weight.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import { ChartSpaceValues } from '@forma-ws/domain';
import { createMockDatabaseService } from '../../../../../testing/common-mocks';

describe('WeightService', () => {
  let service: WeightService;
  let databaseService: DatabaseService;

  const mockDatabaseService = createMockDatabaseService();

  beforeEach(async () => {
    mockDatabaseService.$transaction = jest.fn((callback) => {
      if (typeof callback === 'function') {
        return callback(mockDatabaseService);
      }
      return Promise.resolve(callback);
    });

    mockDatabaseService.weighIn = {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeightService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<WeightService>(WeightService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logDailyWeighIn', () => {
    it('should log daily weigh-in and update client current weight', async () => {
      const weightData = {
        weight: 75.5,
        bodyFatPercentage: 18.5,
        muscleMass: 55.2,
        notes: 'Feeling good',
      };

      mockDatabaseService.weighIn.upsert.mockResolvedValue({});
      mockDatabaseService.client.update.mockResolvedValue({});

      const result = await service.logDailyWeighIn('client-123', weightData);

      expect(result).toBe(true);
      expect(mockDatabaseService.$transaction).toHaveBeenCalled();
    });

    it('should handle weigh-in without optional fields', async () => {
      const weightData = {
        weight: 75.5,
      };

      mockDatabaseService.weighIn.upsert.mockResolvedValue({});
      mockDatabaseService.client.update.mockResolvedValue({});

      const result = await service.logDailyWeighIn('client-123', weightData);

      expect(result).toBe(true);
    });
  });

  describe('getTodayWeighIn', () => {
    it("should return today's weigh-in data", async () => {
      const mockWeighIn = {
        id: 'weighin-123',
        weight: 75.5,
        bodyFatPercentage: 18.5,
        muscleMass: 55.2,
        notes: 'Morning weigh-in',
        createdAt: new Date(),
      };

      mockDatabaseService.weighIn.findFirst.mockResolvedValue(mockWeighIn);

      const result = await service.getTodayWeighIn('client-123');

      expect(result).toEqual(mockWeighIn);
      expect(mockDatabaseService.weighIn.findFirst).toHaveBeenCalled();
    });

    it('should return null when no weigh-in for today', async () => {
      mockDatabaseService.weighIn.findFirst.mockResolvedValue(null);

      const result = await service.getTodayWeighIn('client-123');

      expect(result).toBeNull();
    });
  });

  describe('getWeightTracking', () => {
    it('should return weekly weight data for DAY span', async () => {
      const mockWeighIns = [
        { date: new Date('2024-02-12'), weight: 75.5 },
        { date: new Date('2024-02-14'), weight: 75.2 },
      ];

      mockDatabaseService.weighIn.findMany.mockResolvedValue(mockWeighIns);

      const result = await service.getWeightTracking(
        'client-123',
        ChartSpaceValues.DAY
      );

      expect(result).toHaveProperty('span', ChartSpaceValues.DAY);
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('data');
      expect(result.labels).toHaveLength(7);
    });

    it('should return monthly averages for THREE_MONTHS span', async () => {
      const mockWeighIns = [
        { date: new Date('2024-01-15'), weight: 76.0 },
        { date: new Date('2024-02-15'), weight: 75.5 },
      ];

      mockDatabaseService.weighIn.findMany.mockResolvedValue(mockWeighIns);

      const result = await service.getWeightTracking(
        'client-123',
        ChartSpaceValues.THREE_MONTHS
      );

      expect(result).toHaveProperty('span', ChartSpaceValues.THREE_MONTHS);
      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('data');
    });
  });
});
