import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../../../../shared/models/mensaje-response.model';
import { NombreRecepcionistaDTO } from '../interface/recepcionista.interface';
import {
  RecepcionistaCrearDTO,
  RecepcionistaLeer,
  RecepcionistaActualizarDTO,
  RecepcionistaDetalle,
} from '../models/recepcionista.model';

@Injectable({ providedIn: 'root' })
export class RecepcionistaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/recepcionistas`;

  resumen(): Observable<NombreRecepcionistaDTO[]> {
    return this.http
      .get<MensajeResponse<NombreRecepcionistaDTO[]>>(`${this.baseUrl}/resumen`)
      .pipe(map((r) => r.object ?? []));
  }
  listar(estado?: 'ACTIVO' | 'INACTIVO'): Observable<RecepcionistaLeer[]> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    return this.http
      .get<MensajeResponse<RecepcionistaLeer[]>>(this.baseUrl, { params })
      .pipe(map((r) => r.object ?? []));
  }

  obtenerPorId(id: number): Observable<RecepcionistaDetalle> {
    return this.http
      .get<MensajeResponse<RecepcionistaDetalle>>(`${this.baseUrl}/${id}`)
      .pipe(map((r) => r.object));
  }

  actual(): Observable<RecepcionistaLeer> {
    return this.http
      .get<MensajeResponse<RecepcionistaLeer>>(`${this.baseUrl}/actual`)
      .pipe(map((r) => r.object));
  }

  crear(dto: RecepcionistaCrearDTO): Observable<unknown> {
    return this.http
      .post<MensajeResponse>(this.baseUrl, dto)
      .pipe(map((r) => r.object));
  }

  actualizar(id: number, dto: RecepcionistaActualizarDTO): Observable<MensajeResponse<unknown>> {
    return this.http.put<MensajeResponse<unknown>>(`${this.baseUrl}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
