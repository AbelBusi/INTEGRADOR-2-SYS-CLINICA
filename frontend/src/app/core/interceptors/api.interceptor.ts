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

  let url = req.url;

  if (url.startsWith('/')) {
    const baseUrl = environment.apiUrl.replace(/\/+$/, '');
    const path = url.startsWith(`${baseUrl}/`) || url === baseUrl ? url : `${baseUrl}${url}`;

    url = path;
  }

  const clonReq = req.clone({
    url,
    ...(accessToken && !url.includes('/auth/')
      ? {
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {}),
  });

  return next(clonReq);
};
