import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import {
  CargoCrearDTO,
  MensajeResponse,
  MensajeResponseSingle,
  CargoActualizarDTO
} from '../interface/cargo.interface';
import { MensajeResponses } from '../../../../shared/models/mensaje-response.model';

@Injectable({
  providedIn: 'root',
})
export class CargoService {
  private readonly baseUrl = `${environment.apiUrl}/cargos`;

  constructor(private readonly http: HttpClient) {}

  listar(estado?: 'activo' | 'inactivo'): Observable<MensajeResponse> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<MensajeResponse>(this.baseUrl, { params });
  }

  crear(especialidad: CargoCrearDTO): Observable<MensajeResponseSingle> {
    return this.http.post<MensajeResponseSingle>(this.baseUrl, especialidad);
  }

  actualizar(id: number, dto: CargoActualizarDTO): Observable<MensajeResponseSingle> {
    return this.http.put<MensajeResponseSingle>(`${this.baseUrl}/${id}`, dto);
  }

  eliminarPorId(id: number): Observable<MensajeResponse> {
    return this.http.delete<MensajeResponse>(`${this.baseUrl}/${id}`);
  }

  cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Observable<MensajeResponses<null>> {
    const params = new HttpParams().set('estado', estado);

    return this.http.patch<MensajeResponses<null>>(`${this.baseUrl}/${id}`, null, { params });
  }

}
