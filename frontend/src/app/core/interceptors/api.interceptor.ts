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

  let clonReq = req;

  if (req.url.startsWith('/')) {
    clonReq = req.clone({
      url: `${environment.apiUrl}${req.url}`,
    });
  }

  if (accessToken && !req.url.includes('/auth/')) {
    clonReq = clonReq.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(clonReq);
};
