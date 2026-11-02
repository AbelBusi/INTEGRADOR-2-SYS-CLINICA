import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import {
  Derivacion,
  DerivacionActualizarDTO,
  DerivacionCrearDTO,
} from '../interface/atencion-clinica.interface';
import { Cita, CitaDTO, MensajeResponse } from '../interface/cita.interface';
import { DerivacionCita } from '../interface/derivacion.interface';

@Injectable({ providedIn: 'root' })
export class DerivacionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/derivaciones`;
  private readonly diagnosticosUrl = `${environment.apiUrl}/diagnosticos`;

  crear(idDiagnostico: number, dto: DerivacionCrearDTO): Observable<MensajeResponse<Derivacion>> {
    return this.http.post<MensajeResponse<Derivacion>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/derivaciones`,
      dto,
    );
  }

  actualizar(
    idDiagnostico: number,
    idDerivacion: number,
    dto: DerivacionActualizarDTO,
  ): Observable<MensajeResponse<Derivacion>> {
    return this.http.put<MensajeResponse<Derivacion>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/derivaciones/${idDerivacion}`,
      dto,
    );
  }

  eliminar(idDiagnostico: number, idDerivacion: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/derivaciones/${idDerivacion}`,
    );
  }

  buscarPorCodigo(codigo: string): Observable<MensajeResponse<DerivacionCita>> {
    return this.http.get<MensajeResponse<DerivacionCita>>(
      `${this.url}/codigo/${encodeURIComponent(codigo.trim())}`,
    );
  }

  programarCita(idDerivacion: number, dto: CitaDTO): Observable<MensajeResponse<Cita>> {
    return this.http.post<MensajeResponse<Cita>>(`${this.url}/${idDerivacion}/programar-cita`, dto);
  }
}
