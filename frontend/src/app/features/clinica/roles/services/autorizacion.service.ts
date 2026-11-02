import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AutorizacionRespuesta,
  AutorizacionRol,
  AutorizacionSincronizarDTO,
  MensajeResponse,
  PermisosModulos,
} from '../interface/autorizacion.interface';

@Injectable({
  providedIn: 'root',
})
export class AutorizacionService {
  private readonly baseUrl = `${environment.apiUrl}/autorizaciones`;

  constructor(private readonly http: HttpClient) {}

  listarPermisos(): Observable<MensajeResponse<PermisosModulos>> {
    return this.http.get<MensajeResponse<PermisosModulos>>(`${this.baseUrl}/permisos`);
  }

  listarPorRol(idRol: number): Observable<MensajeResponse<AutorizacionRol>> {
    return this.http.get<MensajeResponse<AutorizacionRol>>(`${this.baseUrl}/${idRol}`);
  }

  sincronizar(dto: AutorizacionSincronizarDTO): Observable<MensajeResponse<AutorizacionRespuesta>> {
    return this.http.put<MensajeResponse<AutorizacionRespuesta>>(this.baseUrl, dto);
  }
}
