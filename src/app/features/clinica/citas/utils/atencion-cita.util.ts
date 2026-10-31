import { CitaFila } from '../interface/cita.interface';

export type VentanaCita = 'futura' | 'en_curso' | 'vencida';

function construirFecha(fecha: string, hora: string): Date {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [horas, minutos] = hora.split(':').map(Number);
  return new Date(anio, mes - 1, dia, horas, minutos);
}

export function inicioCita(cita: CitaFila): Date {
  return construirFecha(cita.fecha, cita.inicio);
}

export function finCita(cita: CitaFila): Date {
  return construirFecha(cita.fecha, cita.salida);
}

export function ventanaCita(cita: CitaFila, ahora: Date): VentanaCita {
  if (ahora < inicioCita(cita)) {
    return 'futura';
  }

  if (ahora >= finCita(cita)) {
    return 'vencida';
  }

  return 'en_curso';
}

export function puedeAtenderCita(cita: CitaFila, ahora: Date): boolean {
  return cita.estado === 1 && ventanaCita(cita, ahora) === 'en_curso';
}

export function citaVencida(cita: CitaFila, ahora: Date): boolean {
  return cita.estado === 1 && ventanaCita(cita, ahora) === 'vencida';
}
