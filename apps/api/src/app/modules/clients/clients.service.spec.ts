import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import { createMockDatabaseService } from '../../../testing/common-mocks';

describe('ClientsService', () => {
  let service: ClientsService;
  let databaseService: DatabaseService;

  const mockDatabaseService = createMockDatabaseService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return client with coach and goals', async () => {
      const mockClient = {
        id: 'client-123',
        email: 'client@example.com',
        firstName: 'John',
        lastName: 'Doe',
        coach: {
          id: 'coach-123',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'coach@example.com',
        },
        goals: [],
      };

      mockDatabaseService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.findById('client-123');

      expect(result).toEqual(mockClient);
      expect(mockDatabaseService.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'client-123' },
        include: {
          coach: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          goals: true,
        },
      });
    });

    it('should throw NotFoundException when client not found', async () => {
      mockDatabaseService.client.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findByEmail', () => {
    it('should return client when found', async () => {
      const mockClient = {
        id: 'client-123',
        email: 'client@example.com',
      };

      mockDatabaseService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.findByEmail('client@example.com');

      expect(result).toEqual(mockClient);
    });

    it('should return null when client not found', async () => {
      mockDatabaseService.client.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findAllByCoach', () => {
    it('should return all clients for a coach ordered by creation date', async () => {
      const mockClients = [
        { id: 'client-1', coachId: 'coach-123', goals: [] },
        { id: 'client-2', coachId: 'coach-123', goals: [] },
      ];

      mockDatabaseService.client.findMany.mockResolvedValue(mockClients);

      const result = await service.findAllByCoach('coach-123');

      expect(result).toEqual(mockClients);
      expect(mockDatabaseService.client.findMany).toHaveBeenCalledWith({
        where: { coachId: 'coach-123' },
        include: { goals: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getClientPermissions', () => {
    it('should return client tracking permissions', async () => {
      const mockPermissions = {
        canTrackExercise: true,
        canTrackSleep: true,
        canTrackNutrition: false,
        canTrackWater: true,
      };

      mockDatabaseService.client.findUnique.mockResolvedValue(mockPermissions);

      const result = await service.getClientPermissions('client-123');

      expect(result).toEqual(mockPermissions);
    });

    it('should throw NotFoundException when client not found', async () => {
      mockDatabaseService.client.findUnique.mockResolvedValue(null);

      await expect(
        service.getClientPermissions('non-existent')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteClient', () => {
    it('should delete client when coach owns the client', async () => {
      const mockClient = {
        coachId: 'coach-123',
      };

      mockDatabaseService.client.findUnique.mockResolvedValue(mockClient);
      mockDatabaseService.client.delete.mockResolvedValue({});

      await service.deleteClient('client-123', 'coach-123');

      expect(mockDatabaseService.client.delete).toHaveBeenCalledWith({
        where: { id: 'client-123' },
      });
    });

    it('should throw NotFoundException when client not found', async () => {
      mockDatabaseService.client.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteClient('client-123', 'coach-123')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when coach does not own the client', async () => {
      const mockClient = {
        coachId: 'different-coach',
      };

      mockDatabaseService.client.findUnique.mockResolvedValue(mockClient);

      await expect(
        service.deleteClient('client-123', 'coach-123')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
