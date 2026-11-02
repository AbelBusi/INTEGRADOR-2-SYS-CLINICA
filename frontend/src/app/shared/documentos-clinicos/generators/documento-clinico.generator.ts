import {
  AnchoTicket,
  AutoTable,
  ContextoClinico,
  DefinicionDocumento,
  FormatoDocumento,
  ImagenPdf,
} from '../interface/documento-clinico.interface';
import { ESTABLECIMIENTO } from '../constants/documento-clinico.constants';
import { construirContenido } from '../utils/contenido-documento.util';
import { renderizarA4 } from './a4.renderer';
import { dibujarTicket } from './ticket.renderer';

export async function generarPdfClinico(
  ctx: ContextoClinico,
  definiciones: DefinicionDocumento[],
  formato: FormatoDocumento,
  anchoTicket: AnchoTicket,
  logo: ImagenPdf | null,
): Promise<Blob> {
  const [moduloJsPdf, moduloAutoTable] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const JsPdf = moduloJsPdf.jsPDF;
  const autoTable = moduloAutoTable.default as unknown as AutoTable;
  const contenidos = definiciones.map((definicion) => construirContenido(definicion, ctx));

  const titulo =
    contenidos.length === 1
      ? `${contenidos[0].definicion.tituloPdf} ${contenidos[0].numero}`
      : `Documentos clínicos ${ctx.numeroAtencion}`;

  if (formato === 'a4') {
    const doc = new JsPdf({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });

    doc.setProperties({
      title: titulo,
      subject: ctx.numeroAtencion,
      author: ESTABLECIMIENTO.nombre,
    });
    renderizarA4(doc, autoTable, ctx, contenidos, logo);

    return doc.output('blob');
  }

  const alturas = contenidos.map((contenido) => {
    const prueba = new JsPdf({
      unit: 'mm',
      format: [anchoTicket, 3000],
      orientation: 'portrait',
      compress: true,
    });

    return Math.max(Math.ceil(dibujarTicket(prueba, ctx, contenido, anchoTicket, logo) + 3), 100);
  });

  const doc = new JsPdf({
    unit: 'mm',
    format: [anchoTicket, alturas[0]],
    orientation: 'portrait',
    compress: true,
  });

  doc.setProperties({ title: titulo, subject: ctx.numeroAtencion, author: ESTABLECIMIENTO.nombre });

  contenidos.forEach((contenido, indice) => {
    if (indice > 0) {
      doc.addPage([anchoTicket, alturas[indice]]);
    }

    dibujarTicket(doc, ctx, contenido, anchoTicket, logo);
  });

  return doc.output('blob');
}
