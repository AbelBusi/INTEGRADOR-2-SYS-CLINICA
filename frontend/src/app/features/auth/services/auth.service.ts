import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  InicioSolicitud,
  LoginResponse,
  Perfil,
  SeleccionarRolSolicitud,
  TokenResponse,
} from '../models/auth.models';

export interface UsuarioRegistroDTO {
  persona: { id: number };
  rol: { id: number };
  usuario: string;
  claveAcceso: string;
  estado: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  registrar(dto: UsuarioRegistroDTO): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('/auth/register', dto);
  }

  login(credenciales: InicioSolicitud): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', credenciales).pipe(
      tap((respuesta) => {
        if (respuesta.sesion) {
          this.guardarTokens(respuesta.sesion);
        }
      }),
    );
  }

  seleccionarRol(tokenSeleccion: string, idRol: number): Observable<TokenResponse> {
    const cuerpo: SeleccionarRolSolicitud = { tokenSeleccion, idRol };

    return this.http
      .post<TokenResponse>('/auth/seleccionar-rol', cuerpo)
      .pipe(tap((tokens) => this.guardarTokens(tokens)));
  }

  getPerfiles(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>('/auth/perfiles');
  }

  cambiarPerfil(idRol: number): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>('/auth/cambiar-perfil', { idRol })
      .pipe(tap((tokens) => this.guardarTokens(tokens)));
  }

  refrescarToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);

    return this.http
      .post<TokenResponse>('/auth/refresh', {}, { headers })
      .pipe(tap((tokens) => this.guardarTokens(tokens)));
  }

  private guardarTokens(tokens: TokenResponse): void {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getUserId(): number {
    const token = this.getAccessToken();
    if (!token) return 4;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = JSON.parse(atob(payloadBase64));

      return payloadJson.jti ? Number(payloadJson.jti) : 4;
    } catch (e) {
      return 4;
    }
  }
  getAuthorities(): string[] {
    const token = this.getAccessToken();
    if (!token) return [];

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = atob(payloadBase64);
      const payloadJson = JSON.parse(payloadDecoded);
      return payloadJson.authorities || [];
    } catch (e) {
      return [];
    }
  }

  getRole(): string[] {
    const token = this.getAccessToken();
    if (!token) return [];

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = JSON.parse(atob(payloadBase64));

      const roles = payloadJson.role;

      if (Array.isArray(roles)) {
        return roles.map((rol: string) => rol.toUpperCase());
      }

      return typeof roles === 'string' && roles ? [roles.toUpperCase()] : [];
    } catch {
      return [];
    }
  }

  getActiveRole(): string {
    const token = this.getAccessToken();

    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.activeRole ?? '';
    } catch {
      return '';
    }
  }

  getIdRol(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = JSON.parse(atob(payloadBase64));
      return payloadJson.idRol != null ? Number(payloadJson.idRol) : null;
    } catch (e) {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
