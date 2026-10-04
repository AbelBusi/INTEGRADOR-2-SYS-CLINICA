import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MensajeResponse } from '../../shared/models/mensaje-response.model';
import { PersonaCrearDTO } from '../../features/clinica/pacientes/interface/paciente.interface';

export interface PersonaRef {
  id: number;
}

export interface PersonaSinCuenta {
  id: number;
  dni: string;
  nombre: string;
  apellidos: string;
}

@Injectable({ providedIn: 'root' })
export class PersonaService {
  private readonly http = inject(HttpClient);

  crear(dto: PersonaCrearDTO): Observable<PersonaRef> {
    return this.http
      .post<MensajeResponse<PersonaRef>>(`${environment.apiUrl}/personas`, dto)
      .pipe(map((r) => r.object));
  }

  sinCuenta(): Observable<PersonaSinCuenta[]> {
    return this.http
      .get<MensajeResponse<PersonaSinCuenta[]>>(`${environment.apiUrl}/personas/sin-cuenta`)
      .pipe(map((r) => r.object ?? []));
  }
}
