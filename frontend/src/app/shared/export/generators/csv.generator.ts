import { EXPORT_FORMAT_META } from '../constants/export.constants';
import { CsvOptions, ExportTable } from '../interface/export.interface';
import { formatDisplayValue, neutralizeFormula } from '../utils/export-format.util';

function escapeCsv(value: string, delimiter: string): string {
  const safe = neutralizeFormula(value);
  const needsQuotes =
    safe.includes(delimiter) ||
    safe.includes('"') ||
    safe.includes('\n') ||
    safe.includes('\r') ||
    safe !== safe.trim();

  return needsQuotes ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function generateCsv(table: ExportTable, options: CsvOptions): Blob {
  const { delimiter } = options;

  const lines: string[] = [
    table.columns.map((column) => escapeCsv(column.header, delimiter)).join(delimiter),
  ];

  for (const row of table.rows) {
    lines.push(
      row
        .map((value, index) =>
          escapeCsv(formatDisplayValue(value, table.columns[index].type), delimiter),
        )
        .join(delimiter),
    );
  }

  return new Blob(['\ufeff', lines.join('\r\n'), '\r\n'], { type: EXPORT_FORMAT_META.csv.mime });
}
