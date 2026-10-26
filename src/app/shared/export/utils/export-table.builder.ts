import { EXPORT_ESTABLISHMENT_NAME } from '../constants/export.constants';
import { ExportError } from '../interface/export.error';
import {
  ExportModuleConfig,
  ExportRequest,
  ExportTable,
  ExportTableColumn,
  ExportValue,
} from '../interface/export.interface';
import { toDate } from './export-format.util';

export function buildExportTable<T>(
  config: ExportModuleConfig<T>,
  request: ExportRequest,
  rows: T[],
): ExportTable {
  const selected = new Set(request.columnKeys);
  const columns = config.columns.filter((column) => column.required || selected.has(column.key));

  if (!columns.length) {
    throw new ExportError('Selecciona al menos una columna para exportar.');
  }

  const tableColumns: ExportTableColumn[] = columns.map((column) => {
    const type = column.type ?? 'text';

    return {
      key: column.key,
      header: column.header,
      type,
      width: column.width ?? 1,
      align: column.align ?? (type === 'number' ? 'right' : 'left'),
      numberFormat: column.numberFormat,
    };
  });

  const tableRows: ExportValue[][] = rows.map((row) =>
    columns.map((column) => {
      const value = column.value(row);
      const type = column.type ?? 'text';

      return type === 'date' || type === 'datetime' ? (toDate(value) ?? value) : value;
    }),
  );

  return {
    title: request.reportName,
    establishment: config.establishmentName ?? EXPORT_ESTABLISHMENT_NAME,
    generatedAt: request.includeGeneratedDate ? new Date() : null,
    filters: config.getFilters?.() ?? [],
    columns: tableColumns,
    rows: tableRows,
  };
}
