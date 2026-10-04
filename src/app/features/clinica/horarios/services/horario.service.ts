import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../../../../shared/models/mensaje-response.model';
import {
  HorarioTrabajoLeer,
  HorarioCrearDTO,
  HorarioActualizarDTO,
  Disponibilidad,
  Agenda,
} from '../models/horario.model';

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/horarios`;

  listar(): Observable<HorarioTrabajoLeer[]> {
    return this.http
      .get<MensajeResponse<HorarioTrabajoLeer[]>>(this.baseUrl)
      .pipe(map((r) => r.object ?? []));
  }

  crear(dto: HorarioCrearDTO): Observable<MensajeResponse<HorarioTrabajoLeer>> {
    return this.http.post<MensajeResponse<HorarioTrabajoLeer>>(this.baseUrl, dto);
  }

  actualizar(id: number, dto: HorarioActualizarDTO): Observable<MensajeResponse<HorarioTrabajoLeer>> {
    return this.http.put<MensajeResponse<HorarioTrabajoLeer>>(`${this.baseUrl}/${id}`, dto);
  }

  eliminar(id: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(`${this.baseUrl}/${id}`);
  }

  doctoresDisponibles(
    fecha: string,
    horaInicio: string,
    horaFin: string,
    especialidadId?: number,
  ): Observable<Disponibilidad[]> {
    let params = new HttpParams()
      .set('fecha', fecha)
      .set('horaInicio', horaInicio)
      .set('horaFin', horaFin);
    if (especialidadId) params = params.set('especialidadId', String(especialidadId));
    return this.http
      .get<MensajeResponse<Disponibilidad[]>>(`${this.baseUrl}/disponibilidad/doctores`, { params })
      .pipe(map((r) => r.object ?? []));
  }

  recepcionistasDisponibles(
    fecha: string,
    horaInicio: string,
    horaFin: string,
  ): Observable<Disponibilidad[]> {
    const params = new HttpParams()
      .set('fecha', fecha)
      .set('horaInicio', horaInicio)
      .set('horaFin', horaFin);
    return this.http
      .get<MensajeResponse<Disponibilidad[]>>(`${this.baseUrl}/disponibilidad/recepcionistas`, {
        params,
      })
      .pipe(map((r) => r.object ?? []));
  }

  agenda(
    tipo: 'DOCTOR' | 'RECEPCIONISTA',
    referenciaId: number,
    desde: string,
    hasta: string,
  ): Observable<Agenda> {
    const params = new HttpParams()
      .set('tipo', tipo)
      .set('referenciaId', String(referenciaId))
      .set('desde', desde)
      .set('hasta', hasta);
    return this.http
      .get<MensajeResponse<Agenda>>(`${this.baseUrl}/agenda`, { params })
      .pipe(map((r) => r.object ?? { bloques: [], citas: [] }));
  }
}
