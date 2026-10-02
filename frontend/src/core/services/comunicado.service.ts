import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MensajeResponse } from '../../shared/models/mensaje-response.model';

export interface Comunicado {
  id: number;
  titulo: string;
  mensaje: string;
  fecha: string;
}

@Injectable({ providedIn: 'root' })
export class ComunicadoService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Comunicado[]> {
    return this.http
      .get<MensajeResponse<Comunicado[]>>(`${environment.apiUrl}/comunicados`)
      .pipe(map((r) => r.object ?? []));
  }
}
