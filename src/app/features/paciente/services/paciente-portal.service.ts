import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MensajeResponse } from '../../../shared/models/mensaje-response.model';
import { PacienteActual, PacienteCita } from '../models/paciente-portal.model';
import { Atencion } from '../../doctor/models/doctor-portal.model';

@Injectable({ providedIn: 'root' })
export class PacientePortalService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  actual(): Observable<PacienteActual> {
    return this.http
      .get<MensajeResponse<PacienteActual>>(`${this.api}/pacientes/actual`)
      .pipe(map((r) => r.object));
  }

  misCitas(): Observable<PacienteCita[]> {
    return this.http
      .get<MensajeResponse<PacienteCita[]>>(`${this.api}/citas-medicas/paciente/mias`)
      .pipe(map((r) => r.object ?? []));
  }

  miHistoria(): Observable<Atencion[]> {
    return this.http
      .get<MensajeResponse<Atencion[]>>(`${this.api}/atenciones/mias`)
      .pipe(map((r) => r.object ?? []));
  }
}
