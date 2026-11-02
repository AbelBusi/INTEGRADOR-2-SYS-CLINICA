import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MensajeResponse } from '../../shared/models/mensaje-response.model';

export interface ResumenItem {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);

  pacientesResumen(): Observable<ResumenItem[]> {
    return this.http
      .get<MensajeResponse<{ idPaciente: number; nombrePaiente: string }[]>>(
        `${environment.apiUrl}/pacientes/resumen`,
      )
      .pipe(
        map((r) =>
          (r.object ?? []).map((p) => ({ id: p.idPaciente, nombre: p.nombrePaiente })),
        ),
      );
  }

  doctoresResumen(): Observable<ResumenItem[]> {
    return this.http
      .get<MensajeResponse<{ idDoctor: number; nombreDoctor: string }[]>>(
        `${environment.apiUrl}/doctores/resumen`,
      )
      .pipe(
        map((r) =>
          (r.object ?? []).map((d) => ({ id: d.idDoctor, nombre: d.nombreDoctor })),
        ),
      );
  }

  especialidadesResumen(): Observable<ResumenItem[]> {
    return this.http
      .get<MensajeResponse<{ idEspecialidad: number; nombreEspecialidad: string }[]>>(
        `${environment.apiUrl}/especialidades/resumen`,
      )
      .pipe(
        map((r) =>
          (r.object ?? []).map((e) => ({ id: e.idEspecialidad, nombre: e.nombreEspecialidad })),
        ),
      );
  }

  recepcionistasResumen(): Observable<ResumenItem[]> {
    return this.http
      .get<MensajeResponse<{ id: number; nombreRecepcionista: string }[]>>(
        `${environment.apiUrl}/recepcionistas/resumen`,
      )
      .pipe(
        map((r) =>
          (r.object ?? []).map((rec) => ({
            id: rec.id,
            nombre: rec.nombreRecepcionista,
          })),
        ),
      );
  }

  cargarCatalogosCita() {
    return forkJoin({
      pacientes: this.pacientesResumen(),
      doctores: this.doctoresResumen(),
      especialidades: this.especialidadesResumen(),
      recepcionistas: this.recepcionistasResumen(),
    });
  }
}
