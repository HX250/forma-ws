import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { signal } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';

// Fake loader for TranslateModule in tests
export class FakeTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({});
  }
}

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

  const mockService: any = {
    currentLang: 'en',
    defaultLang: 'en',
    langs: ['en', 'sk'],
    translations: mockTranslations,

    get: jest.fn((key: string | string[]) => of(key)),
    instant: jest.fn((key: string | string[]) => key),
    stream: jest.fn((key: string | string[]) => of(key)),

    use: jest.fn((lang: string) => {
      mockService.currentLang = lang;
      return of(mockTranslations);
    }),
    setDefaultLang: jest.fn((lang: string) => {
      mockService.defaultLang = lang;
    }),
    setFallbackLang: jest.fn((lang: string) => {}),
    getDefaultLang: jest.fn(() => mockService.defaultLang),
    getFallbackLang: jest.fn(() => mockService.defaultLang),
    getCurrentLang: jest.fn(() => mockService.currentLang),
    getBrowserLang: jest.fn(() => 'en'),

    getTranslation: jest.fn((lang: string) => {
      return of(mockTranslations[lang as keyof typeof mockTranslations] || {});
    }),
    setTranslation: jest.fn((lang: string, translations: any) => {
      mockTranslations[lang as keyof typeof mockTranslations] = translations;
    }),

    addLangs: jest.fn((langs: string[]) => {
      mockService.langs = [...mockService.langs, ...langs];
    }),
    getLangs: jest.fn(() => mockService.langs),

    getParsedResult: jest.fn(
      (translations: any, key: string, interpolateParams?: any) => key
    ),

    onLangChange: of({ lang: 'en', translations: mockTranslations }),
    onTranslationChange: of({ lang: 'en', translations: mockTranslations }),
    onDefaultLangChange: of({ lang: 'en', translations: mockTranslations }),
  };

  return mockService;
};
