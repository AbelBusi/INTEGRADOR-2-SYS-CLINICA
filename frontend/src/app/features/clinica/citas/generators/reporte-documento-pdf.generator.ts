import type { jsPDF } from 'jspdf';
import type { Styles } from 'jspdf-autotable';

import {
  COLORES_PDF,
  ESTABLECIMIENTO,
} from '../../../../shared/documentos-clinicos/constants/documento-clinico.constants';
import {
  AutoTable,
  ImagenPdf,
} from '../../../../shared/documentos-clinicos/interface/documento-clinico.interface';
import { fechaHoraTexto } from '../../../../shared/documentos-clinicos/utils/documento-clinico.util';
import {
  fijarRelleno,
  fijarTexto,
  fijarTrazo,
  lineasDeContacto,
} from '../../../../shared/documentos-clinicos/utils/pdf-dibujo.util';
import {
  DocumentoReporte,
  SeccionBarras,
  SeccionColumnas,
  SeccionMapa,
  SeccionTabla,
} from '../interface/reporte-cita-extra.interface';
import { FilaGrafico } from '../interface/reporte-cita.interface';
import { COLORES_CALOR, nivelCalor } from '../utils/reporte-cita-extra.util';
import { SERIES_ESTADO, hexARgb, maximoRedondeado } from '../utils/reporte-cita.util';

interface EstadoPdf {
  doc: jsPDF;
  autoTable: AutoTable;
  documento: DocumentoReporte;
  logo: ImagenPdf | null;
  emitidoEn: Date;
  y: number;
  paginaCabecera: number;
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

function alPaginar(estado: EstadoPdf) {
  return (datos: { pageNumber: number }): void => {
    if (datos.pageNumber > estado.paginaCabecera) {
      estado.paginaCabecera = datos.pageNumber;
      cabeceraContinuacion(estado);
    }
  };
}

function cabeceraCompleta(estado: EstadoPdf): number {
  const { doc, logo, documento, emitidoEn } = estado;

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
    doc.text(doc.splitTextToSize(contacto.join('  |  '), anchoTexto) as string[], xTexto, y);
  }

  fijarTrazo(doc, COLORES_PDF.borde, 0.3);
  doc.rect(ANCHO_PAGINA - MARGEN - 52, 9, 52, 17);
  fijarTexto(doc, 6.5, 'bold', COLORES_PDF.suave);
  doc.text('FECHA DE EMISIÓN', ANCHO_PAGINA - MARGEN - 26, 14, { align: 'center' });
  fijarTexto(doc, 10, 'bold', COLORES_PDF.gris);
  doc.text(fechaHoraTexto(emitidoEn), ANCHO_PAGINA - MARGEN - 26, 21, { align: 'center' });

  fijarRelleno(doc, COLORES_PDF.gris);
  doc.rect(MARGEN, 29.5, ANCHO_UTIL / 2, 1.2, 'F');
  fijarRelleno(doc, COLORES_PDF.rojo);
  doc.rect(MARGEN + ANCHO_UTIL / 2, 29.5, ANCHO_UTIL / 2, 1.2, 'F');

  fijarTexto(doc, 13, 'bold', COLORES_PDF.gris);
  doc.text(documento.titulo.toUpperCase(), ANCHO_PAGINA / 2, 39, {
    align: 'center',
    maxWidth: ANCHO_UTIL,
  });
  fijarTexto(doc, 8, 'normal', COLORES_PDF.suave);
  doc.text(`Periodo: ${documento.periodo}`, ANCHO_PAGINA / 2, 44, { align: 'center' });

  return 51;
}

function cabeceraContinuacion(estado: EstadoPdf): void {
  const { doc, documento } = estado;

  fijarTexto(doc, 7.5, 'bold', COLORES_PDF.gris);
  doc.text(ESTABLECIMIENTO.nombre, MARGEN, 11);
  fijarTexto(doc, 7.5, 'normal', COLORES_PDF.suave);
  doc.text(`${documento.titulo} | ${documento.periodo}`, ANCHO_PAGINA - MARGEN, 11, {
    align: 'right',
  });

  fijarTrazo(doc, COLORES_PDF.borde, 0.3);
  doc.line(MARGEN, 14, ANCHO_PAGINA - MARGEN, 14);
  fijarRelleno(doc, COLORES_PDF.rojo);
  doc.rect(MARGEN, 13.6, 25, 0.8, 'F');
}

function nuevaPagina(estado: EstadoPdf): void {
  estado.doc.addPage();
  estado.paginaCabecera = estado.doc.getNumberOfPages();
  cabeceraContinuacion(estado);
  estado.y = INICIO_CONTINUACION;
}

function asegurarEspacio(estado: EstadoPdf, alto: number): void {
  if (estado.y + alto > LIMITE_INFERIOR) {
    nuevaPagina(estado);
  }
}

function tituloSeccion(estado: EstadoPdf, texto: string, espacio: number): void {
  asegurarEspacio(estado, espacio);

  fijarRelleno(estado.doc, COLORES_PDF.rojo);
  estado.doc.rect(MARGEN, estado.y - 3.2, 1.2, 4.2, 'F');
  fijarTexto(estado.doc, 9, 'bold', COLORES_PDF.gris);
  estado.doc.text(texto.toUpperCase(), MARGEN + 3, estado.y);

  estado.y += 5;
}

function notaSeccion(estado: EstadoPdf, nota: string | undefined): void {
  if (!nota) {
    return;
  }

  fijarTexto(estado.doc, 7.5, 'italic', COLORES_PDF.suave);
  const lineas = estado.doc.splitTextToSize(nota, ANCHO_UTIL) as string[];

  asegurarEspacio(estado, lineas.length * 3.6 + 2);
  fijarTexto(estado.doc, 7.5, 'italic', COLORES_PDF.suave);
  estado.doc.text(lineas, MARGEN, estado.y + 1);
  estado.y += lineas.length * 3.6 + 2;
}

function bloqueFiltros(estado: EstadoPdf): void {
  if (estado.documento.filtros.length === 0) {
    return;
  }

  fijarTexto(estado.doc, 8.5, 'normal', COLORES_PDF.texto);
  const lineas = estado.doc.splitTextToSize(
    estado.documento.filtros.join('   |   '),
    ANCHO_UTIL,
  ) as string[];
  estado.doc.text(lineas, MARGEN, estado.y);
  estado.y += lineas.length * 4 + 4;
}

function bloqueTarjetas(estado: EstadoPdf): void {
  const { doc } = estado;
  const tarjetas = estado.documento.tarjetas;

  if (tarjetas.length === 0) {
    return;
  }

  const separacion = 2.5;
  const ancho = (ANCHO_UTIL - separacion * (tarjetas.length - 1)) / tarjetas.length;
  const alto = 19;

  asegurarEspacio(estado, alto + 6);

  tarjetas.forEach((tarjeta, indice) => {
    const x = MARGEN + indice * (ancho + separacion);

    fijarTrazo(doc, COLORES_PDF.borde, 0.3);
    doc.rect(x, estado.y, ancho, alto);
    fijarRelleno(doc, hexARgb(tarjeta.color));
    doc.rect(x, estado.y, ancho, 1, 'F');

    fijarTexto(doc, 6.3, 'bold', COLORES_PDF.suave);
    doc.text(tarjeta.texto.toUpperCase(), x + ancho / 2, estado.y + 5.6, {
      align: 'center',
      maxWidth: ancho - 2,
    });
    fijarTexto(doc, 14, 'bold', COLORES_PDF.texto);
    doc.text(String(tarjeta.valor), x + ancho / 2, estado.y + 12.4, { align: 'center' });
    fijarTexto(doc, 6.3, 'normal', COLORES_PDF.suave);
    doc.text(tarjeta.detalle, x + ancho / 2, estado.y + 16.6, {
      align: 'center',
      maxWidth: ancho - 2,
    });
  });

  estado.y += alto + 7;
}

function leyenda(estado: EstadoPdf): void {
  const { doc } = estado;
  let x = MARGEN;

  SERIES_ESTADO.forEach((serie) => {
    fijarRelleno(doc, hexARgb(serie.color));
    doc.rect(x, estado.y - 2.6, 3, 3, 'F');
    fijarTexto(doc, 7.5, 'normal', COLORES_PDF.texto);
    doc.text(serie.texto, x + 4.5, estado.y);
    x += 6 + doc.getTextWidth(serie.texto) + 4;
  });

  estado.y += 5;
}

function graficoBarras(estado: EstadoPdf, filas: FilaGrafico[]): void {
  const { doc } = estado;
  const maximo = Math.max(1, ...filas.map((fila) => fila.total));
  const xBarra = MARGEN + 50;
  const anchoBarra = 100;

  filas.forEach((fila) => {
    asegurarEspacio(estado, 8);

    fijarTexto(doc, 8, 'normal', COLORES_PDF.texto);
    const etiqueta = (doc.splitTextToSize(fila.etiqueta, 48) as string[])[0] ?? '';
    doc.text(etiqueta, MARGEN, estado.y + 3.3);

    fijarRelleno(doc, COLORES_PDF.grisClaro);
    doc.rect(xBarra, estado.y, anchoBarra, 4.4, 'F');

    let x = xBarra;

    fila.segmentos.forEach((segmento) => {
      const ancho = (segmento.valor / maximo) * anchoBarra;

      if (ancho > 0) {
        fijarRelleno(doc, hexARgb(segmento.color));
        doc.rect(x, estado.y, ancho, 4.4, 'F');
        x += ancho;
      }
    });

    fijarTexto(doc, 8, 'bold', COLORES_PDF.texto);
    const total = String(fila.total);
    doc.text(total, xBarra + anchoBarra + 3, estado.y + 3.3);

    if (fila.detalle) {
      fijarTexto(doc, 7.5, 'normal', COLORES_PDF.suave);
      doc.text(fila.detalle, xBarra + anchoBarra + 3 + doc.getTextWidth(total) + 2, estado.y + 3.3);
    }

    estado.y += 6.8;
  });
}

function seccionBarras(estado: EstadoPdf, seccion: SeccionBarras): void {
  if (seccion.filas.length === 0) {
    return;
  }

  tituloSeccion(estado, seccion.titulo, 36);

  if (seccion.leyenda) {
    leyenda(estado);
  }

  graficoBarras(estado, seccion.filas);
  notaSeccion(estado, seccion.nota);
  estado.y += 4;
}

function seccionColumnas(estado: EstadoPdf, seccion: SeccionColumnas): void {
  const { doc } = estado;
  const puntos = seccion.puntos;
  const alto = 42;

  if (puntos.length === 0) {
    return;
  }

  tituloSeccion(estado, seccion.titulo, alto + 24);
  leyenda(estado);

  const x0 = MARGEN + 9;
  const ancho = ANCHO_UTIL - 9;
  const base = estado.y + 4 + alto;
  const maximo = maximoRedondeado(Math.max(0, ...puntos.map((punto) => punto.conteo.total)));

  [0, 0.5, 1].forEach((fraccion) => {
    const y = base - fraccion * alto;
    fijarTrazo(doc, fraccion === 0 ? COLORES_PDF.suave : COLORES_PDF.borde, 0.2);
    doc.line(x0, y, x0 + ancho, y);
    fijarTexto(doc, 6.5, 'normal', COLORES_PDF.suave);
    doc.text(String(Math.round(maximo * fraccion)), x0 - 1.5, y + 1.2, { align: 'right' });
  });

  const anchoColumna = ancho / puntos.length;
  const anchoBarra = Math.min(anchoColumna * 0.62, 12);
  const salto = Math.ceil(puntos.length / 16);

  puntos.forEach((punto, indice) => {
    const xBarra = x0 + indice * anchoColumna + (anchoColumna - anchoBarra) / 2;
    let y = base;

    SERIES_ESTADO.forEach((serie) => {
      const valor = punto.conteo[serie.clave];

      if (valor <= 0) {
        return;
      }

      const altoSegmento = (valor / maximo) * alto;
      y -= altoSegmento;
      fijarRelleno(doc, hexARgb(serie.color));
      doc.rect(xBarra, y, anchoBarra, altoSegmento, 'F');
    });

    if (punto.conteo.total > 0 && anchoBarra >= 4) {
      fijarTexto(doc, 6.5, 'bold', COLORES_PDF.texto);
      doc.text(String(punto.conteo.total), xBarra + anchoBarra / 2, y - 1, { align: 'center' });
    }

    if (indice % salto === 0) {
      fijarTexto(doc, 6.5, 'normal', COLORES_PDF.suave);
      doc.text(punto.etiqueta, xBarra + anchoBarra / 2, base + 4, { align: 'center' });
    }
  });

  estado.y = base + 11;
}

function seccionMapa(estado: EstadoPdf, seccion: SeccionMapa): void {
  const { doc } = estado;
  const { mapa } = seccion;
  const anchoEtiqueta = 24;
  const columnas = Math.max(1, mapa.columnas.length);
  const ancho = Math.min((ANCHO_UTIL - anchoEtiqueta) / columnas, 14);
  const alto = 6.5;

  tituloSeccion(estado, seccion.titulo, alto * (mapa.filas.length + 1) + 22);

  fijarTexto(doc, 6.5, 'bold', COLORES_PDF.suave);
  mapa.columnas.forEach((columna, indice) => {
    doc.text(columna, MARGEN + anchoEtiqueta + indice * ancho + (ancho - 0.4) / 2, estado.y + 3, {
      align: 'center',
    });
  });

  estado.y += 5;

  mapa.filas.forEach((fila, r) => {
    fijarTexto(doc, 8, 'normal', COLORES_PDF.texto);
    doc.text(fila, MARGEN, estado.y + 4.4);

    mapa.columnas.forEach((_, c) => {
      const valor = mapa.valores[r][c];
      const nivel = nivelCalor(valor, mapa.maximo);
      const x = MARGEN + anchoEtiqueta + c * ancho;

      fijarRelleno(doc, hexARgb(COLORES_CALOR[nivel]));
      doc.rect(x, estado.y, ancho - 0.4, alto - 0.4, 'F');

      if (valor > 0) {
        fijarTexto(doc, 7, 'bold', nivel >= 3 ? COLORES_PDF.blanco : COLORES_PDF.texto);
        doc.text(String(valor), x + (ancho - 0.4) / 2, estado.y + 4.2, { align: 'center' });
      }
    });

    estado.y += alto;
  });

  estado.y += 4;

  fijarTexto(doc, 7, 'normal', COLORES_PDF.suave);
  doc.text('Menos', MARGEN, estado.y + 2);

  COLORES_CALOR.forEach((color, indice) => {
    fijarRelleno(doc, hexARgb(color));
    doc.rect(MARGEN + 10 + indice * 6, estado.y - 0.8, 5.4, 3.6, 'F');
  });

  fijarTexto(doc, 7, 'normal', COLORES_PDF.suave);
  doc.text('Más', MARGEN + 10 + COLORES_CALOR.length * 6 + 1, estado.y + 2);

  estado.y += 6;
  notaSeccion(estado, seccion.nota);
  estado.y += 3;
}

function seccionTabla(estado: EstadoPdf, seccion: SeccionTabla): void {
  if (seccion.filas.length === 0) {
    return;
  }

  tituloSeccion(estado, seccion.titulo, 30);

  const suma = seccion.pesos.reduce((total, peso) => total + peso, 0);
  const columnas: Record<number, Partial<Styles>> = {};

  seccion.pesos.forEach((peso, indice) => {
    columnas[indice] = {
      cellWidth: (peso / suma) * ANCHO_UTIL,
      halign: seccion.centradas.includes(indice) ? 'center' : 'left',
    };
  });

  estado.autoTable(estado.doc, {
    startY: estado.y,
    head: [seccion.cabecera],
    body: seccion.filas,
    foot: seccion.pie ? [seccion.pie] : undefined,
    theme: 'grid',
    styles: estiloBase(8),
    headStyles: {
      fillColor: COLORES_PDF.gris,
      textColor: COLORES_PDF.blanco,
      fontStyle: 'bold',
      fontSize: 8,
    },
    footStyles: {
      fillColor: COLORES_PDF.grisClaro,
      textColor: COLORES_PDF.gris,
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: columnas,
    margin: margenTabla(),
    showHead: 'everyPage',
    rowPageBreak: 'avoid',
    willDrawPage: alPaginar(estado),
  });

  estado.y = finalY(estado.doc) + 4;
  notaSeccion(estado, seccion.nota);
  estado.y += 4;
}

function pieDePagina(estado: EstadoPdf): void {
  const { doc, emitidoEn, documento } = estado;
  const total = doc.getNumberOfPages();

  for (let pagina = 1; pagina <= total; pagina++) {
    doc.setPage(pagina);

    fijarTrazo(doc, COLORES_PDF.borde, 0.3);
    doc.line(MARGEN, 285, ANCHO_PAGINA - MARGEN, 285);

    fijarTexto(doc, 7.5, 'bold', COLORES_PDF.gris);
    doc.text(documento.titulo, MARGEN, 289);

    fijarTexto(doc, 7.5, 'normal', COLORES_PDF.suave);
    doc.text(`Página ${pagina} de ${total}`, ANCHO_PAGINA - MARGEN, 289, { align: 'right' });
    doc.text(ESTABLECIMIENTO.nombre, MARGEN, 293);
    doc.text(`Emitido: ${fechaHoraTexto(emitidoEn)}`, ANCHO_PAGINA - MARGEN, 293, {
      align: 'right',
    });
  }
}

export async function generarPdfDocumentoReporte(
  documento: DocumentoReporte,
  logo: ImagenPdf | null,
  emitidoEn: Date,
): Promise<Blob> {
  const [moduloJsPdf, moduloAutoTable] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const doc = new moduloJsPdf.jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true,
  });

  doc.setProperties({
    title: documento.titulo,
    subject: documento.periodo,
    author: ESTABLECIMIENTO.nombre,
  });

  const estado: EstadoPdf = {
    doc,
    autoTable: moduloAutoTable.default as unknown as AutoTable,
    documento,
    logo,
    emitidoEn,
    y: 0,
    paginaCabecera: 1,
  };

  estado.y = cabeceraCompleta(estado);
  bloqueFiltros(estado);
  bloqueTarjetas(estado);

  documento.secciones.forEach((seccion) => {
    switch (seccion.tipo) {
      case 'barras':
        seccionBarras(estado, seccion);
        break;
      case 'columnas':
        seccionColumnas(estado, seccion);
        break;
      case 'mapa':
        seccionMapa(estado, seccion);
        break;
      case 'tabla':
        seccionTabla(estado, seccion);
        break;
    }
  });

  pieDePagina(estado);

  return doc.output('blob');
}
