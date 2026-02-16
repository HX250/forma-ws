import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from '@forma-ws/backend-shared';
import { TokenService } from './token/token.service';
import { UserType } from '@forma-ws/domain';
import * as bcrypt from 'bcrypt';
import {
  createMockDatabaseService,
  createMockResponse,
} from '../../../../testing/common-mocks';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let databaseService: DatabaseService;
  let tokenService: TokenService;

  const mockDatabaseService = createMockDatabaseService();
  const mockTokenService = {
    createAuthPayload: jest.fn(),
    generateAndSetTokens: jest.fn(),
    clearTokens: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockResponse = createMockResponse();
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
      userType: UserType.COACH,
    };

    it('should successfully login a coach with valid credentials', async () => {
      const mockCoach = {
        id: 'coach-123',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockDatabaseService.coach.findUnique.mockResolvedValue(mockCoach);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockTokenService.createAuthPayload.mockReturnValue({
        sub: mockCoach.id,
        email: mockCoach.email,
        userType: UserType.COACH,
      });

      const result = await service.login(loginDto, mockResponse as any);

      expect(result).toEqual({
        id: mockCoach.id,
        email: mockCoach.email,
        firstName: mockCoach.firstName,
        lastName: mockCoach.lastName,
        userType: UserType.COACH,
        isFirstLogin: false,
      });
      expect(mockTokenService.generateAndSetTokens).toHaveBeenCalled();
    });

    it('should successfully login a client with one-time password', async () => {
      const mockClient = {
        id: 'client-123',
        email: 'client@example.com',
        oneTimePassword: 'ABC123',
        isFirstLogin: true,
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const clientLoginDto = {
        email: 'client@example.com',
        password: 'ABC123',
        userType: UserType.CLIENT,
      };

      mockDatabaseService.client.findUnique.mockResolvedValue(mockClient);
      mockTokenService.createAuthPayload.mockReturnValue({
        sub: mockClient.id,
        email: mockClient.email,
        userType: UserType.CLIENT,
      });

      const result = await service.login(clientLoginDto, mockResponse as any);

      expect(result.isFirstLogin).toBe(true);
      expect(mockTokenService.generateAndSetTokens).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockDatabaseService.coach.findUnique.mockResolvedValue(null);

      await expect(
        service.login(loginDto, mockResponse as any)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockCoach = {
        id: 'coach-123',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockDatabaseService.coach.findUnique.mockResolvedValue(mockCoach);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login(loginDto, mockResponse as any)
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    const mockResponse = createMockResponse();

    it('should successfully refresh tokens with valid refresh token', async () => {
      const mockPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        userType: UserType.COACH,
      };

      mockTokenService.verifyRefreshToken.mockReturnValue(mockPayload);

      const result = await service.refreshTokens(
        'valid-token',
        mockResponse as any
      );

      expect(result).toEqual(mockPayload);
      expect(mockTokenService.generateAndSetTokens).toHaveBeenCalledWith(
        mockPayload,
        mockResponse
      );
    });

    it('should throw UnauthorizedException with invalid refresh token', async () => {
      mockTokenService.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.refreshTokens('invalid-token', mockResponse as any)
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getCurrentUser', () => {
    it('should return coach details for coach user', async () => {
      const mockCoach = {
        id: 'coach-123',
        email: 'coach@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const payload = {
        sub: 'coach-123',
        email: 'coach@example.com',
        userType: UserType.COACH,
      };

      mockDatabaseService.coach.findUnique.mockResolvedValue(mockCoach);

      const result = await service.getCurrentUser(payload);

      expect(result).toEqual(mockCoach);
    });

    it('should return client details for client user', async () => {
      const mockClient = {
        id: 'client-123',
        email: 'client@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        isFirstLogin: false,
      };

      const payload = {
        sub: 'client-123',
        email: 'client@example.com',
        userType: UserType.CLIENT,
      };

      mockDatabaseService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.getCurrentUser(payload);

      expect(result).toEqual(mockClient);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const payload = {
        sub: 'coach-123',
        email: 'coach@example.com',
        userType: UserType.COACH,
      };

      mockDatabaseService.coach.findUnique.mockResolvedValue(null);

      await expect(service.getCurrentUser(payload)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('logout', () => {
    it('should clear tokens on logout', async () => {
      const mockResponse = createMockResponse();

      await service.logout(mockResponse as any);

      expect(mockTokenService.clearTokens).toHaveBeenCalledWith(mockResponse);
    });
  });
});
