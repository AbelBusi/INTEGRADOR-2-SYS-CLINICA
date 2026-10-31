import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { EmpleadoHorario } from '../../horarios/interface/horario.interface';
import {
  Cita,
  CitaDTO,
  EspecialidadResumen,
  HistorialCita,
  MedicoInfo,
  MedicoResumen,
  MensajeResponse,
  PacienteBusqueda,
  PacienteInfo,
  ResolucionRegularizacion,
  UsuarioRegistro,
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

  cancelar(id: number, observacion?: string): Observable<MensajeResponse<null>> {
    const texto = observacion?.trim();
    return this.http.patch<MensajeResponse<null>>(
      `${this.baseUrl}/${id}/cancelar`,
      texto ? { observacion: texto } : null,
    );
  }

  eliminar(id: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(`${this.baseUrl}/${id}`);
  }

  buscarPacientes(busqueda: string): Observable<MensajeResponse<PacienteBusqueda[]>> {
    const params = new HttpParams().set('busqueda', busqueda);
    return this.http.get<MensajeResponse<PacienteBusqueda[]>>(
      `${environment.apiUrl}/pacientes/buscar`,
      { params },
    );
  }

  obtenerPaciente(id: number): Observable<MensajeResponse<PacienteInfo>> {
    return this.http.get<MensajeResponse<PacienteInfo>>(`${environment.apiUrl}/pacientes/${id}`);
  }

  obtenerUsuario(id: number): Observable<MensajeResponse<UsuarioRegistro>> {
    return this.http.get<MensajeResponse<UsuarioRegistro>>(
      `${environment.apiUrl}/usuarios/${id}/roles`,
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

  listarMisCitasMedico(estado?: number): Observable<MensajeResponse<Cita[]>> {
    return this.http.get<MensajeResponse<Cita[]>>(`${this.baseUrl}/mis-citas/medico`, {
      params: this.paramsEstado(estado),
    });
  }

  listarMisCitasPaciente(estado?: number): Observable<MensajeResponse<Cita[]>> {
    return this.http.get<MensajeResponse<Cita[]>>(`${this.baseUrl}/mis-citas/paciente`, {
      params: this.paramsEstado(estado),
    });
  }

  atender(id: number, observacion?: string): Observable<MensajeResponse<null>> {
    const texto = observacion?.trim();
    return this.http.patch<MensajeResponse<null>>(
      `${this.baseUrl}/${id}/atender`,
      texto ? { observacion: texto } : null,
    );
  }

  historial(idCita: number): Observable<MensajeResponse<HistorialCita[]>> {
    return this.http.get<MensajeResponse<HistorialCita[]>>(`${this.baseUrl}/${idCita}/historial`);
  }

  private paramsEstado(estado?: number): HttpParams {
    return estado !== undefined ? new HttpParams().set('estado', estado) : new HttpParams();
  }

  listarPendientesRegularizacion(): Observable<MensajeResponse<Cita[]>> {
    return this.http.get<MensajeResponse<Cita[]>>(`${this.baseUrl}/pendientes-regularizacion`);
  }

  listarMisPendientesRegularizacionMedico(): Observable<MensajeResponse<Cita[]>> {
    return this.http.get<MensajeResponse<Cita[]>>(
      `${this.baseUrl}/mis-citas/medico/pendientes-regularizacion`,
    );
  }

  regularizar(
    id: number,
    resolucion: ResolucionRegularizacion,
    observacion: string,
  ): Observable<MensajeResponse<null>> {
    return this.http.patch<MensajeResponse<null>>(`${this.baseUrl}/${id}/regularizar`, {
      resolucion,
      observacion: observacion.trim(),
    });
  }

  iniciarAtencion(id: number): Observable<MensajeResponse<null>> {
    return this.http.patch<MensajeResponse<null>>(`${this.baseUrl}/${id}/iniciar-atencion`, null);
  }
}
