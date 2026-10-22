import { HorarioDia } from '../../horarios/interface/horario.interface';
import {
  aFechaISO,
  aHHmm,
  aMinutos,
  diaSemanaDeFecha,
  fechaDesdeISO,
} from '../../horarios/utils/calendario.util';
import { Cita, CitaFila } from '../interface/cita.interface';

export interface Tramo {
  inicio: number;
  fin: number;
}

export function normalizarCita(cita: Cita): CitaFila {
  return {
    ...cita,
    fecha: aFechaISO(cita.fechaCita),
    inicio: aHHmm(cita.horaInicio),
    salida: aHHmm(cita.horaSalida),
  };
}

export function minutosAHHmm(minutos: number): string {
  const horas = String(Math.floor(minutos / 60)).padStart(2, '0');
  const resto = String(minutos % 60).padStart(2, '0');
  return `${horas}:${resto}`;
}

export function minutosAhora(): number {
  const ahora = new Date();
  return ahora.getHours() * 60 + ahora.getMinutes();
}

export function seCruzan(a: Tramo, b: Tramo): boolean {
  return a.inicio < b.fin && a.fin > b.inicio;
}

export function tramosDelDia(horarios: HorarioDia[], fechaISO: string): Tramo[] {
  if (!fechaISO) {
    return [];
  }

  const dia = diaSemanaDeFecha(fechaDesdeISO(fechaISO));

  return horarios
    .filter(
      (h) =>
        h.diaSemana === dia &&
        aFechaISO(h.fechaInicio) <= fechaISO &&
        aFechaISO(h.fechaFin) >= fechaISO,
    )
    .map((h) => ({ inicio: aMinutos(h.horaEntrada), fin: aMinutos(h.horaSalida) }))
    .filter((tramo) => tramo.fin > tramo.inicio)
    .sort((a, b) => a.inicio - b.inicio);
}

export function ocupadosDelDia(
  citas: CitaFila[],
  idMedico: number | null,
  fechaISO: string,
  excluirId: number | null,
): Tramo[] {
  if (idMedico === null || !fechaISO) {
    return [];
  }

  return citas
    .filter(
      (c) =>
        c.estado === 1 && c.idMedico === idMedico && c.fecha === fechaISO && c.id !== excluirId,
    )
    .map((c) => ({ inicio: aMinutos(c.inicio), fin: aMinutos(c.salida) }))
    .sort((a, b) => a.inicio - b.inicio);
}

export function huecosDisponibles(
  tramos: Tramo[],
  ocupados: Tramo[],
  duracion: number,
  minimoInicio: number,
): number[] {
  const huecos: number[] = [];

  for (const tramo of tramos) {
    for (let inicio = tramo.inicio; inicio + duracion <= tramo.fin; inicio += duracion) {
      const candidato = { inicio, fin: inicio + duracion };

      if (inicio >= minimoInicio && !ocupados.some((o) => seCruzan(candidato, o))) {
        huecos.push(inicio);
      }
    }
  }

  return huecos;
}
