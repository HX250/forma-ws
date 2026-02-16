import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SleepService } from './sleep.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import { createMockDatabaseService } from '../../../../../testing/common-mocks';

describe('SleepService', () => {
  let service: SleepService;
  let databaseService: DatabaseService;

  const mockDatabaseService = createMockDatabaseService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SleepService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<SleepService>(SleepService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSleepEntry', () => {
    it('should return sleep entry for a specific date', async () => {
      const mockEntry = {
        id: '1',
        bedTime: new Date('2024-02-15T22:00:00'),
        wakeTime: new Date('2024-02-16T06:00:00'),
        hoursSlept: 8,
        sleepQuality: 4,
        notes: 'Good sleep',
        createdAt: new Date('2024-02-15'),
      };

      mockDatabaseService.sleepEntry.findFirst.mockResolvedValue(mockEntry);

      const result = await service.getSleepEntry({
        clientId: 'client-123',
        createdAt: '2024-02-15',
      });

      expect(result).toEqual(mockEntry);
      expect(mockDatabaseService.sleepEntry.findFirst).toHaveBeenCalled();
    });

    it('should return null when no entry found', async () => {
      mockDatabaseService.sleepEntry.findFirst.mockResolvedValue(null);

      const result = await service.getSleepEntry({
        clientId: 'client-123',
        createdAt: '2024-02-15',
      });

      expect(result).toBeNull();
    });
  });

  describe('logSleepEntry', () => {
    it('should create a new sleep entry with all fields', async () => {
      const sleepData = {
        clientId: 'client-123',
        bedTime: '2024-02-15T22:00:00Z',
        wakeTime: '2024-02-16T06:00:00Z',
        sleepQuality: 4,
        notes: 'Slept well',
      };

      mockDatabaseService.sleepEntry.findFirst.mockResolvedValue(null);
      mockDatabaseService.sleepEntry.create.mockResolvedValue({});

      const result = await service.logSleepEntry(sleepData);

      expect(result).toBe(true);
      expect(mockDatabaseService.sleepEntry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            clientId: 'client-123',
            bedTime: expect.any(Date),
            wakeTime: expect.any(Date),
            hoursSlept: expect.any(Number),
            sleepQuality: 4,
            notes: 'Slept well',
          }),
        })
      );
    });

    it('should create sleep entry without optional notes', async () => {
      const sleepData = {
        clientId: 'client-123',
        bedTime: '2024-02-15T23:00:00Z',
        wakeTime: '2024-02-16T06:30:00Z',
      };

      mockDatabaseService.sleepEntry.create.mockResolvedValue({});

      const result = await service.logSleepEntry(sleepData);

      expect(result).toBe(true);
    });
  });

  describe('removeSleepEntry', () => {
    it('should delete sleep entry when it exists and belongs to client', async () => {
      const mockEntry = { id: 'entry-123', clientId: 'client-123', hours: 8 };

      mockDatabaseService.sleepEntry.findFirst.mockResolvedValue(mockEntry);
      mockDatabaseService.sleepEntry.delete.mockResolvedValue({});

      const result = await service.removeSleepEntry({
        id: 'entry-123',
        clientId: 'client-123',
      });

      expect(result).toBe(true);
      expect(mockDatabaseService.sleepEntry.delete).toHaveBeenCalledWith({
        where: { id: 'entry-123' },
      });
    });

    it('should throw NotFoundException when entry not found', async () => {
      mockDatabaseService.sleepEntry.findFirst.mockResolvedValue(null);

      await expect(
        service.removeSleepEntry({
          id: 'non-existent',
          clientId: 'client-123',
        })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when entry belongs to different client', async () => {
      mockDatabaseService.sleepEntry.findFirst.mockResolvedValue(null);

      await expect(
        service.removeSleepEntry({
          id: 'entry-123',
          clientId: 'wrong-client',
        })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
