import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER } from 'ngx-ui-loader';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loaderInterceptor } from './core/interceptors/loader-interceptor';

const loaderConfig: NgxUiLoaderConfig = {
  fgsType: SPINNER.threeStrings,   // ← spinnerType → fgsType
  bgsOpacity: 0.5,
  fgsColor: '#2e7d32',
  overlayColor: 'rgba(0,0,0,0.3)',
  hasProgressBar: false,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideHttpClient(withInterceptors([authInterceptor, loaderInterceptor])),
    importProvidersFrom(NgxUiLoaderModule.forRoot(loaderConfig)),
  ]
};
