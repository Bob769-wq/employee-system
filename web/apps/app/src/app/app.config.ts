import {
  HttpErrorResponse,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import { provideAppTitle } from '@app/common/seo/ui/title';
import {
  provideTanStackQuery,
  QueryClient,
  withDevtools,
} from '@tanstack/angular-query-experimental';
import { provideAngularSvgIcon } from 'angular-svg-icon';

import { appRoutes } from './app.routes';
import { environment } from './environments/environment';
import { ApiConfiguration } from './shared/data-access/api/api-configuration';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideHttpClient(withFetch(), withInterceptors([])),

    provideAngularSvgIcon(),
    provideTanStackQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: (count, error) => {
              if (error instanceof HttpErrorResponse) {
                if (error.status >= 400 && error.status < 500) {
                  return false;
                }
              }
              return count < 2;
            },
          },
          mutations: {
            retry: (count, error) => {
              if (error instanceof HttpErrorResponse) {
                if (error.status >= 400 && error.status < 500) {
                  return false;
                }
              }
              return count < 2;
            },
          },
        },
      }),
      withDevtools(),
    ),

    {
      provide: ApiConfiguration,
      useFactory: () => {
        const config = new ApiConfiguration();
        config.rootUrl = environment.api.url;
        return config;
      },
    },

    provideAppTitle('My Angular App'),
  ],
};
