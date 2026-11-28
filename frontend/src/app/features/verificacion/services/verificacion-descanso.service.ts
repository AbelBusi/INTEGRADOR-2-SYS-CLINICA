import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { VerificacionDescanso } from '../../../shared/documentos-clinicos/interface/descanso-medico.interface';
import { MensajeResponse } from '../../clinica/citas/interface/cita.interface';

@Injectable({
  providedIn: 'root',
})
export class VerificacionDescansoService {
  private readonly http = inject(HttpClient);

  verificar(codigo: string): Observable<MensajeResponse<VerificacionDescanso>> {
    return this.http.get<MensajeResponse<VerificacionDescanso>>(
      `${environment.apiUrl}/publico/descansos-medicos/verificar/${encodeURIComponent(codigo)}`,
    );
  }
}
