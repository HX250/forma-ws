import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WaterService } from './water.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import { createMockDatabaseService } from '../../../../../testing/common-mocks';

describe('WaterService', () => {
  let service: WaterService;
  let databaseService: DatabaseService;

  const mockDatabaseService = createMockDatabaseService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaterService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<WaterService>(WaterService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWaterTrackingData', () => {
    it('should return water entries for the specified date', async () => {
      const mockEntries = [
        { id: '1', amount: 250, createdAt: new Date() },
        { id: '2', amount: 500, createdAt: new Date() },
      ];

      mockDatabaseService.waterEntry.findMany.mockResolvedValue(mockEntries);

      const result = await service.getWaterTrackingData({
        clientId: 'client-123',
        createdAt: new Date().toISOString(),
      });

      expect(result).toEqual(mockEntries);
      expect(mockDatabaseService.waterEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            clientId: 'client-123',
          }),
          orderBy: { createdAt: 'desc' },
        })
      );
    });
  });

  describe('logWaterTrackingData', () => {
    it('should create a new water entry', async () => {
      mockDatabaseService.waterEntry.create.mockResolvedValue({});

      const result = await service.logWaterTrackingData({
        clientId: 'client-123',
        amount: 250,
      });

      expect(result).toBe(true);
      expect(mockDatabaseService.waterEntry.create).toHaveBeenCalledWith({
        data: {
          clientId: 'client-123',
          amount: 250,
        },
      });
    });
  });

  describe('removeWaterEntry', () => {
    it('should delete water entry when it exists and belongs to client', async () => {
      const mockEntry = {
        id: 'entry-123',
        clientId: 'client-123',
        amount: 250,
      };

      mockDatabaseService.waterEntry.findFirst.mockResolvedValue(mockEntry);
      mockDatabaseService.waterEntry.delete.mockResolvedValue({});

      const result = await service.removeWaterEntry({
        id: 'entry-123',
        clientId: 'client-123',
      });

      expect(result).toBe(true);
      expect(mockDatabaseService.waterEntry.delete).toHaveBeenCalledWith({
        where: { id: 'entry-123' },
      });
    });

    it('should throw NotFoundException when entry not found', async () => {
      mockDatabaseService.waterEntry.findFirst.mockResolvedValue(null);

      await expect(
        service.removeWaterEntry({
          id: 'non-existent',
          clientId: 'client-123',
        })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when entry belongs to different client', async () => {
      mockDatabaseService.waterEntry.findFirst.mockResolvedValue(null);

      await expect(
        service.removeWaterEntry({
          id: 'entry-123',
          clientId: 'wrong-client',
        })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
