import type { jsPDF } from 'jspdf';
import type { RowInput, Styles } from 'jspdf-autotable';

import { COLORES_PDF, ESTABLECIMIENTO } from '../constants/documento-clinico.constants';
import {
  AutoTable,
  ContenidoDocumento,
  ContextoClinico,
  GrupoContenido,
  ImagenPdf,
  ParDato,
} from '../interface/documento-clinico.interface';
import { construirIdentificacion } from '../utils/contenido-documento.util';
import { fechaHoraTexto } from '../utils/documento-clinico.util';
import {
  dibujarMarcaDeAgua,
  fijarRelleno,
  fijarTexto,
  fijarTrazo,
  lineasDeContacto,
} from '../utils/pdf-dibujo.util';

interface DocumentoEnPagina {
  contenido: ContenidoDocumento;
  inicio: number;
}

interface EstadoA4 {
  doc: jsPDF;
  autoTable: AutoTable;
  ctx: ContextoClinico;
  logo: ImagenPdf | null;
  y: number;
  paginaConCabecera: number;
  documentos: DocumentoEnPagina[];
}

const ANCHO_PAGINA = 210;
const ALTO_PAGINA = 297;
const MARGEN = 15;
const ANCHO_UTIL = 180;
const INICIO_CONTINUACION = 24;
const LIMITE_INFERIOR = 279;

function estiloBase(tamano: number): Partial<Styles> {
  return {
    font: 'helvetica',
    fontSize: tamano,
    cellPadding: 1.8,
    lineColor: COLORES_PDF.borde,
    lineWidth: 0.2,
    textColor: COLORES_PDF.texto,
    valign: 'middle',
    overflow: 'linebreak',
  };
}

function margenTabla() {
  return {
    left: MARGEN,
    right: MARGEN,
    top: INICIO_CONTINUACION,
    bottom: ALTO_PAGINA - LIMITE_INFERIOR,
  };
}

function finalY(doc: jsPDF): number {
  return (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
}

function alPaginar(estado: EstadoA4, contenido: ContenidoDocumento) {
  return (datos: { pageNumber: number }): void => {
    if (datos.pageNumber > estado.paginaConCabecera) {
      estado.paginaConCabecera = datos.pageNumber;
      cabeceraContinuacion(estado, contenido);
    }
  };
}

function cabeceraCompleta(estado: EstadoA4, contenido: ContenidoDocumento): number {
  const { doc, logo, ctx } = estado;

  dibujarMarcaDeAgua(doc, logo, ANCHO_PAGINA, ALTO_PAGINA);

  let xTexto = MARGEN;

  if (logo) {
    const alto = 14;
    const ancho = Math.min((alto * logo.ancho) / logo.alto, 40);
    doc.addImage(logo.dataUrl, logo.formato, MARGEN, 9, ancho, (ancho * logo.alto) / logo.ancho);
    xTexto = MARGEN + ancho + 4;
  }

  const anchoTexto = ANCHO_PAGINA - MARGEN - 56 - xTexto;
  let y = 11;

  if (ESTABLECIMIENTO.entidad) {
    fijarTexto(doc, 7.5, 'bold', COLORES_PDF.suave);
    doc.text(ESTABLECIMIENTO.entidad.toUpperCase(), xTexto, y);
    y += 4.5;
  }

  fijarTexto(doc, 11, 'bold', COLORES_PDF.gris);
  const nombre = doc.splitTextToSize(ESTABLECIMIENTO.nombre, anchoTexto) as string[];
  doc.text(nombre, xTexto, y);
  y += nombre.length * 4.6;

  const contacto = lineasDeContacto();

  if (contacto.length > 0) {
    fijarTexto(doc, 7.5, 'normal', COLORES_PDF.suave);
    const lineas = doc.splitTextToSize(contacto.join('  |  '), anchoTexto) as string[];
    doc.text(lineas, xTexto, y);
  }

  fijarTrazo(doc, COLORES_PDF.borde, 0.3);
  doc.rect(ANCHO_PAGINA - MARGEN - 52, 9, 52, 17);
  fijarTexto(doc, 6.5, 'bold', COLORES_PDF.suave);
  doc.text('N° DE DOCUMENTO', ANCHO_PAGINA - MARGEN - 26, 13.5, { align: 'center' });
  fijarTexto(doc, 11, 'bold', COLORES_PDF.gris);
  doc.text(contenido.numero, ANCHO_PAGINA - MARGEN - 26, 19.5, { align: 'center' });
  fijarTexto(doc, 6.5, 'normal', COLORES_PDF.suave);
  doc.text(`Emitido: ${fechaHoraTexto(ctx.emitidoEn)}`, ANCHO_PAGINA - MARGEN - 26, 24, {
    align: 'center',
  });

  fijarRelleno(doc, COLORES_PDF.gris);
  doc.rect(MARGEN, 29.5, ANCHO_UTIL / 2, 1.2, 'F');
  fijarRelleno(doc, COLORES_PDF.rojo);
  doc.rect(MARGEN + ANCHO_UTIL / 2, 29.5, ANCHO_UTIL / 2, 1.2, 'F');

  fijarTexto(doc, 13, 'bold', COLORES_PDF.gris);
  doc.text(contenido.definicion.tituloPdf.toUpperCase(), ANCHO_PAGINA / 2, 39, { align: 'center' });
  fijarTexto(doc, 8, 'normal', COLORES_PDF.suave);
  doc.text(`Atención N° ${ctx.numeroAtencion}`, ANCHO_PAGINA / 2, 44, { align: 'center' });

  return 50;
}

function cabeceraContinuacion(estado: EstadoA4, contenido: ContenidoDocumento): void {
  const { doc, logo } = estado;

  dibujarMarcaDeAgua(doc, logo, ANCHO_PAGINA, ALTO_PAGINA);

  fijarTexto(doc, 7.5, 'bold', COLORES_PDF.gris);
  doc.text(ESTABLECIMIENTO.nombre, MARGEN, 11);
  fijarTexto(doc, 7.5, 'normal', COLORES_PDF.suave);
  doc.text(
    `${contenido.definicion.tituloPdf} | N° ${contenido.numero}`,
    ANCHO_PAGINA - MARGEN,
    11,
    { align: 'right' },
  );

  fijarTrazo(doc, COLORES_PDF.borde, 0.3);
  doc.line(MARGEN, 14, ANCHO_PAGINA - MARGEN, 14);
  fijarRelleno(doc, COLORES_PDF.rojo);
  doc.rect(MARGEN, 13.6, 25, 0.8, 'F');
}

function nuevaPagina(estado: EstadoA4, contenido: ContenidoDocumento): void {
  estado.doc.addPage();
  estado.paginaConCabecera = estado.doc.getNumberOfPages();
  cabeceraContinuacion(estado, contenido);
  estado.y = INICIO_CONTINUACION;
}

function asegurarEspacio(estado: EstadoA4, contenido: ContenidoDocumento, alto: number): void {
  if (estado.y + alto > LIMITE_INFERIOR) {
    nuevaPagina(estado, contenido);
  }
}

function tituloSeccion(estado: EstadoA4, contenido: ContenidoDocumento, texto: string): void {
  asegurarEspacio(estado, contenido, 24);

  const { doc } = estado;

  fijarRelleno(doc, COLORES_PDF.rojo);
  doc.rect(MARGEN, estado.y - 3.2, 1.2, 4.2, 'F');
  fijarTexto(doc, 9, 'bold', COLORES_PDF.gris);
  doc.text(texto.toUpperCase(), MARGEN + 3, estado.y);

  estado.y += 3;
}

function filasDePares(pares: ParDato[]): RowInput[] {
  const filas: RowInput[] = [];

  for (let i = 0; i < pares.length; i += 2) {
    const a = pares[i];
    const b = pares[i + 1];

    if (b) {
      filas.push([a.etiqueta, a.valor, b.etiqueta, b.valor]);
    } else {
      filas.push([a.etiqueta, { content: a.valor, colSpan: 3 }]);
    }
  }

  return filas;
}

function tablaIdentificacion(
  estado: EstadoA4,
  contenido: ContenidoDocumento,
  filas: RowInput[],
): void {
  const etiqueta: Partial<Styles> = {
    fontStyle: 'bold',
    fillColor: COLORES_PDF.grisClaro,
    textColor: COLORES_PDF.gris,
  };

  estado.autoTable(estado.doc, {
    startY: estado.y,
    body: filas,
    theme: 'grid',
    styles: estiloBase(8.5),
    columnStyles: {
      0: { cellWidth: 32, ...etiqueta },
      1: { cellWidth: 58 },
      2: { cellWidth: 32, ...etiqueta },
      3: { cellWidth: 58 },
    },
    margin: margenTabla(),
    willDrawPage: alPaginar(estado, contenido),
  });

  estado.y = finalY(estado.doc) + 5;
}

function bloqueIdentificacion(estado: EstadoA4, contenido: ContenidoDocumento): void {
  const identificacion = construirIdentificacion(estado.ctx);

  tituloSeccion(estado, contenido, 'Datos del paciente');
  tablaIdentificacion(estado, contenido, filasDePares(identificacion.paciente));

  const filasAtencion = filasDePares(identificacion.atencion);

  if (identificacion.motivo) {
    filasAtencion.push(['Motivo de consulta', { content: identificacion.motivo, colSpan: 3 }]);
  }

  tituloSeccion(estado, contenido, 'Datos de la atención');
  tablaIdentificacion(estado, contenido, filasAtencion);
}

function encabezadoGrupo(estado: EstadoA4, contenido: ContenidoDocumento, texto: string): void {
  const { doc } = estado;

  fijarTexto(doc, 8.5, 'bold', COLORES_PDF.gris);
  const lineas = doc.splitTextToSize(texto, ANCHO_UTIL - 7) as string[];
  const alto = lineas.length * 4 + 3;

  asegurarEspacio(estado, contenido, alto + 16);

  fijarRelleno(doc, COLORES_PDF.grisClaro);
  doc.rect(MARGEN, estado.y, ANCHO_UTIL, alto, 'F');
  fijarRelleno(doc, COLORES_PDF.rojo);
  doc.rect(MARGEN, estado.y, 1.2, alto, 'F');

  fijarTexto(doc, 8.5, 'bold', COLORES_PDF.gris);
  doc.text(lineas, MARGEN + 4, estado.y + 4.2);

  estado.y += alto + 1.5;
}

function renderizarGrupo(
  estado: EstadoA4,
  contenido: ContenidoDocumento,
  grupo: GrupoContenido,
): void {
  if (grupo.encabezado) {
    encabezadoGrupo(estado, contenido, grupo.encabezado);
  } else {
    asegurarEspacio(estado, contenido, 20);
  }

  const suma = grupo.columnas.reduce((total, columna) => total + columna.peso, 0);
  const estilos: Record<number, Partial<Styles>> = {};

  grupo.columnas.forEach((columna, indice) => {
    estilos[indice] = { cellWidth: (columna.peso / suma) * ANCHO_UTIL };
  });

  estado.autoTable(estado.doc, {
    startY: estado.y,
    head: [grupo.columnas.map((columna) => columna.cabecera)],
    body: grupo.filas,
    theme: 'grid',
    styles: estiloBase(8),
    headStyles: {
      fillColor: COLORES_PDF.gris,
      textColor: COLORES_PDF.blanco,
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: estilos,
    margin: margenTabla(),
    showHead: 'everyPage',
    rowPageBreak: 'avoid',
    willDrawPage: alPaginar(estado, contenido),
  });

  estado.y = finalY(estado.doc) + 5;
}

function bloqueNota(estado: EstadoA4, contenido: ContenidoDocumento, nota: string): void {
  const { doc } = estado;

  fijarTexto(doc, 8, 'italic', COLORES_PDF.suave);
  const lineas = doc.splitTextToSize(nota, ANCHO_UTIL) as string[];

  asegurarEspacio(estado, contenido, lineas.length * 3.6 + 4);

  fijarTexto(doc, 8, 'italic', COLORES_PDF.suave);
  doc.text(lineas, MARGEN, estado.y);

  estado.y += lineas.length * 3.6 + 4;
}

function bloqueFirma(estado: EstadoA4, contenido: ContenidoDocumento): void {
  asegurarEspacio(estado, contenido, 46);

  const { doc, ctx } = estado;
  const y0 = estado.y + 6;
  const medico = ctx.medico;

  fijarTrazo(doc, COLORES_PDF.borde, 0.3);
  doc.setLineDashPattern([1.2, 1.2], 0);
  doc.rect(MARGEN, y0, 52, 30);
  doc.setLineDashPattern([], 0);
  fijarTexto(doc, 7, 'normal', COLORES_PDF.suave);
  doc.text('Sello', MARGEN + 26, y0 + 27, { align: 'center' });

  const centro = 155;

  fijarTrazo(doc, COLORES_PDF.gris, 0.3);
  doc.line(115, y0 + 17, ANCHO_PAGINA - MARGEN, y0 + 17);

  fijarTexto(doc, 8.5, 'bold', COLORES_PDF.texto);
  doc.text(medico.nombreCompleto, centro, y0 + 21.5, { align: 'center', maxWidth: 80 });

  let y = y0 + 25.5;

  fijarTexto(doc, 7.5, 'normal', COLORES_PDF.suave);

  if (medico.especialidad) {
    doc.text(medico.especialidad, centro, y, { align: 'center', maxWidth: 80 });
    y += 3.6;
  }

  if (medico.numeroColegiatura) {
    doc.text(`Colegiatura: ${medico.numeroColegiatura}`, centro, y, { align: 'center' });
    y += 3.6;
  }

  doc.text('Firma y sello del profesional', centro, y + 0.5, { align: 'center' });

  estado.y = y0 + 38;
}

function pieDePagina(estado: EstadoA4): void {
  const { doc, ctx, documentos } = estado;
  const total = doc.getNumberOfPages();

  for (let pagina = 1; pagina <= total; pagina++) {
    doc.setPage(pagina);

    const actual = [...documentos].reverse().find((item) => item.inicio <= pagina) ?? documentos[0];

    fijarTrazo(doc, COLORES_PDF.borde, 0.3);
    doc.line(MARGEN, 285, ANCHO_PAGINA - MARGEN, 285);

    fijarTexto(doc, 7.5, 'bold', COLORES_PDF.gris);
    doc.text(
      `${actual.contenido.definicion.tituloPdf} | N° ${actual.contenido.numero}`,
      MARGEN,
      289,
    );

    fijarTexto(doc, 7.5, 'normal', COLORES_PDF.suave);
    doc.text(`Página ${pagina} de ${total}`, ANCHO_PAGINA - MARGEN, 289, { align: 'right' });

    const paciente = (
      doc.splitTextToSize(`Paciente: ${ctx.paciente.nombreCompleto}`, 120) as string[]
    )[0];
    doc.text(paciente, MARGEN, 293);
    doc.text(`Emitido: ${fechaHoraTexto(ctx.emitidoEn)}`, ANCHO_PAGINA - MARGEN, 293, {
      align: 'right',
    });
  }
}

export function renderizarA4(
  doc: jsPDF,
  autoTable: AutoTable,
  ctx: ContextoClinico,
  contenidos: ContenidoDocumento[],
  logo: ImagenPdf | null,
): void {
  const estado: EstadoA4 = {
    doc,
    autoTable,
    ctx,
    logo,
    y: 0,
    paginaConCabecera: 1,
    documentos: [],
  };

  contenidos.forEach((contenido, indice) => {
    if (indice > 0) {
      doc.addPage();
    }

    estado.paginaConCabecera = doc.getNumberOfPages();
    estado.documentos.push({ contenido, inicio: estado.paginaConCabecera });
    estado.y = cabeceraCompleta(estado, contenido);

    bloqueIdentificacion(estado, contenido);
    contenido.grupos.forEach((grupo) => renderizarGrupo(estado, contenido, grupo));

    if (contenido.nota) {
      bloqueNota(estado, contenido, contenido.nota);
    }

    bloqueFirma(estado, contenido);
  });

  pieDePagina(estado);
}
