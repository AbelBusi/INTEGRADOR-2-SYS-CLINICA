import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MensajeResponse } from '../../../shared/models/mensaje-response.model';
import {
  DoctorActual,
  DoctorCita,
  PacienteDoctor,
  Atencion,
  AtencionCrear,
} from '../models/doctor-portal.model';

@Injectable({ providedIn: 'root' })
export class DoctorPortalService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  actual(): Observable<DoctorActual> {
    return this.http
      .get<MensajeResponse<DoctorActual>>(`${this.api}/doctores/actual`)
      .pipe(map((r) => r.object));
  }

  misCitas(estado: number): Observable<DoctorCita[]> {
    const params = new HttpParams().set('estado', String(estado));
    return this.http
      .get<MensajeResponse<DoctorCita[]>>(`${this.api}/citas-medicas/doctor/mias`, { params })
      .pipe(map((r) => r.object ?? []));
  }

  misPacientes(estado: number): Observable<PacienteDoctor[]> {
    const params = new HttpParams().set('estado', String(estado));
    return this.http
      .get<MensajeResponse<PacienteDoctor[]>>(`${this.api}/doctores/mis-pacientes`, { params })
      .pipe(map((r) => r.object ?? []));
  }

  atender(citaId: number, dto: AtencionCrear): Observable<MensajeResponse<null>> {
    return this.http.post<MensajeResponse<null>>(
      `${this.api}/citas-medicas/${citaId}/atender`,
      dto,
    );
  }

  historia(pacienteId: number): Observable<Atencion[]> {
    return this.http
      .get<MensajeResponse<Atencion[]>>(`${this.api}/atenciones/paciente/${pacienteId}`)
      .pipe(map((r) => r.object ?? []));
  }
}
