import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth.service';

export interface CambiarClaveDTO {
  claveActual: string;
  nuevaClave: string;
}

@Injectable({
  providedIn: 'root',
})
export class CambioClaveService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly requerido = signal(false);

  marcarRequerido(): void {
    this.requerido.set(true);
  }

  cambiar(dto: CambiarClaveDTO): Observable<{ mensaje: string }> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getAccessToken()}`,
    );

    return this.http.post<{ mensaje: string }>(`${environment.apiUrl}/auth/cambiar-clave`, dto, {
      headers,
    });
  }
}

export function esCambioClaveRequerido(error: unknown): boolean {
  const respuesta = error as { status?: number; error?: unknown } | null;

  if (respuesta?.status !== 403) {
    return false;
  }

  const cuerpo = respuesta.error;

  if (typeof cuerpo === 'string') {
    return cuerpo.includes('CAMBIO_CLAVE_REQUERIDO');
  }

  return (cuerpo as { codigo?: string } | null)?.codigo === 'CAMBIO_CLAVE_REQUERIDO';
}
