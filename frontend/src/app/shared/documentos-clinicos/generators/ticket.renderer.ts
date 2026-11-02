import type { jsPDF } from 'jspdf';

import {
  COLORES_PDF,
  ColorPdf,
  ESTABLECIMIENTO,
  ETIQUETAS_TICKET,
} from '../constants/documento-clinico.constants';
import {
  ContenidoDocumento,
  ContextoClinico,
  ImagenPdf,
} from '../interface/documento-clinico.interface';
import { construirIdentificacion } from '../utils/contenido-documento.util';
import { fechaHoraTexto } from '../utils/documento-clinico.util';
import { EstiloTexto, fijarTexto, fijarTrazo, lineasDeContacto } from '../utils/pdf-dibujo.util';

export function dibujarTicket(
  doc: jsPDF,
  ctx: ContextoClinico,
  contenido: ContenidoDocumento,
  ancho: number,
  logo: ImagenPdf | null,
): number {
  const margen = 3;
  const util = ancho - margen * 2;
  const centro = ancho / 2;
  const base = ancho === 58 ? 7 : 8;
  const grande = ancho === 58 ? 8.5 : 10;
  let y = 4;

  const alturaLinea = (tamano: number): number => tamano * 0.3528 * 1.32;

  const centrado = (
    texto: string,
    tamano: number,
    estilo: EstiloTexto,
    color: ColorPdf = COLORES_PDF.texto,
  ): void => {
    fijarTexto(doc, tamano, estilo, color);
    (doc.splitTextToSize(texto, util) as string[]).forEach((linea) => {
      y += alturaLinea(tamano);
      doc.text(linea, centro, y, { align: 'center' });
    });
  };

  const izquierda = (
    texto: string,
    tamano: number,
    estilo: EstiloTexto,
    sangria = 0,
    color: ColorPdf = COLORES_PDF.texto,
  ): void => {
    fijarTexto(doc, tamano, estilo, color);
    (doc.splitTextToSize(texto, util - sangria) as string[]).forEach((linea) => {
      y += alturaLinea(tamano);
      doc.text(linea, margen + sangria, y);
    });
  };

  const par = (etiqueta: string, valor: string, sangria = 0): void => {
    const prefijo = `${etiqueta}: `;

    fijarTexto(doc, base, 'bold', COLORES_PDF.texto);
    const anchoPrefijo = doc.getTextWidth(prefijo);

    fijarTexto(doc, base, 'normal', COLORES_PDF.texto);
    const lineas = doc.splitTextToSize(valor, util - sangria - anchoPrefijo) as string[];

    lineas.forEach((linea, indice) => {
      y += alturaLinea(base);

      if (indice === 0) {
        fijarTexto(doc, base, 'bold', COLORES_PDF.texto);
        doc.text(prefijo, margen + sangria, y);
      }

      fijarTexto(doc, base, 'normal', COLORES_PDF.texto);
      doc.text(linea, margen + sangria + anchoPrefijo, y);
    });
  };

  const separador = (punteado: boolean): void => {
    y += 1.2;
    fijarTrazo(doc, COLORES_PDF.gris, 0.2);

    if (punteado) {
      doc.setLineDashPattern([0.6, 0.6], 0);
    }

    doc.line(margen, y, ancho - margen, y);
    doc.setLineDashPattern([], 0);
    y += 1.8;
  };

  if (logo) {
    const altoMaximo = ancho === 58 ? 9 : 12;
    const anchoLogo = Math.min((altoMaximo * logo.ancho) / logo.alto, util * 0.6);
    const altoLogo = (anchoLogo * logo.alto) / logo.ancho;

    doc.addImage(logo.dataUrl, logo.formato, centro - anchoLogo / 2, y, anchoLogo, altoLogo);
    y += altoLogo + 1;
  }

  if (ESTABLECIMIENTO.entidad) {
    centrado(ESTABLECIMIENTO.entidad.toUpperCase(), base - 0.5, 'bold', COLORES_PDF.suave);
  }

  centrado(ESTABLECIMIENTO.nombre, base + 0.5, 'bold', COLORES_PDF.gris);
  lineasDeContacto().forEach((linea) => centrado(linea, base - 1, 'normal', COLORES_PDF.suave));

  separador(true);

  centrado(contenido.definicion.tituloPdf.toUpperCase(), grande, 'bold', COLORES_PDF.gris);
  centrado(`N° ${contenido.numero}`, base, 'normal', COLORES_PDF.suave);

  separador(true);

  const identificacion = construirIdentificacion(ctx);

  [...identificacion.paciente, ...identificacion.atencion]
    .filter((dato) => ETIQUETAS_TICKET.includes(dato.etiqueta))
    .forEach((dato) => par(dato.etiqueta, dato.valor));

  if (identificacion.motivo) {
    par('Motivo', identificacion.motivo);
  }

  separador(false);

  contenido.grupos.forEach((grupo) => {
    if (grupo.encabezado) {
      izquierda(grupo.encabezado, base, 'bold', 0, COLORES_PDF.gris);
      y += 0.8;
    }

    grupo.filas.forEach((fila) => {
      grupo.columnas.forEach((columna, indice) => {
        const valor = (fila[indice] ?? '').trim();

        if (!valor) {
          return;
        }

        if (columna.titulo) {
          izquierda(valor, base, 'bold');
        } else {
          par(columna.cabecera, valor, 1.5);
        }
      });

      y += 1.4;
    });

    separador(true);
  });

  y += 11;

  fijarTrazo(doc, COLORES_PDF.gris, 0.3);
  doc.line(margen + 4, y, ancho - margen - 4, y);
  y += 0.5;

  centrado('Firma y sello del profesional', base - 1, 'normal', COLORES_PDF.suave);
  centrado(ctx.medico.nombreCompleto, base, 'bold');

  if (ctx.medico.especialidad) {
    centrado(ctx.medico.especialidad, base - 0.5, 'normal', COLORES_PDF.suave);
  }

  if (ctx.medico.numeroColegiatura) {
    centrado(
      `Colegiatura: ${ctx.medico.numeroColegiatura}`,
      base - 0.5,
      'normal',
      COLORES_PDF.suave,
    );
  }

  separador(true);

  centrado(`Emitido: ${fechaHoraTexto(ctx.emitidoEn)}`, base - 1, 'normal', COLORES_PDF.suave);
  centrado(`Atención N° ${ctx.numeroAtencion}`, base - 1, 'normal', COLORES_PDF.suave);

  return y + 3;
}
