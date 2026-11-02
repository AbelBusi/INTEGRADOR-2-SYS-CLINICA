import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  EmpleadoMedicoResumen,
  EspecialidadResumen,
  MensajeResponse,
  Medico,
  MedicoActualizarDTO,
  MedicoCrearDTO,
  MedicoDetalle,
  MedicoRespuesta,
  DisponibilidadCodigos,
} from '../interface/medico.interface';

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  private readonly baseUrl = `${environment.apiUrl}/medicos`;

  constructor(private readonly http: HttpClient) {}

  listar(estado?: 'activo' | 'inactivo'): Observable<MensajeResponse<Medico[]>> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<MensajeResponse<Medico[]>>(this.baseUrl, { params });
  }

  obtenerPorId(id: number): Observable<MensajeResponse<MedicoDetalle>> {
    return this.http.get<MensajeResponse<MedicoDetalle>>(`${this.baseUrl}/${id}`);
  }

  crear(dto: MedicoCrearDTO): Observable<MensajeResponse<MedicoRespuesta>> {
    return this.http.post<MensajeResponse<MedicoRespuesta>>(this.baseUrl, dto);
  }

  actualizar(id: number, dto: MedicoActualizarDTO): Observable<MensajeResponse<MedicoRespuesta>> {
    return this.http.put<MensajeResponse<MedicoRespuesta>>(`${this.baseUrl}/${id}`, dto);
  }

  cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Observable<MensajeResponse<null>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<MensajeResponse<null>>(`${this.baseUrl}/${id}`, null, { params });
  }

  eliminarPorId(id: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(`${this.baseUrl}/${id}`);
  }

  listarEmpleadosMedicos(): Observable<MensajeResponse<EmpleadoMedicoResumen[]>> {
    return this.http.get<MensajeResponse<EmpleadoMedicoResumen[]>>(
      `${environment.apiUrl}/empleados/medicos`,
    );
  }

  listarEspecialidadesResumen(): Observable<MensajeResponse<EspecialidadResumen[]>> {
    return this.http.get<MensajeResponse<EspecialidadResumen[]>>(
      `${environment.apiUrl}/especialidades/resumen`,
    );
  }

  obtenerUrlFoto(foto: string | null | undefined): string | null {
    if (!foto) {
      return null;
    }
    if (/^https?:\/\//i.test(foto)) {
      return foto;
    }
    return `${environment.serverUrl}/${foto.replace(/^\/+/, '')}`;
  }

  verificarDisponibilidad(
    numeroColegiatura: string,
    numeroEspecialidad: string,
  ): Observable<MensajeResponse<DisponibilidadCodigos>> {
    const params = new HttpParams()
      .set('numeroColegiatura', numeroColegiatura)
      .set('numeroEspecialidad', numeroEspecialidad);

    return this.http.get<MensajeResponse<DisponibilidadCodigos>>(`${this.baseUrl}/disponibilidad`, {
      params,
    });
  }
}
