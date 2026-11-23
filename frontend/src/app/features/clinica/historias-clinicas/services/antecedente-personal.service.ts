import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import {
  AntecedentePersonal,
  AntecedentePersonalGuardar,
} from '../interface/historia-clinica.interface';
import { MensajeResponses } from '../../../../shared/models/mensaje-response.model';

@Injectable({
  providedIn: 'root',
})
export class AntecedentePersonalService {
  private readonly baseUrl = `${environment.apiUrl}/historias-clinicas`;

  constructor(private readonly http: HttpClient) {}

  private url(idHistoria: number): string {
    return `${this.baseUrl}/${idHistoria}/antecedentes-personales`;
  }

  crear(
    idHistoria: number,
    dto: AntecedentePersonalGuardar,
  ): Observable<MensajeResponses<AntecedentePersonal>> {
    return this.http.post<MensajeResponses<AntecedentePersonal>>(this.url(idHistoria), dto);
  }

  actualizar(
    idHistoria: number,
    id: number,
    dto: AntecedentePersonalGuardar,
  ): Observable<MensajeResponses<AntecedentePersonal>> {
    return this.http.put<MensajeResponses<AntecedentePersonal>>(
      `${this.url(idHistoria)}/${id}`,
      dto,
    );
  }

  eliminar(idHistoria: number, id: number): Observable<MensajeResponses<null>> {
    return this.http.delete<MensajeResponses<null>>(`${this.url(idHistoria)}/${id}`);
  }
}
