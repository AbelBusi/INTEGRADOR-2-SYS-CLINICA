import { jsPDF, GState } from 'jspdf';
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
const TEXTO: [number, number, number] = [38, 38, 38];

export function generarPdfDescansoMedico(descanso: DescansoMedico, logo: ImagenPdf | null): Blob {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  });
  doc.setProperties({
    title: `Descanso médico ${descanso.numero}`,
    subject: descanso.numero,
    author: ESTABLECIMIENTO.nombre,
  });

  dibujarMarcaAgua(doc);

  let y = dibujarEncabezado(doc, descanso, logo);
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

  y = asegurarEspacio(doc, y + 3, 70);
  y = seccion(doc, 'Emisión y firma electrónica interna', y);
  y = fila(doc, 'Fecha y hora de emisión', formatearFechaHora(descanso.fechaEmision), y);
  y = fila(doc, 'Emitido por', emisor(descanso), y);
  y = fila(doc, 'Identificador', descanso.codigoDocumento, y);
  y = fila(
    doc,
    'Confirmación electrónica',
    `${etiquetaMetodo(descanso.metodoConfirmacion)} · ${formatearFechaHora(descanso.fechaConfirmacion)}`,
    y,
  );
  y = filaMono(doc, `Firma (${descanso.algoritmoFirma})`, descanso.firma, y);
  y = filaMono(doc, 'Huella SHA-256', descanso.hashContenido, y);

  pieDePagina(doc);

  return doc.output('blob');
}

function emisor(d: DescansoMedico): string {
  const colegiatura = d.datos.numeroColegiatura ? ` · CMP/Col. ${d.datos.numeroColegiatura}` : '';
  return `${d.datos.medicoNombre}${colegiatura}`;
}

function dibujarMarcaAgua(doc: jsPDF): void {
  doc.saveGraphicsState();
  doc.setGState(new GState({ opacity: 0.08 }));
  doc.setTextColor(...GRIS);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(46);
  doc.text('JOSÉ OLAYA BALANDRA', ANCHO_PAGINA / 2, ALTO_PAGINA / 2, {
    align: 'center',
    angle: 45,
  });
  doc.restoreGraphicsState();
}

function dibujarEncabezado(doc: jsPDF, descanso: DescansoMedico, logo: ImagenPdf | null): number {
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
  const nombre = doc.splitTextToSize(
    ESTABLECIMIENTO.nombre,
    ANCHO_PAGINA - MARGEN - xTexto,
  ) as string[];
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

/** Para firma y huella: texto hexadecimal en tipografía monoespaciada, partido en líneas fijas. */
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

function pieDePagina(doc: jsPDF): void {
  const total = doc.getNumberOfPages();

  for (let pagina = 1; pagina <= total; pagina++) {
    doc.setPage(pagina);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRIS);
    doc.text(
      'Documento emitido con firma electrónica interna del establecimiento. No constituye firma digital certificada.',
      ANCHO_PAGINA / 2,
      ALTO_PAGINA - 12,
      { align: 'center' },
    );
    doc.text(`Página ${pagina} de ${total}`, ANCHO_PAGINA / 2, ALTO_PAGINA - 8, {
      align: 'center',
    });
  }
}
