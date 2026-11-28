import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import {
  Medicamento,
  MedicamentoBusqueda,
  MedicamentoGuardar,
  MedicamentoSimilar,
} from '../interface/medicamento.interface';
import { MensajeResponses } from '../../../../shared/models/mensaje-response.model';

@Injectable({
  providedIn: 'root',
})
export class MedicamentoService {
  private readonly baseUrl = `${environment.apiUrl}/medicamentos`;

  constructor(private readonly http: HttpClient) {}

  listar(estado?: 'activo' | 'inactivo'): Observable<MensajeResponses<Medicamento[]>> {
    let params = new HttpParams();

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<MensajeResponses<Medicamento[]>>(this.baseUrl, { params });
  }

  obtenerPorId(id: number): Observable<MensajeResponses<Medicamento>> {
    return this.http.get<MensajeResponses<Medicamento>>(`${this.baseUrl}/${id}`);
  }

  /** Medicamentos con nombre parecido, para avisar de posibles duplicados mal escritos. */
  similares(
    nombre: string,
    idExcluir?: number,
  ): Observable<MensajeResponses<MedicamentoSimilar[]>> {
    let params = new HttpParams().set('nombre', nombre);

    if (idExcluir !== undefined) {
      params = params.set('idExcluir', idExcluir);
    }

    return this.http.get<MensajeResponses<MedicamentoSimilar[]>>(`${this.baseUrl}/similares`, {
      params,
    });
  }

  /** Buscador del catálogo (solo activos). El backend responde vacío con menos de 3 caracteres. */
  buscar(nombre: string): Observable<MensajeResponses<MedicamentoBusqueda[]>> {
    const params = new HttpParams().set('nombre', nombre);

    return this.http.get<MensajeResponses<MedicamentoBusqueda[]>>(`${this.baseUrl}/buscar`, {
      params,
    });
  }

  crear(dto: MedicamentoGuardar, imagen: File | null): Observable<MensajeResponses<Medicamento>> {
    return this.http.post<MensajeResponses<Medicamento>>(this.baseUrl, this.formData(dto, imagen));
  }

  actualizar(
    id: number,
    dto: MedicamentoGuardar,
    imagen: File | null,
  ): Observable<MensajeResponses<Medicamento>> {
    return this.http.put<MensajeResponses<Medicamento>>(
      `${this.baseUrl}/${id}`,
      this.formData(dto, imagen),
    );
  }

  cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO'): Observable<MensajeResponses<null>> {
    const params = new HttpParams().set('estado', estado);

    return this.http.patch<MensajeResponses<null>>(`${this.baseUrl}/${id}/estado`, null, {
      params,
    });
  }

  eliminarPorId(id: number): Observable<MensajeResponses<null>> {
    return this.http.delete<MensajeResponses<null>>(`${this.baseUrl}/${id}`);
  }

  /** El backend espera multipart: parte JSON "medicamento" + archivo opcional "imagen". */
  private formData(dto: MedicamentoGuardar, imagen: File | null): FormData {
    const form = new FormData();

    form.append('medicamento', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (imagen) {
      form.append('imagen', imagen);
    }

    return form;
  }
}
