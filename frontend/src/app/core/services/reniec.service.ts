import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface ApiResponseDni {
  success: boolean;
  datos?: {
    dni: string;
    nombres: string;
    ape_paterno: string;
    ape_materno: string;
  };
}

export interface DatosPersonaReniec {
  dni: string;
  nombre: string;
  apellidos: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReniecService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://miapi.cloud/v1/dni';
  private readonly token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNTksImV4cCI6MTc2MDM4MzUyMH0.Kv9oJnEtAgtNZrV4-aQ4sfd8C5qvKL4yNG4_w2ekIDo';

  consultarDni(dni: string): Observable<DatosPersonaReniec | null> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<ApiResponseDni>(`${this.apiUrl}/${dni}`, { headers }).pipe(
      map((response) => {
        if (response && response.success && response.datos) {
          const d = response.datos;
          return {
            dni: d.dni,
            nombre: (d.nombres || '').toUpperCase(),
            apellidos: `${d.ape_paterno || ''} ${d.ape_materno || ''}`.trim().toUpperCase(),
          };
        }
        return null;
      }),
    );
  }
}
