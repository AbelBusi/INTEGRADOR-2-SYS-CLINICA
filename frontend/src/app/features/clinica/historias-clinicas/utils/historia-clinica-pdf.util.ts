import jsPDF from 'jspdf';
import autoTable, { CellInput, RowInput } from 'jspdf-autotable';

import {
  INSTITUCION_NOMBRE,
  OPCIONES_FACTOR_RH,
  OPCIONES_GRUPO_SANGUINEO,
  OPCIONES_PARENTESCO,
  OPCIONES_TIPO_ALERGIA,
  OPCIONES_TIPO_ANTECEDENTE_FAMILIAR,
  OPCIONES_TIPO_ANTECEDENTE_PERSONAL,
} from '../constants/historia-clinica.constants';
import { AtencionHistoria, HistoriaClinica } from '../interface/historia-clinica.interface';
import {
  calcularEdad,
  etiqueta,
  fechaHoraActual,
  formatearFecha,
  formatearFechaHora,
  formatearHora,
  textoGenero,
  textoTipoDiagnostico,
  textoUrgencia,
} from './historia-clinica.util';

/**
 * Generación del PDF institucional de la historia clínica con jsPDF + autoTable
 * (la misma solución que ya usa el proyecto para los documentos clínicos).
 * Dibuja el documento directamente: no es una captura de la interfaz.
 */

type Color = [number, number, number];

const GRIS: Color = [88, 89, 91];
const ROJO: Color = [217, 24, 42];
const GRIS_CLARO: Color = [245, 245, 245];
const BORDE: Color = [200, 200, 200];
const TEXTO: Color = [40, 40, 40];

const MARGEN = 15;
const ANCHO_UTIL = 180; // A4 210 - 2 * 15
const TOPE_CONTINUACION = 24; // alto reservado para el encabezado reducido de las páginas 2+
const PIE = 18; // alto reservado para el pie
const SIN_DATO = 'No registrado';

export function generarHistoriaClinicaPdf(
  historia: HistoriaClinica,
  atenciones: AtencionHistoria[],
): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const generado = fechaHoraActual();

  let y = dibujarEncabezadoPrincipal(doc, historia, generado);

  y = seccionDatosPaciente(doc, historia, y);
  y = seccionAntecedentesPersonales(doc, historia, y);
  y = seccionAntecedentesFamiliares(doc, historia, y);
  y = seccionAlergias(doc, historia, y);
  seccionAtenciones(doc, atenciones, y);

  dibujarEncabezadosYPies(doc, historia, generado);

  return doc;
}

export function descargarHistoriaClinicaPdf(
  historia: HistoriaClinica,
  atenciones: AtencionHistoria[],
): void {
  const doc = generarHistoriaClinicaPdf(historia, atenciones);
  doc.save(nombreArchivo(historia));
}

function nombreArchivo(historia: HistoriaClinica): string {
  const numero = historia.numeroHistoria.replace(/[^\w-]+/g, '_');
  return `historia-clinica-${numero}.pdf`;
}

/* ------------------------------ Encabezado ------------------------------ */

function lineaBicolor(doc: jsPDF, y: number, alto = 1): void {
  doc.setFillColor(...GRIS);
  doc.rect(MARGEN, y, ANCHO_UTIL / 2, alto, 'F');
  doc.setFillColor(...ROJO);
  doc.rect(MARGEN + ANCHO_UTIL / 2, y, ANCHO_UTIL / 2, alto, 'F');
}

function dibujarEncabezadoPrincipal(doc: jsPDF, historia: HistoriaClinica, generado: string): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...GRIS);
  doc.text(INSTITUCION_NOMBRE.toUpperCase(), MARGEN, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(110, 110, 110);
  doc.text('Documento clínico institucional', MARGEN, 22);

  // Recuadro con número de historia y fecha de emisión (mismo recurso que los demás documentos clínicos).
  const cajaX = MARGEN + ANCHO_UTIL - 52;
  doc.setDrawColor(...BORDE);
  doc.setLineWidth(0.3);
  doc.rect(cajaX, 10, 52, 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...GRIS);
  doc.text(historia.numeroHistoria, cajaX + 26, 17, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(110, 110, 110);
  doc.text(`Emitido: ${generado}`, cajaX + 26, 22, { align: 'center' });

  lineaBicolor(doc, 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...GRIS);
  doc.text('HISTORIA CLÍNICA', 105, 40, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(110, 110, 110);
  doc.text(`Historia clínica N° ${historia.numeroHistoria}`, 105, 45, { align: 'center' });

  return 53;
}

/* ------------------------------ Helpers de maquetación ------------------------------ */

function lastY(doc: jsPDF): number {
  return (doc as any).lastAutoTable.finalY as number;
}

function altoPagina(doc: jsPDF): number {
  return doc.internal.pageSize.getHeight();
}

/** Si no entran `alto` mm en la página actual, salta de página y devuelve el nuevo Y. */
function asegurarEspacio(doc: jsPDF, y: number, alto: number): number {
  if (y + alto > altoPagina(doc) - PIE) {
    doc.addPage();
    return TOPE_CONTINUACION;
  }
  return y;
}

function tituloSeccion(doc: jsPDF, texto: string, y: number): number {
  // Se reserva espacio para título + al menos una fila, así un título nunca queda huérfano.
  const yy = asegurarEspacio(doc, y, 24);
  doc.setFillColor(...ROJO);
  doc.rect(MARGEN, yy - 3.6, 1.6, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...GRIS);
  doc.text(texto.toUpperCase(), MARGEN + 4, yy);
  return yy + 3;
}

function subtitulo(doc: jsPDF, texto: string, y: number): number {
  const yy = asegurarEspacio(doc, y, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...GRIS);
  doc.text(texto, MARGEN, yy);
  return yy + 2;
}

function avisoSinRegistros(doc: jsPDF, texto: string, y: number): number {
  const yy = asegurarEspacio(doc, y, 10);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  doc.text(texto, MARGEN + 1, yy + 4);
  return yy + 10;
}

function opcionesBase(startY: number) {
  return {
    startY,
    theme: 'grid' as const,
    margin: { left: MARGEN, right: MARGEN, top: TOPE_CONTINUACION, bottom: PIE },
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 2,
      lineColor: BORDE,
      lineWidth: 0.2,
      textColor: TEXTO,
      valign: 'middle' as const,
      overflow: 'linebreak' as const,
    },
    headStyles: { fillColor: GRIS, textColor: [255, 255, 255] as Color, fontStyle: 'bold' as const },
    rowPageBreak: 'avoid' as const,
  };
}

function etiquetaCelda(texto: string): CellInput {
  return { content: texto, styles: { fontStyle: 'bold', fillColor: GRIS_CLARO } };
}

function valorOVacio(valor: string | null | undefined): CellInput {
  return valor && valor.trim() ? valor : valorOVacioCelda(valor);
}

/** Celda de objeto (admite colSpan): texto normal si hay dato, "No registrado" en cursiva gris si no. */
function valorOVacioCelda(valor: string | null | undefined): {
  content: string;
  styles?: { fontStyle: 'italic'; textColor: Color };
} {
  return valor && valor.trim()
    ? { content: valor }
    : { content: SIN_DATO, styles: { fontStyle: 'italic', textColor: [140, 140, 140] } };
}

/* ------------------------------ Secciones ------------------------------ */

function seccionDatosPaciente(doc: jsPDF, h: HistoriaClinica, y: number): number {
  const yy = tituloSeccion(doc, 'Datos de identificación del paciente', y);
  const p = h.paciente;
  const edad = calcularEdad(p.fechaNacimiento);
  const nacimiento = formatearFecha(p.fechaNacimiento);

  const body: RowInput[] = [
    [
      etiquetaCelda('Paciente'),
      valorOVacio(p.nombreCompleto),
      etiquetaCelda('Documento'),
      valorOVacio(p.numeroDocumento),
    ],
    [
      etiquetaCelda('Fecha de nacimiento'),
      valorOVacio(nacimiento),
      etiquetaCelda('Edad'),
      valorOVacio(edad),
    ],
    [
      etiquetaCelda('Sexo'),
      valorOVacio(textoGenero(p.genero)),
      etiquetaCelda('N° de historia'),
      valorOVacio(h.numeroHistoria),
    ],
    [
      etiquetaCelda('Grupo sanguíneo'),
      valorOVacio(etiqueta(OPCIONES_GRUPO_SANGUINEO, h.grupoSanguineo)),
      etiquetaCelda('Factor Rh'),
      valorOVacio(etiqueta(OPCIONES_FACTOR_RH, h.factorRh)),
    ],
    [
      etiquetaCelda('Observaciones generales'),
      { ...valorOVacioCelda(h.observaciones), colSpan: 3 },
    ],
  ];

  autoTable(doc, {
    ...opcionesBase(yy),
    body,
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 52 },
      2: { cellWidth: 32 },
      3: { cellWidth: 58 },
    },
  });

  return lastY(doc) + 8;
}

function seccionAntecedentesPersonales(doc: jsPDF, h: HistoriaClinica, y: number): number {
  const yy = tituloSeccion(doc, 'Antecedentes personales', y);

  if (h.antecedentesPersonales.length === 0) {
    return avisoSinRegistros(doc, 'Sin antecedentes personales registrados.', yy) + 2;
  }

  autoTable(doc, {
    ...opcionesBase(yy),
    head: [['Tipo', 'Descripción', 'Año', 'Observación']],
    body: h.antecedentesPersonales.map((a) => [
      etiqueta(OPCIONES_TIPO_ANTECEDENTE_PERSONAL, a.tipo),
      a.descripcion,
      a.anio ? String(a.anio) : '-',
      a.observacion || '-',
    ]),
    columnStyles: { 0: { cellWidth: 38 }, 1: { cellWidth: 70 }, 2: { cellWidth: 16 }, 3: { cellWidth: 56 } },
  });

  return lastY(doc) + 8;
}

function seccionAntecedentesFamiliares(doc: jsPDF, h: HistoriaClinica, y: number): number {
  const yy = tituloSeccion(doc, 'Antecedentes familiares', y);

  if (h.antecedentesFamiliares.length === 0) {
    return avisoSinRegistros(doc, 'Sin antecedentes familiares registrados.', yy) + 2;
  }

  autoTable(doc, {
    ...opcionesBase(yy),
    head: [['Tipo', 'Parentesco', 'Descripción', 'Observación']],
    body: h.antecedentesFamiliares.map((a) => [
      etiqueta(OPCIONES_TIPO_ANTECEDENTE_FAMILIAR, a.tipo),
      etiqueta(OPCIONES_PARENTESCO, a.parentesco, '-'),
      a.descripcion,
      a.observacion || '-',
    ]),
    columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 26 }, 2: { cellWidth: 62 }, 3: { cellWidth: 52 } },
  });

  return lastY(doc) + 8;
}

function seccionAlergias(doc: jsPDF, h: HistoriaClinica, y: number): number {
  const yy = tituloSeccion(doc, 'Alergias', y);

  if (h.alergias.length === 0) {
    return avisoSinRegistros(doc, 'Sin alergias registradas.', yy) + 2;
  }

  autoTable(doc, {
    ...opcionesBase(yy),
    head: [['Sustancia / alérgeno', 'Tipo', 'Reacción', 'Observación']],
    body: h.alergias.map((a) => [
      a.sustancia,
      etiqueta(OPCIONES_TIPO_ALERGIA, a.tipoAlergia),
      a.reaccion || '-',
      a.observacion || '-',
    ]),
    columnStyles: { 0: { cellWidth: 46 }, 1: { cellWidth: 30 }, 2: { cellWidth: 52 }, 3: { cellWidth: 52 } },
  });

  return lastY(doc) + 8;
}

function seccionAtenciones(doc: jsPDF, atenciones: AtencionHistoria[], y: number): number {
  let yy = tituloSeccion(
    doc,
    `Historial de atenciones médicas (${atenciones.length})`,
    y,
  );

  if (atenciones.length === 0) {
    return avisoSinRegistros(doc, 'El paciente no tiene atenciones médicas registradas.', yy);
  }

  for (const atencion of atenciones) {
    yy = bloqueAtencion(doc, atencion, yy);
  }

  return yy;
}

function bloqueAtencion(doc: jsPDF, a: AtencionHistoria, y: number): number {
  // Cabecera de la atención + tabla de datos deben quedar juntas.
  let yy = asegurarEspacio(doc, y + 2, 42);

  const inicio = formatearHora(a.horaInicio);
  const fin = formatearHora(a.horaSalida);
  const horario = inicio && fin ? `${inicio} - ${fin}` : inicio;

  doc.setFillColor(...GRIS_CLARO);
  doc.setDrawColor(...BORDE);
  doc.setLineWidth(0.2);
  doc.rect(MARGEN, yy - 4, ANCHO_UTIL, 6.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(
    `Atención del ${formatearFecha(a.fechaCita)}${horario ? `  ·  ${horario}` : ''}`,
    MARGEN + 2,
    yy,
  );

  autoTable(doc, {
    ...opcionesBase(yy + 2.5),
    body: [
      [etiquetaCelda('Médico tratante'), valorOVacio(a.medico), etiquetaCelda('Especialidad'), valorOVacio(a.especialidad)],
      [
        etiquetaCelda('Motivo de consulta'),
        { content: a.motivo?.trim() || SIN_DATO, colSpan: 3 },
      ],
    ],
    columnStyles: { 0: { cellWidth: 38 }, 1: { cellWidth: 52 }, 2: { cellWidth: 32 }, 3: { cellWidth: 58 } },
  });
  yy = lastY(doc) + 4;

  if (a.diagnosticos.length === 0) {
    return avisoSinRegistros(doc, 'Sin diagnósticos registrados en esta atención.', yy) + 2;
  }

  yy = subtitulo(doc, 'Diagnósticos', yy);
  autoTable(doc, {
    ...opcionesBase(yy),
    head: [['Código', 'Descripción', 'Tipo', 'Fecha', 'Observaciones']],
    body: a.diagnosticos.map((d) => [
      d.codigo,
      d.descripcion,
      textoTipoDiagnostico(d.tipoDiagnostico) || '-',
      formatearFechaHora(d.fechaDiagnostico) || '-',
      d.observaciones || '-',
    ]),
    columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 56 }, 2: { cellWidth: 24 }, 3: { cellWidth: 30 }, 4: { cellWidth: 48 } },
  });
  yy = lastY(doc) + 4;

  const tratamientos = a.diagnosticos.flatMap((d) => d.tratamientos.map((t) => ({ d, t })));
  if (tratamientos.length > 0) {
    yy = subtitulo(doc, 'Tratamiento', yy);
    autoTable(doc, {
      ...opcionesBase(yy),
      styles: { ...opcionesBase(yy).styles, fontSize: 8 },
      head: [['Dx', 'Medicamento', 'Dosis', 'Vía', 'Frecuencia', 'Dur.', 'Cant.', 'Indicación']],
      body: tratamientos.map(({ d, t }) => [
        d.codigo,
        t.nombreMedicamento,
        t.dosis || '-',
        t.viaAdministracion || '-',
        t.frecuencia || '-',
        t.duracionDias ? `${t.duracionDias} d` : '-',
        t.cantidadTotal ? String(t.cantidadTotal) : '-',
        t.indicacion || '-',
      ]),
      columnStyles: { 0: { cellWidth: 18 }, 1: { cellWidth: 34 }, 2: { cellWidth: 20 }, 3: { cellWidth: 20 }, 4: { cellWidth: 24 }, 5: { cellWidth: 14 }, 6: { cellWidth: 12 }, 7: { cellWidth: 38 } },
    });
    yy = lastY(doc) + 4;
  }

  const indicaciones = a.diagnosticos.flatMap((d) => d.indicaciones.map((i) => ({ d, i })));
  if (indicaciones.length > 0) {
    yy = subtitulo(doc, 'Indicaciones médicas', yy);
    autoTable(doc, {
      ...opcionesBase(yy),
      head: [['Dx', 'Tipo', 'Descripción', 'Reposo', 'Frecuencia']],
      body: indicaciones.map(({ d, i }) => [
        d.codigo,
        i.tipoIndicacion,
        i.descripcion || '-',
        i.diasReposo ? `${i.diasReposo} días` : '-',
        i.frecuencia || '-',
      ]),
      columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 32 }, 2: { cellWidth: 70 }, 3: { cellWidth: 24 }, 4: { cellWidth: 32 } },
    });
    yy = lastY(doc) + 4;
  }

  const derivaciones = a.diagnosticos.flatMap((d) => d.derivaciones.map((x) => ({ d, x })));
  if (derivaciones.length > 0) {
    yy = subtitulo(doc, 'Derivaciones', yy);
    autoTable(doc, {
      ...opcionesBase(yy),
      head: [['Dx', 'Código', 'Especialidad', 'Motivo', 'Urgencia', 'Fecha']],
      body: derivaciones.map(({ d, x }) => [
        d.codigo,
        x.codigo,
        x.especialidad,
        x.motivo || '-',
        textoUrgencia(x.urgencia) || '-',
        formatearFechaHora(x.fechaDerivacion) || '-',
      ]),
      columnStyles: { 0: { cellWidth: 18 }, 1: { cellWidth: 24 }, 2: { cellWidth: 34 }, 3: { cellWidth: 50 }, 4: { cellWidth: 20 }, 5: { cellWidth: 34 } },
    });
    yy = lastY(doc) + 4;
  }

  return yy + 4;
}

/* ------------------------------ Encabezado reducido y pie ------------------------------ */

function dibujarEncabezadosYPies(doc: jsPDF, historia: HistoriaClinica, generado: string): void {
  const total = doc.getNumberOfPages();
  const alto = altoPagina(doc);

  for (let pagina = 1; pagina <= total; pagina++) {
    doc.setPage(pagina);

    if (pagina > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...GRIS);
      doc.text(INSTITUCION_NOMBRE.toUpperCase(), MARGEN, 11);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `HISTORIA CLÍNICA N° ${historia.numeroHistoria}`,
        MARGEN + ANCHO_UTIL,
        11,
        { align: 'right' },
      );
      lineaBicolor(doc, 14, 0.8);
    }

    doc.setDrawColor(...BORDE);
    doc.setLineWidth(0.2);
    doc.line(MARGEN, alto - 13, MARGEN + ANCHO_UTIL, alto - 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text(`Generado el ${generado}`, MARGEN, alto - 8);
    doc.text(INSTITUCION_NOMBRE, 105, alto - 8, { align: 'center' });
    doc.text(`Página ${pagina} de ${total}`, MARGEN + ANCHO_UTIL, alto - 8, { align: 'right' });
  }
}
