import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  MensajeResponse,
  Paciente,
  PacienteActualizarDTO,
  PacienteCrearDTO,
  PacienteDetalle,
  PacienteRespuesta,
  TipoDocumentoResumen,
} from '../interface/paciente.interface';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private readonly baseUrl = `${environment.apiUrl}/pacientes`;

  constructor(private readonly http: HttpClient) {}

  listar(estado?: 'activo' | 'inactivo'): Observable<MensajeResponse<Paciente[]>> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<MensajeResponse<Paciente[]>>(this.baseUrl, { params });
  }

  obtenerPorId(id: number): Observable<MensajeResponse<PacienteDetalle>> {
    return this.http.get<MensajeResponse<PacienteDetalle>>(`${this.baseUrl}/${id}`);
  }

  crear(dto: PacienteCrearDTO): Observable<MensajeResponse<PacienteRespuesta>> {
    return this.http.post<MensajeResponse<PacienteRespuesta>>(this.baseUrl, dto);
  }

  actualizar(
    id: number,
    dto: PacienteActualizarDTO,
  ): Observable<MensajeResponse<PacienteRespuesta>> {
    return this.http.put<MensajeResponse<PacienteRespuesta>>(`${this.baseUrl}/${id}`, dto);
  }

  cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Observable<MensajeResponse<null>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<MensajeResponse<null>>(`${this.baseUrl}/${id}`, null, { params });
  }

  eliminarPorId(id: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(`${this.baseUrl}/${id}`);
  }

  listarTiposDocumentoResumen(): Observable<MensajeResponse<TipoDocumentoResumen[]>> {
    return this.http.get<MensajeResponse<TipoDocumentoResumen[]>>(
      `${environment.apiUrl}/tipo-documentos/resumen`,
    );
  }

}
