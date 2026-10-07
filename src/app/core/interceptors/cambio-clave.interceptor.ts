import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { CambioClaveService } from '../../features/auth/services/cambio-clave.services';

export const cambioClaveInterceptor: HttpInterceptorFn = (req, next) => {
  const cambioClave = inject(CambioClaveService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403 && error.error?.codigo === 'CAMBIO_CLAVE_REQUERIDO') {
        cambioClave.marcarRequerido();
      }

      return throwError(() => error);
    }),
  );
};
