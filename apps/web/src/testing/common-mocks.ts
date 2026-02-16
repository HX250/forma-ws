import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { signal } from '@angular/core';

export const createMockHttpClient = () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  request: jest.fn(),
});

export const createMockSecurityService = () => ({
  user: signal(null),
  userType: signal(null),
  getIsLoggedIn: jest.fn().mockReturnValue(false),
  setUser: jest.fn(),
  clear: jest.fn(),
});

export const createMockActivatedRoute = (params: Record<string, string> = {}) => ({
  snapshot: {
    paramMap: {
      get: jest.fn((key: string) => params[key] || null),
    },
    queryParamMap: {
      get: jest.fn((key: string) => params[key] || null),
    },
  },
  params: of(params),
  queryParams: of({}),
});

export const createMockRouter = () => ({
  navigate: jest.fn().mockResolvedValue(true),
  navigateByUrl: jest.fn().mockResolvedValue(true),
  url: '/',
  events: of({}),
});

export const createMockModalService = () => ({
  open: jest.fn().mockReturnValue(of(true)),
  close: jest.fn(),
});

export const createMockLanguageService = () => ({
  getCurrentLanguage: jest.fn().mockReturnValue('en'),
  setLanguage: jest.fn(),
  getTranslation: jest.fn().mockReturnValue(of({})),
});
