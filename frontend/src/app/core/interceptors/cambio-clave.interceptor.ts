import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {
  CambioClaveService,
  esCambioClaveRequerido,
} from '../../features/auth/services/cambio-clave.services';

export const cambioClaveInterceptor: HttpInterceptorFn = (req, next) => {
  const cambioClave = inject(CambioClaveService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (esCambioClaveRequerido(error)) {
        cambioClave.marcarRequerido();
      }

      return throwError(() => error);
    }),
  );
};
