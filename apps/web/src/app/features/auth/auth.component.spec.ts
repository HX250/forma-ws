import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthResourceService } from './resources/auth.resource.service';
import { SecurityService } from '../../core/auth/security.service';
import { AlertService } from '@forma-ws/frontend-shared';
import { UserType } from '@forma-ws/frontend/domain';
import { of, throwError } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FakeTranslateLoader } from '../../../testing/common-mocks';

describe.skip('AuthComponent', () => {
  let component: AuthComponent;
  let authResourceService: AuthResourceService;
  let securityService: SecurityService;
  let router: Router;
  let alertService: AlertService;

  const mockAuthResourceService = {
    login: jest.fn(),
  };

  const mockSecurityService = {
    setCurrentUser: jest.fn(),
    user: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockAlertService = {
    show: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AuthComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
        }),
      ],
      providers: [
        FormBuilder,
        { provide: AuthResourceService, useValue: mockAuthResourceService },
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlertService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    authResourceService = TestBed.inject(AuthResourceService);
    securityService = TestBed.inject(SecurityService);
    router = TestBed.inject(Router);
    alertService = TestBed.inject(AlertService);

    component.ngOnInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
      expect(component.form).toBeDefined();
      expect(component.form.controls.email.value).toBe('');
      expect(component.form.controls.password.value).toBe('');
      expect(component.form.controls.userType.value).toBe(UserType.CLIENT);
    });

    it('should have required validators on email and password', () => {
      expect(component.form.controls.email.hasError('required')).toBe(true);
      expect(component.form.controls.password.hasError('required')).toBe(true);
    });
  });

  describe('changeRole', () => {
    it('should change user type to COACH', () => {
      component.changeRole(UserType.COACH);
      expect(component.form.controls.userType.value).toBe(UserType.COACH);
    });

    it('should change user type to CLIENT', () => {
      component.form.controls.userType.setValue(UserType.COACH);
      component.changeRole(UserType.CLIENT);
      expect(component.form.controls.userType.value).toBe(UserType.CLIENT);
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      component.form.controls.email.setValue('');
      component.form.controls.password.setValue('');

      component.onSubmit();

      expect(mockAuthResourceService.login).not.toHaveBeenCalled();
      expect(component.form.touched).toBe(true);
    });

    it('should submit valid form and login successfully', (done) => {
      const mockResponse = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: UserType.CLIENT,
        isFirstLogin: false,
      };

      component.form.controls.email.setValue('test@example.com');
      component.form.controls.password.setValue('password123');
      component.form.controls.userType.setValue(UserType.CLIENT);

      mockAuthResourceService.login.mockReturnValue(of(mockResponse));
      mockSecurityService.user.mockReturnValue(mockResponse);

      component.onSubmit();

      setTimeout(() => {
        expect(mockAuthResourceService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          userType: UserType.CLIENT,
        });
        expect(mockSecurityService.setCurrentUser).toHaveBeenCalledWith(
          mockResponse
        );
        expect(mockAlertService.show).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
        done();
      }, 100);
    });

    it('should navigate to set-up-password for first login', (done) => {
      const mockResponse = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: UserType.CLIENT,
        isFirstLogin: true,
      };

      component.form.controls.email.setValue('test@example.com');
      component.form.controls.password.setValue('password123');

      mockAuthResourceService.login.mockReturnValue(of(mockResponse));
      mockSecurityService.user.mockReturnValue(mockResponse);

      component.onSubmit();

      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith([
          '/clients/set-up-password',
        ]);
        done();
      }, 100);
    });

    it('should handle login for COACH user type', (done) => {
      const mockResponse = {
        id: 'coach-123',
        email: 'coach@example.com',
        firstName: 'Coach',
        lastName: 'User',
        userType: UserType.COACH,
        isFirstLogin: false,
      };

      component.form.controls.email.setValue('coach@example.com');
      component.form.controls.password.setValue('password123');
      component.form.controls.userType.setValue(UserType.COACH);

      mockAuthResourceService.login.mockReturnValue(of(mockResponse));
      mockSecurityService.user.mockReturnValue(mockResponse);

      component.onSubmit();

      setTimeout(() => {
        expect(mockAuthResourceService.login).toHaveBeenCalledWith({
          email: 'coach@example.com',
          password: 'password123',
          userType: UserType.COACH,
        });
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
        done();
      }, 100);
    });

    it('should handle login errors', (done) => {
      const error = new Error('Invalid credentials');

      component.form.controls.email.setValue('test@example.com');
      component.form.controls.password.setValue('wrongpassword');

      mockAuthResourceService.login.mockReturnValue(throwError(() => error));

      component.onSubmit();

      setTimeout(() => {
        expect(mockAuthResourceService.login).toHaveBeenCalled();
        expect(mockSecurityService.setCurrentUser).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.form.controls.email.setValue('');
      component.form.controls.password.setValue('');

      component.onSubmit();

      expect(component.form.controls.email.touched).toBe(true);
      expect(component.form.controls.password.touched).toBe(true);
    });
  });

  describe('form validation', () => {
    it('should be invalid when email is empty', () => {
      component.form.controls.email.setValue('');
      component.form.controls.password.setValue('password123');

      expect(component.form.valid).toBe(false);
    });

    it('should be invalid when password is empty', () => {
      component.form.controls.email.setValue('test@example.com');
      component.form.controls.password.setValue('');

      expect(component.form.valid).toBe(false);
    });

    it('should be valid when all required fields are filled', () => {
      component.form.controls.email.setValue('test@example.com');
      component.form.controls.password.setValue('password123');

      expect(component.form.valid).toBe(true);
    });
  });
});
