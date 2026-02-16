import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CoachSecurityService } from './coach-security.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import {
  Gender,
  SpecializationField,
  CommunicationMethod,
} from '@forma-ws/domain';
import * as bcrypt from 'bcrypt';
import { createMockDatabaseService } from '../../../../testing/common-mocks';

jest.mock('bcrypt');

describe('CoachSecurityService', () => {
  let service: CoachSecurityService;
  let databaseService: DatabaseService;

  const mockDatabaseService = createMockDatabaseService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachSecurityService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<CoachSecurityService>(CoachSecurityService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerCoach', () => {
    const registerDto = {
      email: 'coach@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
      gender: Gender.MALE,
      yearsOfExperience: 5,
      specializationFields: [
        SpecializationField.WEIGHT_LOSS,
        SpecializationField.STRENGTH_TRAINING,
      ],
      bio: 'Experienced fitness coach',
      pricing: 50,
      availability: [],
      communicationMethods: [
        CommunicationMethod.EMAIL,
        CommunicationMethod.PHONE,
      ],
    };

    it('should successfully register a new coach with hashed password', async () => {
      const hashedPassword = 'hashedPassword123';
      const mockCoach = {
        id: 'coach-123',
        ...registerDto,
        password: hashedPassword,
      };

      mockDatabaseService.coach.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockDatabaseService.coach.create.mockResolvedValue(mockCoach);

      const result = await service.registerCoach(registerDto);

      expect(result).toEqual(mockCoach);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mockDatabaseService.coach.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: registerDto.email,
          password: hashedPassword,
          firstName: registerDto.firstName,
        }),
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingCoach = { id: 'coach-123', email: registerDto.email };
      mockDatabaseService.coach.findUnique.mockResolvedValue(existingCoach);

      await expect(service.registerCoach(registerDto)).rejects.toThrow(
        ConflictException
      );
      expect(mockDatabaseService.coach.create).not.toHaveBeenCalled();
    });

    it('should hash password with bcrypt salt rounds of 12', async () => {
      mockDatabaseService.coach.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockDatabaseService.coach.create.mockResolvedValue({});

      await service.registerCoach(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
    });
  });
});
