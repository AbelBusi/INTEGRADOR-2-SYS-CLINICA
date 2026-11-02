import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MensajeResponse,
  RecuperarClaveRequest,
  RestablecerClaveRequest,
  VerificarCodigoRequest,
} from '../models/recuperacion-clave.model';

@Injectable({ providedIn: 'root' })
export class RecuperacionClaveService {
  private http = inject(HttpClient);

  solicitarCodigo(dto: RecuperarClaveRequest): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>('/auth/recuperar-clave', dto);
  }

  verificarCodigo(dto: VerificarCodigoRequest): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>('/auth/verificar-codigo', dto);
  }

  restablecerClave(dto: RestablecerClaveRequest): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>('/auth/restablecer-clave', dto);
  }
}
