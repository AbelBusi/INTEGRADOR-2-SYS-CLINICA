import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  EmpleadoDetalle,
  MensajeResponse,
  PacienteDetalle,
  PersonaUsuario,
  RolResumen,
  UsuarioAltaDTO,
  UsuarioCreado,
  UsuarioListado,
} from '../interface/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private readonly http: HttpClient) {}

  listarPacientes(): Observable<MensajeResponse<UsuarioListado[]>> {
    return this.http.get<MensajeResponse<UsuarioListado[]>>(`${this.baseUrl}/pacientes`);
  }

  listarEmpleados(): Observable<MensajeResponse<UsuarioListado[]>> {
    return this.http.get<MensajeResponse<UsuarioListado[]>>(`${this.baseUrl}/empleados`);
  }

  crear(dto: UsuarioAltaDTO): Observable<MensajeResponse<UsuarioCreado>> {
    return this.http.post<MensajeResponse<UsuarioCreado>>(this.baseUrl, dto);
  }

  cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Observable<MensajeResponse<null>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<MensajeResponse<null>>(`${this.baseUrl}/${id}`, null, { params });
  }

  listarPacientesSinUsuario(): Observable<MensajeResponse<PersonaUsuario[]>> {
    return this.http.get<MensajeResponse<PersonaUsuario[]>>(
      `${environment.apiUrl}/pacientes/sin-usuario`,
    );
  }

  listarEmpleadosSinUsuario(): Observable<MensajeResponse<PersonaUsuario[]>> {
    return this.http.get<MensajeResponse<PersonaUsuario[]>>(
      `${environment.apiUrl}/empleados/sin-usuario`,
    );
  }

  listarRoles(): Observable<MensajeResponse<RolResumen[]>> {
    return this.http.get<MensajeResponse<RolResumen[]>>(`${environment.apiUrl}/auth/roles/resumen`);
  }

  obtenerPaciente(id: number): Observable<MensajeResponse<PacienteDetalle>> {
    return this.http.get<MensajeResponse<PacienteDetalle>>(`${environment.apiUrl}/pacientes/${id}`);
  }

  obtenerEmpleado(id: number): Observable<MensajeResponse<EmpleadoDetalle>> {
    return this.http.get<MensajeResponse<EmpleadoDetalle>>(`${environment.apiUrl}/empleados/${id}`);
  }

  obtenerUrlFoto(foto: string | null | undefined): string | null {
    if (!foto) {
      return null;
    }
    if (/^https?:\/\//i.test(foto)) {
      return foto;
    }
    return `${environment.serverUrl}/${foto.replace(/^\/+/, '')}`;
  }
}
