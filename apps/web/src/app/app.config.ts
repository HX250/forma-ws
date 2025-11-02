import {
  ApplicationConfig,
  importProvidersFrom,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpInterceptor } from './core/auth/http-interceptor';
import { initializeAuth } from './app-initializer';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true,
    },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(),
    importProvidersFrom(TranslateModule.forRoot()),
    provideTranslateHttpLoader({
      prefix: '/assets/lang/merged-adminapp/',
      suffix: '.json',
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(initializeAuth),
  ],
};
