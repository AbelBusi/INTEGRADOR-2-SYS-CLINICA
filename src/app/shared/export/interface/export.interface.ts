import { Observable } from 'rxjs';

export type ExportFormat = 'pdf' | 'excel' | 'csv';
export type ExportScope = 'page' | 'filtered';
export type ExportValue = string | number | boolean | Date | null | undefined;
export type ExportColumnType = 'text' | 'number' | 'date' | 'datetime';
export type ExportAlign = 'left' | 'center' | 'right';

export type PdfPageSize = 'a2' | 'a3' | 'a4' | 'a5' | 'letter' | 'oficio';
export type PdfOrientation = 'portrait' | 'landscape';

export interface ExportColumn<T> {
  key: string;
  header: string;
  value: (row: T) => ExportValue;
  type?: ExportColumnType;
  width?: number;
  align?: ExportAlign;
  numberFormat?: string;
  defaultSelected?: boolean;
  required?: boolean;
}

export interface ExportDataSource<T> {
  getPageRows?: () => T[];
  getFilteredRows?: () => T[] | Observable<T[]> | Promise<T[]>;
}

export interface PdfOptions {
  pageSize: PdfPageSize;
  orientation: PdfOrientation;
  margin: number;
  fontSize: number;
  pageNumbers: boolean;
  showFilters: boolean;
}

export interface ExcelOptions {
  autoFilter: boolean;
  freezeHeader: boolean;
}

export interface CsvOptions {
  delimiter: ',' | ';';
}

export interface ExportModuleConfig<T> {
  title: string;
  fileBaseName: string;
  sheetName?: string;
  establishmentName?: string;
  columns: ExportColumn<T>[];
  formats?: ExportFormat[];
  defaultFormat?: ExportFormat;
  defaultScope?: ExportScope;
  allowColumnSelection?: boolean;
  pdfDefaults?: Partial<PdfOptions>;
  excelDefaults?: Partial<ExcelOptions>;
  csvDefaults?: Partial<CsvOptions>;
  getFilters?: () => string[];
}

export interface ExportRequest {
  format: ExportFormat;
  reportName: string;
  fileName: string;
  scope: ExportScope;
  columnKeys: string[];
  includeGeneratedDate: boolean;
  appendDateToFileName: boolean;
  pdf: PdfOptions;
  excel: ExcelOptions;
  csv: CsvOptions;
}

export interface ExportTableColumn {
  key: string;
  header: string;
  type: ExportColumnType;
  width: number;
  align: ExportAlign;
  numberFormat?: string;
}

export interface ExportTable {
  title: string;
  establishment: string;
  generatedAt: Date | null;
  filters: string[];
  columns: ExportTableColumn[];
  rows: ExportValue[][];
}
