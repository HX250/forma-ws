import { Test, TestingModule } from '@nestjs/testing';
import { SecurityController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';
import { UserType } from '@forma-ws/domain';
import { createMockResponse } from '../../../../testing/common-mocks';

describe('SecurityController', () => {
  let controller: SecurityController;
  let authService: AuthService;
  let tokenService: TokenService;

  const mockAuthService = {
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  };

  const mockTokenService = {
    createAuthPayload: jest.fn(),
    generateAndSetTokens: jest.fn(),
    clearTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    controller = module.get<SecurityController>(SecurityController);
    authService = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockResponse = createMockResponse();

    it('should login coach successfully', async () => {
      const loginDto = {
        email: 'coach@example.com',
        password: 'password123',
        userType: UserType.COACH,
      };

      const mockUser = {
        id: 'coach-123',
        email: 'coach@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userType: UserType.COACH,
        isFirstLogin: false,
      };

      mockAuthService.login.mockResolvedValue(mockUser);

      const result = await controller.login(loginDto, mockResponse as any);

      expect(result).toEqual(mockUser);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginDto,
        mockResponse
      );
    });

    it('should login client successfully with first-time login flag', async () => {
      const loginDto = {
        email: 'client@example.com',
        password: 'ABC123',
        userType: UserType.CLIENT,
      };

      const mockUser = {
        id: 'client-123',
        email: 'client@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        userType: UserType.CLIENT,
        isFirstLogin: true,
      };

      mockAuthService.login.mockResolvedValue(mockUser);

      const result = await controller.login(loginDto, mockResponse as any);

      expect(result).toEqual(mockUser);
      expect(result.isFirstLogin).toBe(true);
    });
  });

  describe('refresh', () => {
    const mockResponse = createMockResponse();

    it('should refresh access token with valid refresh token', async () => {
      const mockPayload = {
        sub: 'user-123',
        email: 'user@example.com',
        userType: UserType.COACH,
      };

      mockAuthService.refreshTokens.mockResolvedValue(mockPayload);

      const mockRequest = {
        cookies: { refreshToken: 'valid-refresh-token' },
      };

      const result = await controller.refresh(
        mockRequest as any,
        mockResponse as any
      );

      expect(result).toEqual(mockPayload);
      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        'valid-refresh-token',
        mockResponse
      );
    });
  });

  describe('logout', () => {
    const mockResponse = createMockResponse();

    it('should logout user and clear tokens', async () => {
      await controller.logout(mockResponse as any);

      expect(mockAuthService.logout).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current coach user details', async () => {
      const mockPayload = {
        sub: 'coach-123',
        email: 'coach@example.com',
        userType: UserType.COACH,
      };

      const mockUser = {
        id: 'coach-123',
        email: 'coach@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const result = await controller.getCurrentUser(mockPayload);

      expect(result).toEqual({ ...mockUser, userType: UserType.COACH });
      expect(mockAuthService.getCurrentUser).toHaveBeenCalledWith(mockPayload);
    });

    it('should return current client user details', async () => {
      const mockPayload = {
        sub: 'client-123',
        email: 'client@example.com',
        userType: UserType.CLIENT,
      };

      const mockUser = {
        id: 'client-123',
        email: 'client@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        isFirstLogin: false,
      };

      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const result = await controller.getCurrentUser(mockPayload);

      expect(result).toEqual({ ...mockUser, userType: UserType.CLIENT });
    });
  });
});
