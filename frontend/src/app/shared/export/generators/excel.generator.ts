import { EXPORT_FORMAT_META } from '../constants/export.constants';
import { ExcelOptions, ExportTable } from '../interface/export.interface';
import { cleanText, formatDateTime, formatDisplayValue, toDate } from '../utils/export-format.util';

const GRAY_ARGB = 'FF58595B';
const BORDER_ARGB = 'FFD9D9D9';
const MIN_WIDTH = 10;
const MAX_WIDTH = 50;
const WIDTH_SAMPLE_ROWS = 500;

function sanitizeSheetName(name: string): string {
  return (
    name
      .replace(/[\\/?*[\]:]/g, '')
      .trim()
      .slice(0, 31) || 'Reporte'
  );
}

function toExcelDate(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );
}

export async function generateExcel(
  table: ExportTable,
  options: ExcelOptions,
  sheetName: string,
): Promise<Blob> {
  const module = await import('exceljs');
  const ExcelJS = ((module as { default?: typeof import('exceljs') }).default ??
    module) as typeof import('exceljs');

  const workbook = new ExcelJS.Workbook();
  workbook.creator = table.establishment;
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(sanitizeSheetName(sheetName));
  const columnCount = table.columns.length;

  sheet.addRow([cleanText(table.establishment)]).font = {
    bold: true,
    size: 10,
    color: { argb: GRAY_ARGB },
  };
  sheet.addRow([cleanText(table.title)]).font = { bold: true, size: 14 };

  if (table.generatedAt) {
    sheet.addRow([`Fecha de generación: ${formatDateTime(table.generatedAt)}`]).font = {
      size: 9,
      color: { argb: GRAY_ARGB },
    };
  }

  if (table.filters.length) {
    sheet.addRow([cleanText(`Filtros: ${table.filters.join(' | ')}`)]).font = {
      size: 9,
      color: { argb: GRAY_ARGB },
    };
  }

  sheet.addRow([]);

  const headerRow = sheet.addRow(table.columns.map((column) => cleanText(column.header)));
  const headerRowNumber = headerRow.number;
  headerRow.height = 22;

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAY_ARGB } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: BORDER_ARGB } },
      left: { style: 'thin', color: { argb: BORDER_ARGB } },
      bottom: { style: 'thin', color: { argb: BORDER_ARGB } },
      right: { style: 'thin', color: { argb: BORDER_ARGB } },
    };
  });

  const maxLengths = table.columns.map((column) => column.header.length);

  table.rows.forEach((values, rowIndex) => {
    const row = sheet.addRow([]);

    values.forEach((value, index) => {
      const column = table.columns[index];
      const cell = row.getCell(index + 1);

      if (value === null || value === undefined || value === '') {
      } else if (column.type === 'date' || column.type === 'datetime') {
        const date = toDate(value);
        if (date) {
          cell.value = toExcelDate(date);
          cell.numFmt = column.type === 'date' ? 'dd/mm/yyyy' : 'dd/mm/yyyy hh:mm';
        } else {
          cell.value = cleanText(String(value));
        }
      } else if (column.type === 'number' && typeof value === 'number' && isFinite(value)) {
        cell.value = value;
        if (column.numberFormat) {
          cell.numFmt = column.numberFormat;
        }
      } else if (typeof value === 'boolean') {
        cell.value = value ? 'Sí' : 'No';
      } else {
        cell.value = cleanText(String(value));
      }

      cell.alignment = { vertical: 'middle', horizontal: column.align, wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_ARGB } },
        left: { style: 'thin', color: { argb: BORDER_ARGB } },
        bottom: { style: 'thin', color: { argb: BORDER_ARGB } },
        right: { style: 'thin', color: { argb: BORDER_ARGB } },
      };

      if (rowIndex < WIDTH_SAMPLE_ROWS) {
        maxLengths[index] = Math.max(
          maxLengths[index],
          formatDisplayValue(value, column.type).length,
        );
      }
    });
  });

  table.columns.forEach((column, index) => {
    const proportional = Math.round(maxLengths[index] * 1.1) + 2;
    sheet.getColumn(index + 1).width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, proportional));
  });

  if (options.autoFilter) {
    sheet.autoFilter = {
      from: { row: headerRowNumber, column: 1 },
      to: { row: headerRowNumber, column: columnCount },
    };
  }

  if (options.freezeHeader) {
    sheet.views = [{ state: 'frozen', ySplit: headerRowNumber }];
  }

  sheet.pageSetup = {
    orientation: 'landscape',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    printTitlesRow: `${headerRowNumber}:${headerRowNumber}`,
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: EXPORT_FORMAT_META.excel.mime });
}
