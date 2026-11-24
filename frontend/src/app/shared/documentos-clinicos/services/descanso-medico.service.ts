import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { MensajeResponse } from '../../../features/clinica/citas/interface/cita.interface';
import { ESTABLECIMIENTO } from '../constants/documento-clinico.constants';
import { generarPdfDescansoMedico } from '../generators/descanso-medico.generator';
import {
  DescansoMedico,
  DescansoMedicoContexto,
  DescansoMedicoCrear,
} from '../interface/descanso-medico.interface';
import { ArchivoGenerado, ImagenPdf } from '../interface/documento-clinico.interface';
import { sanitizarNombreArchivo } from '../utils/documento-clinico.util';
import { cargarImagenPdf } from '../utils/pdf-imagen.util';

@Injectable({
  providedIn: 'root',
})
export class DescansoMedicoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/descansos-medicos`;

  private logo: Promise<ImagenPdf | null> | null = null;

  obtenerContexto(idCita: number): Observable<MensajeResponse<DescansoMedicoContexto>> {
    return this.http.get<MensajeResponse<DescansoMedicoContexto>>(`${this.baseUrl}/cita/${idCita}`);
  }

  emitir(idCita: number, dto: DescansoMedicoCrear): Observable<MensajeResponse<DescansoMedico>> {
    return this.http.post<MensajeResponse<DescansoMedico>>(`${this.baseUrl}/cita/${idCita}`, dto);
  }

  async generarPdf(descanso: DescansoMedico): Promise<ArchivoGenerado> {
    const logo = await this.obtenerLogo();
    const blob = await generarPdfDescansoMedico(descanso, logo);

    return {
      clave: descanso.numero,
      etiqueta: 'Descanso médico',
      nombre: sanitizarNombreArchivo(`${descanso.numero}_A4`),
      blob,
      url: URL.createObjectURL(blob),
    };
  }

  liberar(archivo: ArchivoGenerado | null): void {
    if (archivo) {
      URL.revokeObjectURL(archivo.url);
    }
  }

  private obtenerLogo(): Promise<ImagenPdf | null> {
    if (!this.logo) {
      this.logo = cargarImagenPdf(ESTABLECIMIENTO.logoUrl);
    }

    return this.logo;
  }
}
