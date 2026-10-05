import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../../../../shared/models/mensaje-response.model';
import { UsuarioLeer, UsuarioCrearDTO, UsuarioDetalle } from '../models/usuario.model';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  listar(estado?: 'ACTIVO' | 'INACTIVO'): Observable<UsuarioLeer[]> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    return this.http
      .get<MensajeResponse<UsuarioLeer[]>>(this.baseUrl, { params })
      .pipe(map((r) => r.object ?? []));
  }

  obtenerPorId(id: number): Observable<UsuarioDetalle> {
    return this.http
      .get<MensajeResponse<UsuarioDetalle>>(`${this.baseUrl}/${id}`)
      .pipe(map((r) => r.object));
  }

  crear(dto: UsuarioCrearDTO): Observable<unknown> {
    return this.authService.registrar(dto);
  }

  eliminar(id: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
