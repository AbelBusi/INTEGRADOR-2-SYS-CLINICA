import { HttpErrorResponse } from '@angular/common/http';


export function extraerMensajeError(err: HttpErrorResponse): string | null {
  if (err.status === 0 || err.status >= 500) {
    return null;
  }
  if (err.error?.mensaje) {
    return err.error.mensaje;
  }
  if (err.status === 400) {
    return 'Los datos ingresados no son válidos.';
  }
  if (err.status === 429) {
    return 'Demasiados intentos. Intente nuevamente en unos minutos.';
  }
  return 'Ocurrió un error inesperado en el sistema.';
}
