import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../interface/cita.interface';
import {
  AtencionClinica,
} from '../interface/atencion-clinica.interface';

@Injectable({
  providedIn: 'root',
})
export class AtencionClinicaService {
  private readonly citasUrl = `${environment.apiUrl}/citas-medicas`;
  private readonly diagnosticosUrl = `${environment.apiUrl}/diagnosticos`;

  constructor(private readonly http: HttpClient) {}

  obtenerAtencion(idCita: number): Observable<MensajeResponse<AtencionClinica>> {
    return this.http.get<MensajeResponse<AtencionClinica>>(
      `${this.citasUrl}/${idCita}/atencion-clinica`,
    );
  }

}
