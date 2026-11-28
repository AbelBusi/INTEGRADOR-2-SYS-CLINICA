import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import {
  ExamenMedicoActualizarDTO,
  ExamenMedicoBusquedaResponse,
  ExamenMedicoCrearDTO,
  ExamenMedicoResponse,
  ExamenMedicoResponseSingle,
} from '../interface/examen-medico.interface';
import { MensajeResponses } from '../../../../shared/models/mensaje-response.model';

@Injectable({
  providedIn: 'root',
})
export class ExamenMedicoService {
  private readonly baseUrl = `${environment.apiUrl}/examenes-medicos`;

  constructor(private readonly http: HttpClient) {}

  listar(estado?: 'activo' | 'inactivo'): Observable<ExamenMedicoResponse> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<ExamenMedicoResponse>(this.baseUrl, { params });
  }

  buscar(busqueda: string): Observable<ExamenMedicoBusquedaResponse> {
    const params = new HttpParams().set('busqueda', busqueda);
    return this.http.get<ExamenMedicoBusquedaResponse>(`${this.baseUrl}/buscar`, { params });
  }

  listarResumen(): Observable<ExamenMedicoBusquedaResponse> {
    return this.http.get<ExamenMedicoBusquedaResponse>(`${this.baseUrl}/resumen`);
  }

  crear(dto: ExamenMedicoCrearDTO): Observable<ExamenMedicoResponseSingle> {
    return this.http.post<ExamenMedicoResponseSingle>(this.baseUrl, dto);
  }

  actualizar(id: number, dto: ExamenMedicoActualizarDTO): Observable<ExamenMedicoResponseSingle> {
    return this.http.put<ExamenMedicoResponseSingle>(`${this.baseUrl}/${id}`, dto);
  }

  cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Observable<MensajeResponses<null>> {
    const params = new HttpParams().set('estado', estado);

    return this.http.patch<MensajeResponses<null>>(`${this.baseUrl}/${id}`, null, { params });
  }
}
