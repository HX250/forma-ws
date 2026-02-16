import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FoodService } from './food.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import { createMockDatabaseService } from '../../../../../testing/common-mocks';

describe('FoodService', () => {
  let service: FoodService;
  let databaseService: DatabaseService;

  const mockDatabaseService = createMockDatabaseService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<FoodService>(FoodService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNutritionTrackingData', () => {
    it('should return nutrition summary for specified date', async () => {
      mockDatabaseService.nutritionEntry.findMany.mockResolvedValue([]);

      const result = await service.getNutritionTrackingData({
        clientId: 'client-123',
        createdAt: '2024-02-15',
      });

      expect(result).toBeDefined();
      expect(mockDatabaseService.nutritionEntry.findMany).toHaveBeenCalled();
    });

    it('should handle empty entries', async () => {
      mockDatabaseService.nutritionEntry.findMany.mockResolvedValue([]);

      const result = await service.getNutritionTrackingData({
        clientId: 'client-123',
        createdAt: '2024-02-15',
      });

      expect(result).toBeDefined();
    });
  });

  describe('logNutritionEntry', () => {
    it('should create a new nutrition entry', async () => {
      const nutritionData = {
        foodName: 'Chicken Breast',
        foodNameSk: 'Kuracia prsa',
        foodId: 'food-1',
        servingSize: 100,
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        sugar: 0,
        fiber: 0,
        mealType: 1,
      };

      mockDatabaseService.nutritionEntry.create.mockResolvedValue({});

      const result = await service.logNutritionEntry(
        nutritionData,
        'client-123'
      );

      expect(result).toBe(true);
      expect(mockDatabaseService.nutritionEntry.create).toHaveBeenCalled();
    });
  });

  describe('deleteNutritionEntry', () => {
    it('should delete food entry when it exists and belongs to client', async () => {
      mockDatabaseService.nutritionEntry.delete.mockResolvedValue({});

      const result = await service.deleteNutritionEntry(
        'entry-123',
        'client-123'
      );

      expect(result).toBe(true);
      expect(mockDatabaseService.nutritionEntry.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when entry not found', async () => {
      mockDatabaseService.nutritionEntry.delete.mockRejectedValue(
        new Error('Not found')
      );

      await expect(
        service.deleteNutritionEntry('non-existent', 'client-123')
      ).rejects.toThrow();
    });

    it('should throw error when entry belongs to different client', async () => {
      mockDatabaseService.nutritionEntry.delete.mockRejectedValue(
        new Error('Not found')
      );

      await expect(
        service.deleteNutritionEntry('entry-123', 'wrong-client')
      ).rejects.toThrow();
    });
  });

  describe('searchFoods', () => {
    it('should return foods matching search query', async () => {
      const mockFoods = [
        {
          id: 'food-1',
          name: 'Chicken Breast',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
        },
        {
          id: 'food-2',
          name: 'Chicken Thigh',
          calories: 209,
          protein: 26,
          carbs: 0,
          fat: 11,
        },
      ];

      mockDatabaseService.food.findMany.mockResolvedValue(mockFoods);

      const result = await service.searchFoods('chicken');

      expect(result).toEqual(mockFoods);
      expect(mockDatabaseService.food.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'chicken', mode: 'insensitive' } },
              { nameSk: { contains: 'chicken', mode: 'insensitive' } },
            ],
          },
        })
      );
    });

    it('should limit search results', async () => {
      mockDatabaseService.food.findMany.mockResolvedValue([]);

      await service.searchFoods('test');

      expect(mockDatabaseService.food.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
        })
      );
    });
  });
});
