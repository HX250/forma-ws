import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SecurityService } from '../../core/auth/security.service';
import { AuthResourceService } from '../../features/auth/resources/auth.resource.service';
import { UserType } from '@forma-ws/domain';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let securityService: SecurityService;
  let router: Router;
  let authResourceService: AuthResourceService;

  const mockSecurityService = {
    userType: signal(null),
    user: signal(null),
    clear: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockAuthResourceService = {
    logout: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthResourceService, useValue: mockAuthResourceService },
      ],
    });

    const fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    securityService = TestBed.inject(SecurityService);
    router = TestBed.inject(Router);
    authResourceService = TestBed.inject(AuthResourceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toggleMobileMenu', () => {
    it('should toggle mobile menu state', () => {
      expect(component.isMobileMenuOpen()).toBe(false);
      
      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(true);
      
      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('closeMobileMenu', () => {
    it('should close mobile menu', () => {
      component.isMobileMenuOpen.set(true);
      component.closeMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout user, clear security service, and navigate to home', (done) => {
      mockAuthResourceService.logout.mockReturnValue(of({}));
      component.isMobileMenuOpen.set(true);

      component.logout();

      setTimeout(() => {
        expect(mockAuthResourceService.logout).toHaveBeenCalled();
        expect(mockSecurityService.clear).toHaveBeenCalled();
        expect(component.isMobileMenuOpen()).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
        done();
      }, 100);
    });
  });

  describe('navigateAndClose', () => {
    it('should navigate to path and close menu for coach', () => {
      mockSecurityService.userType.set(UserType.COACH);

      component.navigateAndClose('dashboard');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['dashboard']);
      expect(component.isMobileMenuOpen()).toBe(false);
    });

    it('should navigate to client-specific path for client user', () => {
      mockSecurityService.userType.set(UserType.CLIENT);
      mockSecurityService.user.set({ id: 'client-123', email: 'test@example.com' } as any);

      component.navigateAndClose('tracking');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/clients/tracking/client-123']);
      expect(component.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('userType getter', () => {
    it('should return current user type', () => {
      mockSecurityService.userType.set(UserType.COACH);
      expect(component.userType).toBe(UserType.COACH);

      mockSecurityService.userType.set(UserType.CLIENT);
      expect(component.userType).toBe(UserType.CLIENT);
    });
  });

  describe('currentUser getter', () => {
    it('should return current user details', () => {
      const mockUser = { id: 'user-123', email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      mockSecurityService.user.set(mockUser as any);

      expect(component.currentUser).toEqual(mockUser);
    });

    it('should return null when no user', () => {
      mockSecurityService.user.set(null);
      expect(component.currentUser).toBeNull();
    });
  });
});
