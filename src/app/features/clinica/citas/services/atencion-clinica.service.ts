import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../interface/cita.interface';
import {
  AtencionClinica,
  Derivacion,
  DerivacionCrearDTO,
  Diagnostico,
  DiagnosticoCrearDTO,
  ExamenSolicitado,
  ExamenSolicitadoCrearDTO,
  Indicacion,
  IndicacionCrearDTO,
  Tratamiento,
  TratamientoCrearDTO,
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

  crearDiagnostico(
    idCita: number,
    dto: DiagnosticoCrearDTO,
  ): Observable<MensajeResponse<Diagnostico>> {
    return this.http.post<MensajeResponse<Diagnostico>>(
      `${this.citasUrl}/${idCita}/diagnosticos`,
      dto,
    );
  }

  crearTratamiento(
    idDiagnostico: number,
    dto: TratamientoCrearDTO,
  ): Observable<MensajeResponse<Tratamiento>> {
    return this.http.post<MensajeResponse<Tratamiento>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/tratamientos`,
      dto,
    );
  }

  crearIndicacion(
    idDiagnostico: number,
    dto: IndicacionCrearDTO,
  ): Observable<MensajeResponse<Indicacion>> {
    return this.http.post<MensajeResponse<Indicacion>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/indicaciones`,
      dto,
    );
  }

  crearExamenSolicitado(
    idDiagnostico: number,
    dto: ExamenSolicitadoCrearDTO,
  ): Observable<MensajeResponse<ExamenSolicitado>> {
    return this.http.post<MensajeResponse<ExamenSolicitado>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/examenes-solicitados`,
      dto,
    );
  }

  crearDerivacion(
    idDiagnostico: number,
    dto: DerivacionCrearDTO,
  ): Observable<MensajeResponse<Derivacion>> {
    return this.http.post<MensajeResponse<Derivacion>>(
      `${this.diagnosticosUrl}/${idDiagnostico}/derivaciones`,
      dto,
    );
  }
}
