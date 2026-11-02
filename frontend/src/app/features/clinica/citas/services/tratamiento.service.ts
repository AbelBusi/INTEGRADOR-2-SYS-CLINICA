import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../interface/cita.interface';
import {
  Tratamiento,
  TratamientoActualizarDTO,
  TratamientoCrearDTO,
} from '../interface/tratamiento.interface';

@Injectable({ providedIn: 'root' })
export class TratamientoService {
  private readonly http = inject(HttpClient);
  private readonly diagnosticosUrl = `${environment.apiUrl}/diagnosticos`;

  crear(idDiagnostico: number, dto: TratamientoCrearDTO): Observable<MensajeResponse<Tratamiento>> {
    return this.http.post<MensajeResponse<Tratamiento>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/tratamientos`,
      dto,
    );
  }

  actualizar(
    idDiagnostico: number,
    idTratamiento: number,
    dto: TratamientoActualizarDTO,
  ): Observable<MensajeResponse<Tratamiento>> {
    return this.http.put<MensajeResponse<Tratamiento>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/tratamientos/${idTratamiento}`,
      dto,
    );
  }

  eliminar(idDiagnostico: number, idTratamiento: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/tratamientos/${idTratamiento}`,
    );
  }
}
