import type { jsPDF } from 'jspdf';

import { ColorPdf, ESTABLECIMIENTO } from '../constants/documento-clinico.constants';
import { ImagenPdf } from '../interface/documento-clinico.interface';

export type EstiloTexto = 'normal' | 'bold' | 'italic';

interface DocumentoConOpacidad {
  GState: new (parametros: { opacity: number }) => unknown;
  setGState: (estado: unknown) => unknown;
}

export function fijarTexto(doc: jsPDF, tamano: number, estilo: EstiloTexto, color: ColorPdf): void {
  doc.setFont('helvetica', estilo);
  doc.setFontSize(tamano);
  doc.setTextColor(color[0], color[1], color[2]);
}

export function fijarTrazo(doc: jsPDF, color: ColorPdf, grosor: number): void {
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(grosor);
}

export function fijarRelleno(doc: jsPDF, color: ColorPdf): void {
  doc.setFillColor(color[0], color[1], color[2]);
}

export function aplicarOpacidad(doc: jsPDF, opacidad: number): void {
  const documento = doc as unknown as DocumentoConOpacidad;
  documento.setGState(new documento.GState({ opacity: opacidad }));
}

export function dibujarMarcaDeAgua(
  doc: jsPDF,
  logo: ImagenPdf | null,
  anchoPagina: number,
  altoPagina: number,
): void {
  if (!ESTABLECIMIENTO.marcaDeAgua || !logo) {
    return;
  }

  const ancho = 110;
  const alto = (ancho * logo.alto) / logo.ancho;

  aplicarOpacidad(doc, 0.05);
  doc.addImage(
    logo.dataUrl,
    logo.formato,
    (anchoPagina - ancho) / 2,
    (altoPagina - alto) / 2,
    ancho,
    alto,
  );
  aplicarOpacidad(doc, 1);
}

export function lineasDeContacto(): string[] {
  return [
    ESTABLECIMIENTO.direccion,
    ESTABLECIMIENTO.telefono ? `Tel. ${ESTABLECIMIENTO.telefono}` : '',
    ESTABLECIMIENTO.correo,
    ESTABLECIMIENTO.ruc ? `RUC ${ESTABLECIMIENTO.ruc}` : '',
    ESTABLECIMIENTO.codigoIpress ? `IPRESS ${ESTABLECIMIENTO.codigoIpress}` : '',
  ].filter((linea) => linea.trim() !== '');
}
