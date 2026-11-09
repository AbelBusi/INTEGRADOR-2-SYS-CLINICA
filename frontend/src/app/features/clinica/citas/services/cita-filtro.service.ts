import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MensajeResponse } from '../interface/cita.interface';
import { CitaFiltros, PaginaCitas } from '../interface/cita-filtro.interface';

@Injectable({ providedIn: 'root' })
export class CitaFiltroService {
  private readonly baseUrl = `${environment.apiUrl}/citas-medicas/filtros`;

  constructor(private readonly http: HttpClient) {}

  buscar(
    filtros: CitaFiltros,
    pagina: number,
    tamanio: number,
  ): Observable<MensajeResponse<PaginaCitas>> {
    return this.http.get<MensajeResponse<PaginaCitas>>(this.baseUrl, {
      params: this.construirParams(filtros, pagina, tamanio),
    });
  }

  validar(f: CitaFiltros): string | null {
    if (f.fechaDesde && f.fechaHasta && f.fechaDesde > f.fechaHasta) {
      return 'La fecha "desde" no puede ser posterior a la fecha "hasta".';
    }
    if (f.horaDesde && f.horaHasta && f.horaDesde > f.horaHasta) {
      return 'La hora "desde" no puede ser posterior a la hora "hasta".';
    }
    return null;
  }

  contarActivos(f: CitaFiltros): number {
    return Object.entries(f).filter(([, v]) => this.tieneValor(v)).length;
  }

  private tieneValor(v: unknown): boolean {
    if (v === null || v === undefined || v === false || v === '') return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.trim() !== '';
    return true;
  }

  private construirParams(f: CitaFiltros, pagina: number, tamanio: number): HttpParams {
    let params = new HttpParams().set('page', pagina).set('size', tamanio);

    for (const [clave, valor] of Object.entries(f)) {
      if (!this.tieneValor(valor)) continue;
      if (Array.isArray(valor)) {
        valor.forEach((v) => (params = params.append(clave, String(v))));
      } else {
        params = params.set(clave, typeof valor === 'string' ? valor.trim() : String(valor));
      }
    }
    if (f.registroPresencial === false) {
      params = params.set('registroPresencial', 'false');
    }
    return params;
  }
}
