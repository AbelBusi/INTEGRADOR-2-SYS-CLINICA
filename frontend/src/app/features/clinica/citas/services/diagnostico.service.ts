import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import {
  Diagnostico,
  DiagnosticoActualizarDTO,
  DiagnosticoCrearDTO,
} from '../interface/atencion-clinica.interface';
import { MensajeResponse } from '../interface/cita.interface';

@Injectable({ providedIn: 'root' })
export class DiagnosticoService {
  private readonly http = inject(HttpClient);
  private readonly citasUrl = `${environment.apiUrl}/citas-medicas`;
  private readonly diagnosticosUrl = `${environment.apiUrl}/diagnosticos`;

  crear(idCita: number, dto: DiagnosticoCrearDTO): Observable<MensajeResponse<Diagnostico>> {
    return this.http.post<MensajeResponse<Diagnostico>>(
      `${this.citasUrl}/${idCita}/diagnosticos`,
      dto,
    );
  }

  actualizar(
    idDiagnostico: number,
    dto: DiagnosticoActualizarDTO,
  ): Observable<MensajeResponse<Diagnostico>> {
    return this.http.put<MensajeResponse<Diagnostico>>(
      `${this.diagnosticosUrl}/${idDiagnostico}`,
      dto,
    );
  }

  eliminar(idDiagnostico: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(`${this.diagnosticosUrl}/${idDiagnostico}`);
  }
}
