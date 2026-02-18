import { TestBed } from '@angular/core/testing';
import { SecurityService } from './security.service';
import { UserType } from '@forma-ws/domain';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecurityService],
    });
    service = TestBed.inject(SecurityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with no user logged in', () => {
      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBeNull();
      expect(service.userId()).toBeNull();
      expect(service.userType()).toBeNull();
    });
  });

  describe('setLoggedIn', () => {
    it('should update logged in state to true', () => {
      service.setLoggedIn(true);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should update logged in state to false', () => {
      service.setLoggedIn(true);
      service.setLoggedIn(false);
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getIsLoggedIn', () => {
    it('should return readonly signal of logged in state', () => {
      const isLoggedInSignal = service.getIsLoggedIn();
      expect(isLoggedInSignal()).toBe(false);

      service.setLoggedIn(true);
      expect(isLoggedInSignal()).toBe(true);
    });
  });

  describe('setCurrentUser', () => {
    it('should set user and mark as logged in for coach', () => {
      const mockUser = {
        id: 'coach-123',
        email: 'coach@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userType: UserType.COACH,
        isFirstLogin: false,
      };

      service.setCurrentUser(mockUser);

      expect(service.isAuthenticated()).toBe(true);
      expect(service.user()).toEqual(mockUser);
      expect(service.userId()).toBe('coach-123');
      expect(service.userType()).toBe(UserType.COACH);
    });

    it('should set user and mark as logged in for client', () => {
      const mockUser = {
        id: 'client-456',
        email: 'client@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        userType: UserType.CLIENT,
        isFirstLogin: true,
      };

      service.setCurrentUser(mockUser);

      expect(service.isAuthenticated()).toBe(true);
      expect(service.user()).toEqual(mockUser);
      expect(service.userId()).toBe('client-456');
      expect(service.userType()).toBe(UserType.CLIENT);
    });

    it('should update user when called multiple times', () => {
      const firstUser = {
        id: 'user-1',
        email: 'user1@example.com',
        firstName: 'First',
        lastName: 'User',
        userType: UserType.CLIENT,
        isFirstLogin: false,
      };

      const secondUser = {
        id: 'user-2',
        email: 'user2@example.com',
        firstName: 'Second',
        lastName: 'User',
        userType: UserType.COACH,
        isFirstLogin: false,
      };

      service.setCurrentUser(firstUser);
      expect(service.userId()).toBe('user-1');

      service.setCurrentUser(secondUser);
      expect(service.userId()).toBe('user-2');
      expect(service.userType()).toBe(UserType.COACH);
    });
  });

  describe('clear', () => {
    it('should clear user data and set logged out', () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: UserType.CLIENT,
        isFirstLogin: false,
      };

      service.setCurrentUser(mockUser);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.user()).toEqual(mockUser);

      service.clear();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBeNull();
      expect(service.userId()).toBeNull();
      expect(service.userType()).toBeNull();
    });

    it('should be idempotent when called multiple times', () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: UserType.CLIENT,
        isFirstLogin: false,
      };

      service.setCurrentUser(mockUser);
      service.clear();
      service.clear();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBeNull();
    });
  });

  describe('computed signals', () => {
    it('should reactively update userId when user changes', () => {
      expect(service.userId()).toBeNull();

      const mockUser = {
        id: 'reactive-user',
        email: 'reactive@example.com',
        firstName: 'Reactive',
        lastName: 'User',
        userType: UserType.COACH,
        isFirstLogin: false,
      };

      service.setCurrentUser(mockUser);
      expect(service.userId()).toBe('reactive-user');

      service.clear();
      expect(service.userId()).toBeNull();
    });

    it('should reactively update userType when user changes', () => {
      expect(service.userType()).toBeNull();

      const coachUser = {
        id: 'coach-1',
        email: 'coach@example.com',
        firstName: 'Coach',
        lastName: 'User',
        userType: UserType.COACH,
        isFirstLogin: false,
      };

      service.setCurrentUser(coachUser);
      expect(service.userType()).toBe(UserType.COACH);

      const clientUser = {
        id: 'client-1',
        email: 'client@example.com',
        firstName: 'Client',
        lastName: 'User',
        userType: UserType.CLIENT,
        isFirstLogin: false,
      };

      service.setCurrentUser(clientUser);
      expect(service.userType()).toBe(UserType.CLIENT);
    });
  });
});
