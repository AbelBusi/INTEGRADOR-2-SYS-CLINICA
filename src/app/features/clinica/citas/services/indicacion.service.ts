import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../interface/cita.interface';
import {
  Indicacion,
  IndicacionActualizarDTO,
  IndicacionCrearDTO,
} from '../interface/indicacion.interface';

@Injectable({ providedIn: 'root' })
export class IndicacionService {
  private readonly http = inject(HttpClient);
  private readonly diagnosticosUrl = `${environment.apiUrl}/diagnosticos`;

  crear(idDiagnostico: number, dto: IndicacionCrearDTO): Observable<MensajeResponse<Indicacion>> {
    return this.http.post<MensajeResponse<Indicacion>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/indicaciones`,
      dto,
    );
  }

  actualizar(
    idDiagnostico: number,
    idIndicacion: number,
    dto: IndicacionActualizarDTO,
  ): Observable<MensajeResponse<Indicacion>> {
    return this.http.put<MensajeResponse<Indicacion>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/indicaciones/${idIndicacion}`,
      dto,
    );
  }

  eliminar(idDiagnostico: number, idIndicacion: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/indicaciones/${idIndicacion}`,
    );
  }
}
