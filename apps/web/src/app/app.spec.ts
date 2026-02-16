import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { SecurityService } from './core/auth/security.service';
import { LanguageService } from '@forma-ws/frontend-shared';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('App', () => {
  let mockSecurityService: Partial<SecurityService>;
  let mockLanguageService: Partial<LanguageService>;

  beforeEach(async () => {
    mockSecurityService = {
      getIsLoggedIn: jest.fn().mockReturnValue(false),
      user: signal({ isFirstLogin: false }),
    };

    mockLanguageService = {
      getCurrentLanguage: jest.fn().mockReturnValue('en'),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: SecurityService, useValue: mockSecurityService },
        { provide: LanguageService, useValue: mockLanguageService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should return login status from SecurityService', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    (mockSecurityService.getIsLoggedIn as jest.Mock).mockReturnValue(true);
    expect(app.isLoggedIn).toBe(true);

    (mockSecurityService.getIsLoggedIn as jest.Mock).mockReturnValue(false);
    expect(app.isLoggedIn).toBe(false);
  });

  it('should return first login status from user', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    mockSecurityService.user = signal({ isFirstLogin: true } as any);

    expect(app.isUserFirstTimeLogIn).toBe(true);
  });

  it('should handle undefined user', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    mockSecurityService.user = signal(null);

    expect(app.isUserFirstTimeLogIn).toBeUndefined();
  });
});
