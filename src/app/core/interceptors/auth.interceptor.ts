// core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    debugger
//   const token = localStorage.getItem('auth_token');
  const token = '8d2fb2e2-c205-3eb2-ae1b-b4bdb8707b7e';

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
