import { DatosCsv } from '../interface/reporte-cita-extra.interface';

const SEPARADOR = ';';

function celda(valor: string): string {
  let texto = valor ?? '';

  if (/^[=+\-@\t\r]/.test(texto)) {
    texto = `'${texto}`;
  }

  return /[";\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function generarCsvDocumentoReporte(datos: DatosCsv): Blob {
  const contenido = [datos.cabecera, ...datos.filas]
    .map((fila) => fila.map(celda).join(SEPARADOR))
    .join('\r\n');

  return new Blob([`\uFEFF${contenido}`], { type: 'text/csv;charset=utf-8;' });
}
