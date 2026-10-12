import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('miapi.cloud')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  const clonReq = req.clone({
    url: req.url.startsWith('/') ? `${environment.apiUrl}${req.url}` : req.url,
    ...(accessToken && !req.url.includes('/auth/')
      ? {
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {}),
  });

  return next(clonReq);
};
