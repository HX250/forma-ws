import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { ClientSecurityService } from './client-security.service';
import { DatabaseService, MailService } from '@forma-ws/backend-shared';
import {
  RegisterClientDto,
  SetClientPasswordDto,
  Gender,
  ActivityLevel,
  FitnessExperience,
} from '@forma-ws/domain';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('ClientSecurityService', () => {
  let service: ClientSecurityService;
  let databaseService: DatabaseService;
  let mailService: MailService;

  const mockDatabaseService = {
    $transaction: jest.fn(),
    client: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockMailService = {
    sendClientPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientSecurityService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<ClientSecurityService>(ClientSecurityService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerClient', () => {
    const registerDto: RegisterClientDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      gender: Gender.MALE,
      birthDate: new Date('1990-01-01'),
      currentWeight: 75,
      height: 180,
      activityLevel: ActivityLevel.MODERATELY_ACTIVE,
      medicalConditions: 'None',
      fitnessExperience: FitnessExperience.BEGINNER,
      coachId: 'coach-123',
      canTrackExercise: true,
      canTrackSleep: true,
      canTrackNutrition: true,
      canTrackWater: true,
    };

    it('should successfully register a new client', async () => {
      const mockClient = {
        id: 'client-123',
        ...registerDto,
        oneTimePassword: 'ABC123',
        isFirstLogin: true,
        password: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDatabaseService.$transaction.mockImplementation(async (callback) => {
        return callback({
          client: {
            create: jest.fn().mockResolvedValue(mockClient),
          },
        });
      });

      mockMailService.sendClientPassword.mockResolvedValue(undefined);

      const result = await service.registerClient(registerDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(registerDto.email);
      expect(mockMailService.sendClientPassword).toHaveBeenCalledWith(
        registerDto.email,
        expect.any(String)
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      mockDatabaseService.$transaction.mockRejectedValue({
        code: 'P2002',
      });

      await expect(service.registerClient(registerDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('setClientPassword', () => {
    const clientId = 'client-123';
    const setPasswordDto: SetClientPasswordDto = {
      newPassword: 'NewPassword123!',
    };

    it('should successfully set client password', async () => {
      const mockClient = {
        id: clientId,
        email: 'test@example.com',
        isFirstLogin: true,
        oneTimePassword: 'ABC123',
      };

      const mockUpdatedClient = {
        ...mockClient,
        password: 'hashedPassword',
        oneTimePassword: null,
        isFirstLogin: false,
      };

      mockDatabaseService.client.findUnique.mockResolvedValue(mockClient);
      mockDatabaseService.client.update.mockResolvedValue(mockUpdatedClient);

      const result = await service.setClientPassword(clientId, setPasswordDto);

      expect(result).toBeDefined();
      expect(result.isFirstLogin).toBe(false);
      expect(mockDatabaseService.client.update).toHaveBeenCalledWith({
        where: { id: clientId },
        data: {
          password: 'hashedPassword',
          oneTimePassword: null,
          isFirstLogin: false,
        },
      });
    });

    it('should throw BadRequestException when client not found', async () => {
      mockDatabaseService.client.findUnique.mockResolvedValue(null);

      await expect(
        service.setClientPassword(clientId, setPasswordDto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when password already set', async () => {
      const mockClient = {
        id: clientId,
        email: 'test@example.com',
        isFirstLogin: false,
      };

      mockDatabaseService.client.findUnique.mockResolvedValue(mockClient);

      await expect(
        service.setClientPassword(clientId, setPasswordDto)
      ).rejects.toThrow(BadRequestException);
    });
  });
});
