import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../interface/cita.interface';
import {
  ExamenSolicitado,
  ExamenSolicitadoActualizarDTO,
  ExamenSolicitadoCrearDTO,
} from '../interface/examen-solicitado.interface';

@Injectable({ providedIn: 'root' })
export class ExamenSolicitadoService {
  private readonly http = inject(HttpClient);
  private readonly diagnosticosUrl = `${environment.apiUrl}/diagnosticos`;

  crear(
    idDiagnostico: number,
    dto: ExamenSolicitadoCrearDTO,
  ): Observable<MensajeResponse<ExamenSolicitado>> {
    return this.http.post<MensajeResponse<ExamenSolicitado>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/examenes-solicitados`,
      dto,
    );
  }

  actualizar(
    idDiagnostico: number,
    idExamen: number,
    dto: ExamenSolicitadoActualizarDTO,
  ): Observable<MensajeResponse<ExamenSolicitado>> {
    return this.http.put<MensajeResponse<ExamenSolicitado>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/examenes-solicitados/${idExamen}`,
      dto,
    );
  }

  eliminar(idDiagnostico: number, idExamen: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/examenes-solicitados/${idExamen}`,
    );
  }
}
