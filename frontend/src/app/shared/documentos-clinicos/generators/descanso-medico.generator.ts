import type { jsPDF } from 'jspdf';

import { ESTABLECIMIENTO } from '../constants/documento-clinico.constants';
import { DescansoMedico } from '../interface/descanso-medico.interface';
import { ImagenPdf } from '../interface/documento-clinico.interface';
import {
  etiquetaMetodo,
  formatearFecha,
  formatearFechaHora,
  textoDias,
} from '../utils/descanso-medico.util';

const MARGEN = 20;
const ANCHO_PAGINA = 210;
const ALTO_PAGINA = 297;
const ANCHO_CONTENIDO = ANCHO_PAGINA - MARGEN * 2;
const X_VALOR = MARGEN + 52;
const ANCHO_VALOR = ANCHO_CONTENIDO - 52;

const GRIS: [number, number, number] = [88, 89, 91];
const ROJO: [number, number, number] = [217, 24, 42];
const VERDE: [number, number, number] = [13, 107, 104];
const TEXTO: [number, number, number] = [38, 38, 38];

export async function generarPdfDescansoMedico(
  descanso: DescansoMedico,
  logo: ImagenPdf | null,
): Promise<Blob> {
  const { jsPDF: JsPdf } = await import('jspdf');
  const doc = new JsPdf({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  const cancelado = descanso.estado === 'CANCELADO';

  doc.setProperties({
    title: `Descanso médico ${descanso.numero}${cancelado ? ' (cancelado)' : ''}`,
    subject: descanso.numero,
    author: ESTABLECIMIENTO.nombre,
  });

  dibujarMarcaAgua(doc);

  let y = dibujarEncabezado(doc, descanso, logo, cancelado);
  const d = descanso.datos;

  y = seccion(doc, 'Datos del paciente', y);
  y = fila(doc, 'Nombres y apellidos', d.pacienteNombre, y);
  y = fila(doc, 'Documento de identidad', d.pacienteDocumento, y);

  y = seccion(doc, 'Datos del médico', y + 3);
  y = fila(doc, 'Médico', d.medicoNombre, y);
  y = fila(doc, 'Especialidad', d.especialidad, y);
  y = fila(doc, 'N.º de colegiatura', d.numeroColegiatura || 'No registrado', y);

  y = seccion(doc, 'Atención médica', y + 3);
  y = fila(doc, 'Fecha de atención', formatearFecha(d.fechaAtencion), y);

  y = seccion(doc, 'Descanso médico', y + 3);
  y = fila(
    doc,
    'Periodo',
    `Del ${formatearFecha(descanso.fechaInicio)} al ${formatearFecha(descanso.fechaFin)}`,
    y,
  );
  y = fila(doc, 'Cantidad de días', textoDias(descanso.dias), y);

  y = seccion(doc, 'Justificación médica', y + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...TEXTO);

  for (const linea of doc.splitTextToSize(descanso.justificacion, ANCHO_CONTENIDO) as string[]) {
    y = asegurarEspacio(doc, y, 6);
    doc.text(linea, MARGEN, y);
    y += 5;
  }

  // ---- Firma electrónica con sello ----
  y = asegurarEspacio(doc, y + 3, 78);
  y = seccion(doc, 'Firma electrónica interna', y);

  dibujarSello(doc, MARGEN + 14, y + 13, descanso.hashContenido, cancelado);

  const x0 = MARGEN + 34;
  const colegiatura = d.numeroColegiatura ? ` · Col. ${d.numeroColegiatura}` : '';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GRIS);
  doc.text('Firmado electrónicamente por', x0, y + 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...TEXTO);
  doc.text(d.medicoNombre, x0, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`${d.especialidad}${colegiatura}`, x0, y + 13);

  doc.setTextColor(...GRIS);
  doc.setFontSize(8.5);
  doc.text(`Emitido: ${formatearFechaHora(descanso.fechaEmision)}`, x0, y + 18);
  doc.text(
    `Confirmación: ${etiquetaMetodo(descanso.metodoConfirmacion)} · ${formatearFechaHora(descanso.fechaConfirmacion)}`,
    x0,
    y + 22.5,
  );

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text(`ID ${descanso.codigoDocumento}`, x0, y + 27.5);

  y += 33;
  y = filaMono(doc, `Firma (${descanso.algoritmoFirma})`, descanso.firma, y);
  y = filaMono(doc, 'Huella SHA-256', descanso.hashContenido, y);

  // ---- Cancelación ----
  if (cancelado && descanso.cancelacion) {
    y = asegurarEspacio(doc, y + 3, 40);
    y = seccion(doc, 'Cancelación del documento', y);
    y = fila(doc, 'Fecha y hora', formatearFechaHora(descanso.cancelacion.fechaCancelacion), y);
    y = fila(doc, 'Cancelado por', descanso.cancelacion.canceladoPor, y);
    y = fila(doc, 'Motivo', descanso.cancelacion.motivo, y);
  }

  pieDePagina(doc, cancelado);

  return doc.output('blob');
}

/** Sello gráfico: anillo de 64 marcas derivadas de la huella + escudo con check (o X si está cancelado). */
function dibujarSello(doc: jsPDF, cx: number, cy: number, hash: string, cancelado: boolean): void {
  const color = cancelado ? ROJO : VERDE;
  const radio = 13;
  const total = 64;
  const exterior = radio - 1.2;

  doc.setLineCap('round');

  doc.setDrawColor(...GRIS);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, radio, 'S');

  doc.setDrawColor(...color);
  doc.setLineWidth(0.28);

  for (let i = 0; i < total; i++) {
    const nibble = parseInt((hash || '').charAt(i) || '0', 16);
    const valor = Number.isNaN(nibble) ? 0 : nibble;
    const largo = 0.8 + (valor / 15) * 1.6;
    const angulo = (i / total) * 2 * Math.PI - Math.PI / 2;
    const cos = Math.cos(angulo);
    const sen = Math.sin(angulo);

    doc.line(
      cx + (exterior - largo) * cos,
      cy + (exterior - largo) * sen,
      cx + exterior * cos,
      cy + exterior * sen,
    );
  }

  doc.setDrawColor(...ROJO);
  doc.setLineWidth(0.3);
  doc.circle(cx, cy, 8.4, 'S');

  doc.setDrawColor(...color);
  doc.setLineWidth(1);

  if (cancelado) {
    doc.line(cx - 2.8, cy - 4.2, cx + 2.8, cy + 1.4);
    doc.line(cx + 2.8, cy - 4.2, cx - 2.8, cy + 1.4);
  } else {
    doc.line(cx - 3.6, cy - 1, cx - 1.2, cy + 1.6);
    doc.line(cx - 1.2, cy + 1.6, cx + 3.8, cy - 3.8);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4);
  doc.setTextColor(...GRIS);
  doc.text(cancelado ? 'CANCELADO' : 'FIRMADO', cx, cy + 5.6, { align: 'center' });
}

function aplicarOpacidad(doc: jsPDF, opacidad: number): void {
  const Fabrica = (doc as unknown as { GState: new (parametros: { opacity: number }) => object })
    .GState;

  doc.setGState(new Fabrica({ opacity: opacidad }) as Parameters<jsPDF['setGState']>[0]);
}

function dibujarMarcaAgua(doc: jsPDF): void {
  doc.saveGraphicsState();
  aplicarOpacidad(doc, 0.08);
  doc.setTextColor(...GRIS);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(46);
  doc.text('JOSÉ OLAYA BALANDRA', ANCHO_PAGINA / 2, ALTO_PAGINA / 2, { align: 'center', angle: 45 });
  doc.restoreGraphicsState();
}

function dibujarSelloCancelado(doc: jsPDF): void {
  doc.saveGraphicsState();
  aplicarOpacidad(doc, 0.14);
  doc.setTextColor(...ROJO);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(64);
  doc.text('CANCELADO', ANCHO_PAGINA / 2, ALTO_PAGINA / 2 - 20, { align: 'center', angle: 25 });
  doc.restoreGraphicsState();
}

function dibujarEncabezado(
  doc: jsPDF,
  descanso: DescansoMedico,
  logo: ImagenPdf | null,
  cancelado: boolean,
): number {
  const alturaLogo = 16;
  let xTexto = MARGEN;

  // ADAPTAR: si tu interfaz ImagenPdf usa otros nombres de campo, ajusta solo esta línea.
  if (logo) {
    const ancho = (logo.ancho / logo.alto) * alturaLogo;
    doc.addImage(logo.dataUrl, logo.formato, MARGEN, MARGEN - 4, ancho, alturaLogo);
    xTexto = MARGEN + ancho + 5;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...TEXTO);
  const nombre = doc.splitTextToSize(ESTABLECIMIENTO.nombre, ANCHO_PAGINA - MARGEN - xTexto) as string[];
  doc.text(nombre, xTexto, MARGEN + 2);

  let y = MARGEN + 16;

  doc.setFillColor(...GRIS);
  doc.rect(MARGEN, y, ANCHO_CONTENIDO, 0.8, 'F');
  doc.setFillColor(...ROJO);
  doc.rect(MARGEN, y, 35, 0.8, 'F');
  y += 11;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...TEXTO);
  doc.text('DESCANSO MÉDICO', ANCHO_PAGINA / 2, y, { align: 'center' });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...GRIS);
  doc.text(`N.º ${descanso.numero}`, ANCHO_PAGINA / 2, y, { align: 'center' });

  if (cancelado) {
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...ROJO);
    doc.text('DOCUMENTO CANCELADO', ANCHO_PAGINA / 2, y, { align: 'center' });
  }

  return y + 9;
}

function seccion(doc: jsPDF, titulo: string, y: number): number {
  y = asegurarEspacio(doc, y, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(titulo.toUpperCase(), MARGEN, y);
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.2);
  doc.line(MARGEN, y + 1.8, MARGEN + ANCHO_CONTENIDO, y + 1.8);

  return y + 7;
}

function fila(doc: jsPDF, etiqueta: string, valor: string, y: number): number {
  const lineas = doc.splitTextToSize(valor || '—', ANCHO_VALOR) as string[];
  y = asegurarEspacio(doc, y, lineas.length * 5 + 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(etiqueta, MARGEN, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...TEXTO);
  doc.text(lineas, X_VALOR, y);

  return y + lineas.length * 5 + 1;
}

function filaMono(doc: jsPDF, etiqueta: string, valor: string, y: number): number {
  const lineas = valor.match(/.{1,32}/g) ?? [valor];
  y = asegurarEspacio(doc, y, lineas.length * 4 + 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(etiqueta, MARGEN, y);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXTO);
  lineas.forEach((linea, i) => doc.text(linea, X_VALOR, y + i * 4));

  return y + lineas.length * 4 + 2;
}

function asegurarEspacio(doc: jsPDF, y: number, necesario: number): number {
  if (y + necesario <= ALTO_PAGINA - 22) {
    return y;
  }

  doc.addPage();
  dibujarMarcaAgua(doc);

  return MARGEN;
}

function pieDePagina(doc: jsPDF, cancelado: boolean): void {
  const total = doc.getNumberOfPages();

  for (let pagina = 1; pagina <= total; pagina++) {
    doc.setPage(pagina);

    if (cancelado) {
      dibujarSelloCancelado(doc);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRIS);
    doc.text(
      'Documento emitido con firma electrónica interna del establecimiento.',
      ANCHO_PAGINA / 2,
      ALTO_PAGINA - 12,
      { align: 'center' },
    );
    doc.text(`Página ${pagina} de ${total}`, ANCHO_PAGINA / 2, ALTO_PAGINA - 8, { align: 'center' });
  }
}
