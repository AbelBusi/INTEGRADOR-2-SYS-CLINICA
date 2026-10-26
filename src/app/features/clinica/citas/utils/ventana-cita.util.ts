import { CitaFila } from '../interface/cita.interface';

const LIMITE_CANCELACION_MS = 2 * 60 * 60 * 1000;

function inicioDeCita(cita: CitaFila): Date {
  return new Date(`${cita.fecha}T${cita.inicio}:00`);
}

export function puedeCancelarCita(cita: CitaFila, ahora: Date = new Date()): boolean {
  return (
    cita.estado === 1 && inicioDeCita(cita).getTime() - ahora.getTime() > LIMITE_CANCELACION_MS
  );
}

export const MOTIVO_NO_CANCELABLE = 'No se puede cancelar: faltan 2 horas o menos para el inicio.';
