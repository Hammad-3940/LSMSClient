import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../../shared/commonservice/common.service';

export const authGuard: CanActivateFn = () => {
  const commonService = inject(CommonService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ SSR bypass
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = commonService.getToken();
  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
