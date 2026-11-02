import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { Cita, CitaDTO, MensajeResponse } from '../interface/cita.interface';
import { DerivacionCita } from '../interface/derivacion.interface';

@Injectable({ providedIn: 'root' })
export class DerivacionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/derivaciones`;

  buscarPorCodigo(codigo: string): Observable<MensajeResponse<DerivacionCita>> {
    return this.http.get<MensajeResponse<DerivacionCita>>(
      `${this.url}/codigo/${encodeURIComponent(codigo.trim())}`,
    );
  }

  programarCita(idDerivacion: number, dto: CitaDTO): Observable<MensajeResponse<Cita>> {
    return this.http.post<MensajeResponse<Cita>>(`${this.url}/${idDerivacion}/programar-cita`, dto);
  }
}
