import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CodigoEnviadoResponse,
  CompletarRegistroRequest,
  DocumentoPaciente,
  ElegibilidadResponse,
  EnviarCodigoRegistroRequest,
  IdentidadPaciente,
  RegistroCompletadoResponse,
} from '../models/registro-paciente.model';

@Injectable({ providedIn: 'root' })
export class RegistroPacienteService {
  private http = inject(HttpClient);

  consultarElegibilidad(dto: DocumentoPaciente): Observable<ElegibilidadResponse> {
    return this.http.post<ElegibilidadResponse>('/auth/registro/elegibilidad', dto);
  }

  verificarIdentidad(dto: IdentidadPaciente): Observable<ElegibilidadResponse> {
    return this.http.post<ElegibilidadResponse>('/auth/registro/verificar-identidad', dto);
  }

  enviarCodigo(dto: EnviarCodigoRegistroRequest): Observable<CodigoEnviadoResponse> {
    return this.http.post<CodigoEnviadoResponse>('/auth/registro/enviar-codigo', dto);
  }

  completar(dto: CompletarRegistroRequest): Observable<RegistroCompletadoResponse> {
    return this.http.post<RegistroCompletadoResponse>('/auth/registro/completar', dto);
  }
}
