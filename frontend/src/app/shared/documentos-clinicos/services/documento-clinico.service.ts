import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

import { AtencionClinicaService } from '../../../features/clinica/citas/services/atencion-clinica.service';
import { CitaService } from '../../../features/clinica/citas/services/cita.service';
import { CitaFila } from '../../../features/clinica/citas/interface/cita.interface';
import { DEFINICIONES_DOCUMENTOS, ESTABLECIMIENTO } from '../constants/documento-clinico.constants';
import { generarPdfClinico } from '../generators/documento-clinico.generator';
import {
  ArchivoGenerado,
  ContextoClinico,
  DefinicionDocumento,
  ImagenPdf,
  OpcionesGeneracion,
} from '../interface/documento-clinico.interface';
import {
  construirContexto,
  numeroDocumento,
  sanitizarNombreArchivo,
} from '../utils/documento-clinico.util';
import { cargarImagenPdf } from '../utils/pdf-imagen.util';

@Injectable({
  providedIn: 'root',
})
export class DocumentoClinicoService {
  private readonly citaService = inject(CitaService);
  private readonly atencionService = inject(AtencionClinicaService);

  private logo: Promise<ImagenPdf | null> | null = null;

  cargarContexto(cita: CitaFila): Observable<ContextoClinico> {
    return forkJoin({
      atencion: this.atencionService
        .obtenerAtencion(cita.id)
        .pipe(map((response) => response.object)),
      paciente: this.citaService.obtenerPaciente(cita.idPaciente).pipe(
        map((response) => response.object),
        catchError(() => of(null)),
      ),
      medico: this.citaService.obtenerMedico(cita.idMedico).pipe(
        map((response) => response.object),
        catchError(() => of(null)),
      ),
    }).pipe(
      map(({ atencion, paciente, medico }) => construirContexto(cita, atencion, paciente, medico)),
    );
  }

  async generar(ctx: ContextoClinico, opciones: OpcionesGeneracion): Promise<ArchivoGenerado[]> {
    const definiciones = DEFINICIONES_DOCUMENTOS.filter((definicion) =>
      opciones.tipos.includes(definicion.tipo),
    );

    if (definiciones.length === 0) {
      throw new Error('Selecciona al menos un documento.');
    }

    if (
      opciones.formato === 'ticket' &&
      definiciones.some((definicion) => !definicion.admiteTicket)
    ) {
      throw new Error('Alguno de los documentos seleccionados solo está disponible en A4.');
    }

    const logo = await this.obtenerLogo();
    const sufijo = opciones.formato === 'a4' ? 'A4' : `ticket-${opciones.anchoTicket}mm`;

    if (opciones.consolidado && definiciones.length > 1) {
      const blob = await generarPdfClinico(
        ctx,
        definiciones,
        opciones.formato,
        opciones.anchoTicket,
        logo,
      );

      return [
        this.crearArchivo(
          'consolidado',
          'Documento consolidado',
          `${ctx.numeroAtencion}_documentos_${sufijo}`,
          blob,
        ),
      ];
    }

    return Promise.all(
      definiciones.map(async (definicion: DefinicionDocumento) => {
        const blob = await generarPdfClinico(
          ctx,
          [definicion],
          opciones.formato,
          opciones.anchoTicket,
          logo,
        );

        return this.crearArchivo(
          definicion.tipo,
          definicion.titulo,
          `${numeroDocumento(definicion.prefijo, ctx.cita.id)}_${sufijo}`,
          blob,
        );
      }),
    );
  }

  liberar(archivos: ArchivoGenerado[]): void {
    archivos.forEach((archivo) => URL.revokeObjectURL(archivo.url));
  }

  private obtenerLogo(): Promise<ImagenPdf | null> {
    if (!this.logo) {
      this.logo = cargarImagenPdf(ESTABLECIMIENTO.logoUrl);
    }

    return this.logo;
  }

  private crearArchivo(
    clave: string,
    etiqueta: string,
    nombre: string,
    blob: Blob,
  ): ArchivoGenerado {
    return {
      clave,
      etiqueta,
      nombre: sanitizarNombreArchivo(nombre),
      blob,
      url: URL.createObjectURL(blob),
    };
  }
}
