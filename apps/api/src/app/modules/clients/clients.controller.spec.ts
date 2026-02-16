import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { UserType } from '@forma-ws/domain';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  const mockClientsService = {
    getClientGeneralDetails: jest.fn(),
    getClientPermissions: jest.fn(),
    getClientHealthDetails: jest.fn(),
    deleteClient: jest.fn(),
    getClientTableList: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [{ provide: ClientsService, useValue: mockClientsService }],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getClientDetails', () => {
    it('should return client general details', async () => {
      const mockDetails = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        gender: 'MALE',
        birthDate: new Date('1990-01-01'),
      };

      mockClientsService.getClientGeneralDetails.mockResolvedValue(mockDetails);

      const result = await controller.getClientDetails('client-123');

      expect(result).toEqual(mockDetails);
      expect(mockClientsService.getClientGeneralDetails).toHaveBeenCalledWith('client-123');
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

      mockClientsService.getClientPermissions.mockResolvedValue(mockPermissions);

      const result = await controller.getClientPermissions('client-123');

      expect(result).toEqual(mockPermissions);
      expect(mockClientsService.getClientPermissions).toHaveBeenCalledWith('client-123');
    });
  });

  describe('getClientHealthDetails', () => {
    it('should return client fitness details', async () => {
      const mockHealthDetails = {
        currentWeight: 75,
        height: 180,
        activityLevel: 'MODERATELY_ACTIVE',
        fitnessExperience: 'BEGINNER',
        medicalConditions: 'None',
      };

      mockClientsService.getClientHealthDetails.mockResolvedValue(mockHealthDetails);

      const result = await controller.getClientHealthDetails('client-123');

      expect(result).toEqual(mockHealthDetails);
      expect(mockClientsService.getClientHealthDetails).toHaveBeenCalledWith('client-123');
    });
  });

  describe('deleteClient', () => {
    it('should delete client when coach owns the client', async () => {
      const mockUser = { sub: 'coach-123', email: 'coach@example.com', userType: UserType.COACH };
      mockClientsService.deleteClient.mockResolvedValue(undefined);

      await controller.deleteClient('client-123', mockUser);

      expect(mockClientsService.deleteClient).toHaveBeenCalledWith('client-123', 'coach-123');
    });
  });

  describe('getAllClients', () => {
    it('should return all clients for a coach', async () => {
      const mockClients = [
        {
          id: 'client-1',
          firstName: 'John',
          lastName: 'Doe',
          canTrackExercise: true,
          canTrackSleep: true,
          canTrackNutrition: true,
          canTrackWater: true,
          updatedAt: new Date(),
        },
        {
          id: 'client-2',
          firstName: 'Jane',
          lastName: 'Smith',
          canTrackExercise: false,
          canTrackSleep: true,
          canTrackNutrition: true,
          canTrackWater: false,
          updatedAt: new Date(),
        },
      ];

      const mockUser = { sub: 'coach-123', email: 'coach@example.com', userType: UserType.COACH };
      mockClientsService.getClientTableList.mockResolvedValue(mockClients);

      const result = await controller.getAllClients(mockUser);

      expect(result).toEqual(mockClients);
      expect(mockClientsService.getClientTableList).toHaveBeenCalledWith('coach-123');
    });
  });
});
