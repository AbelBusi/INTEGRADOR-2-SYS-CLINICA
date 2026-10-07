import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('miapi.cloud')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  if (accessToken && !req.url.includes('/auth/')) {
    return next(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
  }

  return next(req);
};
