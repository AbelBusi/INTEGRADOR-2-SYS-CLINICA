import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { ToastService } from '../services/toast.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url.includes('miapi.cloud')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toastService.error('El servidor médico no responde. Verifica tu conexión.');
      }

      if (error.status >= 500) {
        toastService.warning('Inconveniente en el servidor. Intente en unos minutos.');
      }

      if (error.status === 401 && !req.url.includes('/auth/login')) {
        return authService.refrescarToken().pipe(
          switchMap((nuevosTokens) => {
            const nuevaReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${nuevosTokens.access_token}`,
              },
            });
            return next(nuevaReq);
          }),
          catchError((errRefresh) => {
            authService.logout();
            window.location.href = '/login';
            return throwError(() => errRefresh);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
