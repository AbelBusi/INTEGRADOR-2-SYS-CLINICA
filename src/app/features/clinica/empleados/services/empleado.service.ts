import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  CargoResumen,
  Empleado,
  EmpleadoActualizarDTO,
  EmpleadoCrearDTO,
  EmpleadoDetalle,
  EmpleadoRespuesta,
  MensajeResponse,
  TipoDocumentoResumen,
} from '../interface/empleado.interface';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private readonly baseUrl = `${environment.apiUrl}/empleados`;

  constructor(private readonly http: HttpClient) {}

  listar(estado?: 'activo' | 'inactivo'): Observable<MensajeResponse<Empleado[]>> {
    let params = new HttpParams();
    if (estado) {
      params = params.set('estado', estado);
    }
    return this.http.get<MensajeResponse<Empleado[]>>(this.baseUrl, { params });
  }

  obtenerPorId(id: number): Observable<MensajeResponse<EmpleadoDetalle>> {
    return this.http.get<MensajeResponse<EmpleadoDetalle>>(`${this.baseUrl}/${id}`);
  }

  crear(
    dto: EmpleadoCrearDTO,
    imagen?: File | null,
  ): Observable<MensajeResponse<EmpleadoRespuesta>> {
    return this.http.post<MensajeResponse<EmpleadoRespuesta>>(
      this.baseUrl,
      this.construirFormData(dto, imagen),
    );
  }

  actualizar(
    id: number,
    dto: EmpleadoActualizarDTO,
    imagen?: File | null,
  ): Observable<MensajeResponse<EmpleadoRespuesta>> {
    return this.http.put<MensajeResponse<EmpleadoRespuesta>>(
      `${this.baseUrl}/${id}`,
      this.construirFormData(dto, imagen),
    );
  }

  cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Observable<MensajeResponse<null>> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<MensajeResponse<null>>(`${this.baseUrl}/${id}`, null, { params });
  }

  eliminarPorId(id: number): Observable<MensajeResponse<null>> {
    return this.http.delete<MensajeResponse<null>>(`${this.baseUrl}/${id}`);
  }

  listarCargosResumen(): Observable<MensajeResponse<CargoResumen[]>> {
    return this.http.get<MensajeResponse<CargoResumen[]>>(`${environment.apiUrl}/cargos/resumen`);
  }

  listarTiposDocumentoResumen(): Observable<MensajeResponse<TipoDocumentoResumen[]>> {
    return this.http.get<MensajeResponse<TipoDocumentoResumen[]>>(
      `${environment.apiUrl}/tipo-documentos/resumen`,
    );
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

  private construirFormData(dto: object, imagen?: File | null): FormData {
    const formData = new FormData();
    formData.append('empleado', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (imagen) {
      formData.append('imagen', imagen);
    }
    return formData;
  }
}
