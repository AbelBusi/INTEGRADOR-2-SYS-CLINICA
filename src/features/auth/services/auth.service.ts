import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { InicioSolicitud, TokenResponse } from '../models/auth.models';

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

  login(credenciales: InicioSolicitud): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>('/auth/login', credenciales)
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

  getRole(): string {
    const token = this.getAccessToken();
    if (!token) return '';

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = JSON.parse(atob(payloadBase64));
      return (payloadJson.role || '').toUpperCase();
    } catch (e) {
      return '';
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
