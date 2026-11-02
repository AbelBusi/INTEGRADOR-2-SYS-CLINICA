import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../../../../shared/models/mensaje-response.model';
import { DoctorLeer, DoctorCrearDTO, NombreDoctorResumen } from '../models/doctor.model';
import { DoctorDetalle,DoctorActualizarDTO, DoctorEspecialidadResumen } from '../interface/doctor.interface';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/doctores`;

  listar(estado?: string): Observable<DoctorLeer[]> {
    let params = new HttpParams();

    if (estado) params = params.set('estado', estado);

    return this.http

      .get<MensajeResponse<DoctorLeer[]>>(this.baseUrl, { params })

      .pipe(map((r) => r.object ?? []));
  }

  resumen(estado: 'activo' | 'inactivo' = 'activo'): Observable<NombreDoctorResumen[]> {
    let params = new HttpParams();

    if (estado) params = params.set('estado', estado);

    return this.http

      .get<MensajeResponse<NombreDoctorResumen[]>>(`${this.baseUrl}/resumen`, { params })

      .pipe(map((r) => r.object ?? []));
  }

  crear(dto: DoctorCrearDTO): Observable<unknown> {
    return this.http.post<MensajeResponse>(this.baseUrl, dto).pipe(map((r) => r.object));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  obtenerPorId(id: number): Observable<DoctorDetalle> {
    return this.http

      .get<MensajeResponse<DoctorDetalle>>(`${this.baseUrl}/${id}`)

      .pipe(map((r) => r.object));
  }

  actualizar(id: number, dto: DoctorActualizarDTO): Observable<MensajeResponse<unknown>> {
    return this.http.put<MensajeResponse<unknown>>(`${this.baseUrl}/${id}`, dto);
  }

  listarPorEspecialidad(especialidadId: number): Observable<DoctorEspecialidadResumen[]> {
    return this.http
      .get<
        MensajeResponse<DoctorEspecialidadResumen[]>
      >(`${this.baseUrl}/especialidad/${especialidadId}`)
      .pipe(map((r) => r.object ?? []));
  }

}
