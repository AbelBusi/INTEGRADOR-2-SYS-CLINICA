import { ExportColumnType, ExportValue } from '../interface/export.interface';

const ILLEGAL_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;
const SAFE_SIGNED_NUMBER = /^[+-]?[\d\s().,-]+$/;
const INVALID_FILE_CHARS = /[\\/:*?"<>|\u0000-\u001F]/g;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function cleanText(value: string): string {
  return value.replace(ILLEGAL_XML_CHARS, '');
}

export function toDate(value: ExportValue): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string') {
    const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (isoDate) {
      return new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === 'number') {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

export function formatDate(date: Date): string {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function formatDisplayValue(value: ExportValue, type: ExportColumnType): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (type === 'date' || type === 'datetime') {
    const date = toDate(value);
    if (date) {
      return type === 'date' ? formatDate(date) : formatDateTime(date);
    }
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  if (value instanceof Date) {
    return formatDateTime(value);
  }

  return cleanText(String(value));
}

export function neutralizeFormula(text: string): string {
  if (!text) {
    return text;
  }

  const first = text[0];

  if (first === '=' || first === '@' || first === '\t' || first === '\r') {
    return `'${text}`;
  }

  if ((first === '+' || first === '-') && !SAFE_SIGNED_NUMBER.test(text)) {
    return `'${text}`;
  }

  return text;
}

export function sanitizeFileName(name: string): string {
  const cleaned = name
    .trim()
    .replace(/\.(pdf|xlsx|csv)$/i, '')
    .replace(INVALID_FILE_CHARS, '')
    .replace(/\s+/g, '-')
    .replace(/^\.+/, '')
    .slice(0, 100);

  return cleaned || 'reporte';
}

export function buildFileName(baseName: string, extension: string, date?: Date): string {
  const suffix = date
    ? `_${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`
    : '';
  return `${sanitizeFileName(baseName)}${suffix}.${extension}`;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
