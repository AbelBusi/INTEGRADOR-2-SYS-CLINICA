import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import {
  AtencionHistoria,
  HistoriaClinica,
  HistoriaClinicaActualizar,
  HistoriaClinicaCrear,
  HistoriaClinicaResumen,
  Pagina,
} from '../interface/historia-clinica.interface';
import { MensajeResponses } from '../../../../shared/models/mensaje-response.model';

const TAMANIO_ATENCIONES = 50;

@Injectable({
  providedIn: 'root',
})
export class HistoriaClinicaService {
  private readonly baseUrl = `${environment.apiUrl}/historias-clinicas`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<MensajeResponses<HistoriaClinicaResumen[]>> {
    return this.http.get<MensajeResponses<HistoriaClinicaResumen[]>>(this.baseUrl);
  }

  obtenerPorPaciente(idPaciente: number): Observable<MensajeResponses<HistoriaClinica>> {
    return this.http.get<MensajeResponses<HistoriaClinica>>(
      `${this.baseUrl}/paciente/${idPaciente}`,
    );
  }

  obtenerMiHistoria(): Observable<MensajeResponses<HistoriaClinica>> {
    return this.http.get<MensajeResponses<HistoriaClinica>>(`${this.baseUrl}/mi-historia`);
  }

  crear(dto: HistoriaClinicaCrear): Observable<MensajeResponses<HistoriaClinica>> {
    return this.http.post<MensajeResponses<HistoriaClinica>>(this.baseUrl, dto);
  }

  actualizar(
    idHistoria: number,
    dto: HistoriaClinicaActualizar,
  ): Observable<MensajeResponses<HistoriaClinica>> {
    return this.http.put<MensajeResponses<HistoriaClinica>>(`${this.baseUrl}/${idHistoria}`, dto);
  }

  atencionesPorPaciente(
    idPaciente: number,
    pagina = 0,
    tamanio = 10,
  ): Observable<MensajeResponses<Pagina<AtencionHistoria>>> {
    const params = new HttpParams().set('pagina', pagina).set('tamanio', tamanio);
    return this.http.get<MensajeResponses<Pagina<AtencionHistoria>>>(
      `${this.baseUrl}/paciente/${idPaciente}/atenciones`,
      { params },
    );
  }

  misAtenciones(pagina = 0, tamanio = 10): Observable<MensajeResponses<Pagina<AtencionHistoria>>> {
    const params = new HttpParams().set('pagina', pagina).set('tamanio', tamanio);
    return this.http.get<MensajeResponses<Pagina<AtencionHistoria>>>(
      `${this.baseUrl}/mi-historia/atenciones`,
      { params },
    );
  }

  obtenerTodasAtenciones(idPaciente: number | null): Observable<AtencionHistoria[]> {
    const pedir = (pagina: number) =>
      idPaciente === null
        ? this.misAtenciones(pagina, TAMANIO_ATENCIONES)
        : this.atencionesPorPaciente(idPaciente, pagina, TAMANIO_ATENCIONES);

    return pedir(0).pipe(
      switchMap((respuesta) => {
        const primera = respuesta.object;
        const contenido = primera?.contenido ?? [];
        const totalPaginas = primera?.totalPaginas ?? 0;

        if (totalPaginas <= 1) {
          return of(contenido);
        }

        const restantes = Array.from({ length: totalPaginas - 1 }, (_, i) =>
          pedir(i + 1).pipe(map((r) => r.object?.contenido ?? [])),
        );

        return forkJoin(restantes).pipe(map((paginas) => [...contenido, ...paginas.flat()]));
      }),
    );
  }
}
