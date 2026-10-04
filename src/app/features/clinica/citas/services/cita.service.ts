import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { MensajeResponse, CitaMedicaCrearDTO, CitaMedicaActualizarDTO} from '../interface/cita.interface';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/citas-medicas`;

  listar(): Observable<MensajeResponse> {
    const params = new HttpParams().set('estado', 'ACTIVO');

    return this.http.get<MensajeResponse>(this.baseUrl, { params });
  }

  mias(): Observable<MensajeResponse> {
    return this.http.get<MensajeResponse>(`${this.baseUrl}/mias`);
  }

  obtenerPorId(id: number): Observable<MensajeResponse> {
    return this.http.get<MensajeResponse>(`${this.baseUrl}/${id}`);
  }

  crear(dto: CitaMedicaCrearDTO): Observable<unknown> {
    return this.http.post<MensajeResponse>(this.baseUrl, dto).pipe(map((r) => r.object));
  }

  actualizar(id: number, dto: CitaMedicaActualizarDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }
}
