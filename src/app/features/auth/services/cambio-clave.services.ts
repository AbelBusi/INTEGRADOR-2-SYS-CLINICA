import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth.service';

export interface CambiarClaveDTO {
  claveActual: string;
  nuevaClave: string;
}

export interface EstadoCuenta {
  requiere_cambio_clave: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CambioClaveService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly requerido = signal(false);

  verificarEstado(): Observable<EstadoCuenta> {
    return this.http
      .get<EstadoCuenta>(`${environment.apiUrl}/auth/estado-cuenta`, { headers: this.cabeceras() })
      .pipe(tap((estado) => this.requerido.set(estado.requiere_cambio_clave)));
  }

  marcarRequerido(): void {
    this.requerido.set(true);
  }

  cambiar(dto: CambiarClaveDTO): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${environment.apiUrl}/auth/cambiar-clave`, dto, {
      headers: this.cabeceras(),
    });
  }

  private cabeceras(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getAccessToken()}`);
  }
}
