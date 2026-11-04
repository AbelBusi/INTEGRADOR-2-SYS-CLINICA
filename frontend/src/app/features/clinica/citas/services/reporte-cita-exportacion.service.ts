import { Injectable } from '@angular/core';

import { ESTABLECIMIENTO } from '../../../../shared/documentos-clinicos/constants/documento-clinico.constants';
import { ImagenPdf } from '../../../../shared/documentos-clinicos/interface/documento-clinico.interface';
import { cargarImagenPdf } from '../../../../shared/documentos-clinicos/utils/pdf-imagen.util';
import { generarCsvDocumentoReporte } from '../generators/reporte-documento-csv.generator';
import { generarPdfDocumentoReporte } from '../generators/reporte-documento-pdf.generator';
import { DocumentoReporte } from '../interface/reporte-cita-extra.interface';
import { FormatoReporte } from '../interface/reporte-cita.interface';
import { descargarBlob } from '../utils/descarga-archivo.util';
import { isoLocal } from '../utils/reporte-cita.util';

@Injectable({
  providedIn: 'root',
})
export class ReporteCitaExportacionService {
  private logo: Promise<ImagenPdf | null> | null = null;

  async exportar(documento: DocumentoReporte, formato: FormatoReporte): Promise<void> {
    const nombre = `${documento.archivo}_${isoLocal(new Date())}`;

    if (formato === 'csv') {
      descargarBlob(generarCsvDocumentoReporte(documento.csv), `${nombre}.csv`);
      return;
    }

    if (!this.logo) {
      this.logo = cargarImagenPdf(ESTABLECIMIENTO.logoUrl);
    }

    const blob = await generarPdfDocumentoReporte(documento, await this.logo, new Date());

    descargarBlob(blob, `${nombre}.pdf`);
  }
}
