import type { HookData } from 'jspdf-autotable';

import { EXPORT_COLORS, PDF_PAGE_SIZES } from '../constants/export.constants';
import { ExportTable, PdfOptions } from '../interface/export.interface';
import { formatDateTime, formatDisplayValue } from '../utils/export-format.util';

const TOTAL_PAGES_TOKEN = '{total_pages}';
const FOOTER_HEIGHT = 8;
const FILTER_LINE_HEIGHT = 3.6;

export async function generatePdf(table: ExportTable, options: PdfOptions): Promise<Blob> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const doc = new jsPDF({
    orientation: options.orientation,
    unit: 'mm',
    format: PDF_PAGE_SIZES[options.pageSize].format,
    compress: true,
  });

  doc.setProperties({ title: table.title, creator: table.establishment });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = options.margin;
  const contentWidth = pageWidth - margin * 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const filterLines =
    options.showFilters && table.filters.length
      ? (
          doc.splitTextToSize(`Filtros: ${table.filters.join(' | ')}`, contentWidth) as string[]
        ).slice(0, 2)
      : [];

  const lineY =
    margin + (filterLines.length ? 13.5 + filterLines.length * FILTER_LINE_HEIGHT : 12.5);
  const tableStartY = lineY + 4;
  const bottomMargin = margin + (options.pageNumbers ? FOOTER_HEIGHT : 0);

  const totalWeight = table.columns.reduce((sum, column) => sum + column.width, 0) || 1;
  const columnStyles: Record<number, { cellWidth: number; halign: 'left' | 'center' | 'right' }> =
    {};

  table.columns.forEach((column, index) => {
    columnStyles[index] = {
      cellWidth: (contentWidth * column.width) / totalWeight,
      halign: column.align,
    };
  });

  const drawPageFrame = (data: HookData): void => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...EXPORT_COLORS.gray);
    doc.text(table.establishment.toUpperCase(), margin, margin + 3);

    if (table.generatedAt) {
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado: ${formatDateTime(table.generatedAt)}`, pageWidth - margin, margin + 3, {
        align: 'right',
      });
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...EXPORT_COLORS.text);
    const titleLine = (doc.splitTextToSize(table.title, contentWidth) as string[])[0] ?? '';
    doc.text(titleLine, margin, margin + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...EXPORT_COLORS.gray);
    filterLines.forEach((line, index) => {
      doc.text(line, margin, margin + 14.5 + index * FILTER_LINE_HEIGHT);
    });

    doc.setDrawColor(...EXPORT_COLORS.red);
    doc.setLineWidth(0.6);
    doc.line(margin, lineY, pageWidth - margin, lineY);

    if (options.pageNumbers) {
      doc.setFontSize(8);
      doc.text(
        `Página ${data.pageNumber} de ${TOTAL_PAGES_TOKEN}`,
        pageWidth - margin,
        pageHeight - Math.max(margin / 2, 4),
        { align: 'right' },
      );
    }
  };

  autoTable(doc, {
    head: [table.columns.map((column) => column.header)],
    body: table.rows.map((row) =>
      row.map((value, index) => formatDisplayValue(value, table.columns[index].type)),
    ),
    startY: tableStartY,
    margin: { top: tableStartY, right: margin, bottom: bottomMargin, left: margin },
    tableWidth: contentWidth,
    theme: 'grid',
    showHead: 'everyPage',
    styles: {
      font: 'helvetica',
      fontSize: options.fontSize,
      cellPadding: 1.8,
      overflow: 'linebreak',
      valign: 'middle',
      lineColor: EXPORT_COLORS.border,
      lineWidth: 0.1,
      textColor: EXPORT_COLORS.text,
    },
    headStyles: {
      fillColor: EXPORT_COLORS.gray,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: EXPORT_COLORS.zebra },
    columnStyles,
    didDrawPage: drawPageFrame,
  });

  if (options.pageNumbers) {
    doc.putTotalPages(TOTAL_PAGES_TOKEN);
  }

  return doc.output('blob');
}
