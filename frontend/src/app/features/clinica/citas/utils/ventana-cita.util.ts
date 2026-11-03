import { CitaFila } from '../interface/cita.interface';

const LIMITE_CANCELACION_MS = 2 * 60 * 60 * 1000;

function inicioDeCita(cita: CitaFila): Date {
  return new Date(`${cita.fecha}T${cita.inicio}:00`);
}
export const MOTIVO_EN_ATENCION = 'No se puede cancelar: la cita tiene una atención en curso.';

export function puedeCancelarCita(cita: CitaFila, ahora: Date = new Date()): boolean {
  return (
    cita.estado === 1 &&
    !cita.inicioAtencion &&
    inicioDeCita(cita).getTime() - ahora.getTime() > LIMITE_CANCELACION_MS
  );
}

export function motivoNoCancelableCita(cita: CitaFila): string {
  return cita.inicioAtencion ? MOTIVO_EN_ATENCION : MOTIVO_NO_CANCELABLE;
}


export const MOTIVO_NO_CANCELABLE = 'No se puede cancelar: faltan 2 horas o menos para el inicio.';

const PLAZO_REGULARIZACION_MS = 24 * 60 * 60 * 1000;

export function limiteRegularizacion(cita: CitaFila): Date {
  return new Date(new Date(`${cita.fecha}T${cita.salida}:00`).getTime() + PLAZO_REGULARIZACION_MS);
}
