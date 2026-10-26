import {
  CsvOptions,
  ExcelOptions,
  ExportFormat,
  PdfOptions,
  PdfPageSize,
} from '../interface/export.interface';


export const EXPORT_ESTABLISHMENT_NAME = 'Establecimiento de Salud';

export const EXPORT_COLORS = {
  red: [217, 24, 42] as [number, number, number],
  gray: [88, 89, 91] as [number, number, number],
  text: [51, 51, 51] as [number, number, number],
  border: [217, 217, 217] as [number, number, number],
  zebra: [246, 246, 246] as [number, number, number],
};

export const DEFAULT_EXPORT_FORMATS: ExportFormat[] = ['pdf', 'excel', 'csv'];

export const EXPORT_FORMAT_META: Record<
  ExportFormat,
  { label: string; extension: string; mime: string; icon: string }
> = {
  pdf: { label: 'PDF', extension: 'pdf', mime: 'application/pdf', icon: 'picture_as_pdf' },
  excel: {
    label: 'Excel',
    extension: 'xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: 'table_view',
  },
  csv: { label: 'CSV', extension: 'csv', mime: 'text/csv;charset=utf-8', icon: 'description' },
};

export const PDF_PAGE_SIZES: Record<PdfPageSize, { label: string; format: [number, number] }> = {
  a3: { label: 'A3', format: [297, 420] },
  a4: { label: 'A4', format: [210, 297] },
  a5: { label: 'A5', format: [148, 210] },
  a2: { label: 'A2', format: [420, 594] },
  letter: { label: 'Carta', format: [215.9, 279.4] },
  oficio: { label: 'Oficio', format: [216, 330] },
};

export const PDF_PAGE_SIZE_OPTIONS: PdfPageSize[] = ['a3', 'a4', 'a5', 'a2', 'letter', 'oficio'];

export const DEFAULT_PDF_OPTIONS: PdfOptions = {
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 10,
  fontSize: 9,
  pageNumbers: true,
  showFilters: true,
};

export const DEFAULT_EXCEL_OPTIONS: ExcelOptions = {
  autoFilter: true,
  freezeHeader: true,
};

export const DEFAULT_CSV_OPTIONS: CsvOptions = {
  delimiter: ';',
};
