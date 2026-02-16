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

export const createMockActivatedRoute = (
  params: Record<string, string> = {}
) => ({
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

export const createMockTranslateService = () => {
  const mockTranslations = { en: {}, sk: {} };
  const mockService = {
    currentLang: 'en',
    defaultLang: 'en',
    langs: ['en', 'sk'],
    translations: mockTranslations,
    get: jest.fn((key: string) => of(key)),
    instant: jest.fn((key: string) => key),
    use: jest.fn().mockReturnValue(of({})),
    setDefaultLang: jest.fn(),
    setFallbackLang: jest.fn(),
    getFallbackLang: jest.fn().mockReturnValue('en'),
    getCurrentLang: jest.fn().mockReturnValue('en'),
    getParsedResult: jest.fn((translations: any, key: string) => key),
    getTranslation: jest.fn((lang: string) =>
      of(mockTranslations[lang as keyof typeof mockTranslations] || {})
    ),
    addLangs: jest.fn(),
    getLangs: jest.fn().mockReturnValue(['en', 'sk']),
    getBrowserLang: jest.fn().mockReturnValue('en'),
    onLangChange: of({ lang: 'en', translations: mockTranslations }),
    onTranslationChange: of({ lang: 'en', translations: mockTranslations }),
    onDefaultLangChange: of({ lang: 'en', translations: mockTranslations }),
    stream: jest.fn((key: string) => of(key)),
  };
  return mockService;
};
