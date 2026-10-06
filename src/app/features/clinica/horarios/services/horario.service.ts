import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  CargoResumen,
  EmpleadoHorario,
  EmpleadoLista,
  EmpleadoResumen,
  HorarioCreado,
  HorarioCrearDTO,
  HorarioResumen,
  MensajeResponse,
} from '../interface/horario.interface';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private readonly baseUrl = `${environment.apiUrl}/horarios`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<MensajeResponse<HorarioResumen[]>> {
    return this.http.get<MensajeResponse<HorarioResumen[]>>(this.baseUrl);
  }

  obtenerPorEmpleado(idEmpleado: number): Observable<MensajeResponse<EmpleadoHorario>> {
    return this.http.get<MensajeResponse<EmpleadoHorario>>(`${this.baseUrl}/${idEmpleado}`);
  }

  crear(dto: HorarioCrearDTO): Observable<MensajeResponse<HorarioCreado>> {
    return this.http.post<MensajeResponse<HorarioCreado>>(this.baseUrl, dto);
  }

  listarEmpleados(): Observable<MensajeResponse<EmpleadoLista[]>> {
    const params = new HttpParams().set('estado', 'activo');
    return this.http.get<MensajeResponse<EmpleadoLista[]>>(`${environment.apiUrl}/empleados`, {
      params,
    });
  }

  listarEmpleadosResumen(): Observable<MensajeResponse<EmpleadoResumen[]>> {
    return this.http.get<MensajeResponse<EmpleadoResumen[]>>(
      `${environment.apiUrl}/empleados/resumen`,
    );
  }

  listarEmpleadosPorCargo(idCargo: number): Observable<MensajeResponse<EmpleadoResumen[]>> {
    return this.http.get<MensajeResponse<EmpleadoResumen[]>>(
      `${environment.apiUrl}/empleados/resumen/cargos/${idCargo}`,
    );
  }

  listarCargosResumen(): Observable<MensajeResponse<CargoResumen[]>> {
    return this.http.get<MensajeResponse<CargoResumen[]>>(`${environment.apiUrl}/cargos/resumen`);
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
