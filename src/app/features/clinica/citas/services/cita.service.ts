import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { EmpleadoHorario } from '../../horarios/interface/horario.interface';
import {
  Cita,
  CitaDTO,
  EspecialidadResumen,
  MedicoInfo,
  MedicoResumen,
  MensajeResponse,
  PacienteResumen,
} from '../interface/cita.interface';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private readonly baseUrl = `${environment.apiUrl}/citas-medicas`;

  constructor(private readonly http: HttpClient) {}

  listar(estado?: number): Observable<MensajeResponse<Cita[]>> {
    let params = new HttpParams();
    if (estado !== undefined) {
      params = params.set('estado', estado);
    }
    return this.http.get<MensajeResponse<Cita[]>>(this.baseUrl, { params });
  }

  crear(dto: CitaDTO): Observable<MensajeResponse<Cita>> {
    return this.http.post<MensajeResponse<Cita>>(this.baseUrl, dto);
  }

  actualizar(id: number, dto: CitaDTO): Observable<MensajeResponse<Cita>> {
    return this.http.put<MensajeResponse<Cita>>(`${this.baseUrl}/${id}`, dto);
  }

  cancelar(id: number): Observable<MensajeResponse<null>> {
    return this.http.patch<MensajeResponse<null>>(`${this.baseUrl}/${id}/cancelar`, null);
  }

  eliminar(id: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(`${this.baseUrl}/${id}`);
  }

  listarPacientesResumen(): Observable<MensajeResponse<PacienteResumen[]>> {
    return this.http.get<MensajeResponse<PacienteResumen[]>>(
      `${environment.apiUrl}/pacientes/resumen`,
    );
  }

  listarEspecialidadesResumen(): Observable<MensajeResponse<EspecialidadResumen[]>> {
    return this.http.get<MensajeResponse<EspecialidadResumen[]>>(
      `${environment.apiUrl}/especialidades/resumen`,
    );
  }

  listarMedicosPorEspecialidad(
    idEspecialidad: number,
  ): Observable<MensajeResponse<MedicoResumen[]>> {
    return this.http.get<MensajeResponse<MedicoResumen[]>>(
      `${environment.apiUrl}/medicos/especialidad/${idEspecialidad}/resumen`,
    );
  }

  obtenerMedico(idMedico: number): Observable<MensajeResponse<MedicoInfo>> {
    return this.http.get<MensajeResponse<MedicoInfo>>(`${environment.apiUrl}/medicos/${idMedico}`);
  }

  obtenerHorarios(idEmpleado: number): Observable<MensajeResponse<EmpleadoHorario>> {
    return this.http
      .get<MensajeResponse<EmpleadoHorario>>(`${environment.apiUrl}/horarios/${idEmpleado}`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          error.status === 404
            ? of({ mensaje: '', object: { idEmpleado, horarios: [] } })
            : throwError(() => error),
        ),
      );
  }
}
