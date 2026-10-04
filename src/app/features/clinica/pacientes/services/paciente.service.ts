import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {
  PacienteInterface,
  PacienteDetalleLeerDTO,
  PacienteCrearDTO,
  PacienteResumenDTO,
} from '../interface/paciente.interface';
import { MensajeResponse } from '../models/paciente.model';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private readonly baseUrl = `${environment.apiUrl}/pacientes`;

  constructor(private readonly http: HttpClient) {}

  listarPacientes(estado?: string): Observable<PacienteInterface[]> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http
      .get<MensajeResponse<PacienteInterface[]>>(this.baseUrl, { params })
      .pipe(map((response) => response.object || []));
  }

  resumen(): Observable<PacienteResumenDTO[]> {
    return this.http
      .get<MensajeResponse<PacienteResumenDTO[]>>(`${this.baseUrl}/resumen`)
      .pipe(map((response) => response.object || []));
  }

  traerPacientePorId(id: number): Observable<PacienteDetalleLeerDTO> {
    return this.http
      .get<MensajeResponse<PacienteDetalleLeerDTO>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.object));
  }

  actualizarPaciente(id: number, dto: any): Observable<PacienteDetalleLeerDTO> {
    return this.http
      .put<MensajeResponse<PacienteDetalleLeerDTO>>(`${this.baseUrl}/${id}`, dto)
      .pipe(map((response) => response.object));
  }

  crearPaciente(dto: PacienteCrearDTO): Observable<PacienteCrearDTO> {
    return this.http
      .post<MensajeResponse<PacienteCrearDTO>>(this.baseUrl, dto)
      .pipe(map((response) => response.object));
  }

  eliminarPaciente(id: number): Observable<any> {
    return this.http
      .delete<MensajeResponse<null>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response?.object || null));
  }
}
