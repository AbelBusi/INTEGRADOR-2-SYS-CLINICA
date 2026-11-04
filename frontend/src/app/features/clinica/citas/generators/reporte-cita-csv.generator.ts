import { infoEstado } from '../interface/cita.interface';
import { ReporteCitas } from '../interface/reporte-cita.interface';
import { fechaIsoTexto } from '../utils/reporte-cita.util';

const SEPARADOR = ';';

function celda(valor: string): string {
  let texto = valor ?? '';

  if (/^[=+\-@\t\r]/.test(texto)) {
    texto = `'${texto}`;
  }

  return /[";\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function generarCsvReporteCitas(reporte: ReporteCitas): Blob {
  const cabecera = [
    'N° de cita',
    'Paciente',
    'Médico',
    'Fecha',
    'Hora de inicio',
    'Hora de salida',
    'Estado',
    'Sin regularizar',
    'Motivo',
  ];

  const filas = reporte.citas.map((cita) => [
    String(cita.id),
    cita.paciente,
    cita.medico,
    fechaIsoTexto(cita.fecha),
    cita.inicio,
    cita.salida,
    infoEstado(cita.estado).texto,
    cita.estado === 1 && reporte.pendientes.has(cita.id) ? 'Sí' : 'No',
    cita.motivo,
  ]);

  const contenido = [cabecera, ...filas]
    .map((fila) => fila.map(celda).join(SEPARADOR))
    .join('\r\n');

  return new Blob([`\uFEFF${contenido}`], { type: 'text/csv;charset=utf-8;' });
}
