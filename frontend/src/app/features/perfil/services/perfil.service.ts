import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import {
  ActualizarContactoDTO,
  CambiarClavePerfilDTO,
  MensajeObjeto,
  Perfil,
} from '../models/perfil.models';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly base = `${environment.apiUrl}/perfil`;

  private headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getAccessToken()}`);
  }

  obtener(): Observable<Perfil> {
    return this.http
      .get<MensajeObjeto<Perfil>>(this.base, { headers: this.headers() })
      .pipe(map((res) => res.object));
  }

  actualizarContacto(dto: ActualizarContactoDTO): Observable<Perfil> {
    return this.http
      .put<MensajeObjeto<Perfil>>(`${this.base}/contacto`, dto, { headers: this.headers() })
      .pipe(map((res) => res.object));
  }

  solicitarCambioCorreo(nuevoCorreo: string): Observable<string> {
    return this.http
      .post<MensajeObjeto<string>>(
        `${this.base}/correo/solicitar`,
        { nuevoCorreo },
        { headers: this.headers() },
      )
      .pipe(map((res) => res.object));
  }

  confirmarCambioCorreo(codigo: string): Observable<Perfil> {
    return this.http
      .post<MensajeObjeto<Perfil>>(
        `${this.base}/correo/confirmar`,
        { codigo },
        { headers: this.headers() },
      )
      .pipe(map((res) => res.object));
  }

  cambiarClave(dto: CambiarClavePerfilDTO): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.base}/clave`, dto, {
      headers: this.headers(),
    });
  }
}
