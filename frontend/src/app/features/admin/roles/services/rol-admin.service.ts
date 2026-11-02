import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../../../../shared/models/mensaje-response.model';
import { Rol, RolActualizarDTO, RolCrearDTO } from '../models/rol.model';

@Injectable({ providedIn: 'root' })
export class RolAdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/roles`;

  listar(): Observable<Rol[]> {
    return this.http
      .get<MensajeResponse<Rol[]>>(this.baseUrl)
      .pipe(map((r) => r.object ?? []));
  }

  crear(dto: RolCrearDTO): Observable<Rol> {
    return this.http
      .post<MensajeResponse<Rol>>(this.baseUrl, dto)
      .pipe(map((r) => r.object));
  }

  actualizar(id: number, dto: RolActualizarDTO): Observable<Rol> {
    return this.http
      .put<MensajeResponse<Rol>>(`${this.baseUrl}/${id}`, dto)
      .pipe(map((r) => r.object));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
