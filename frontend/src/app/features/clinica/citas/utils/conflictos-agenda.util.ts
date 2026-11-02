import { aMinutos } from '../../horarios/utils/calendario.util';
import { CitaFila } from '../interface/cita.interface';

export interface RangoMinutos {
  inicio: number;
  fin: number;
}

export function ocupadosPacienteDelDia(
  citas: CitaFila[],
  idPaciente: number | null,
  iso: string,
  excluirId: number | null,
): RangoMinutos[] {
  if (idPaciente === null || !iso) {
    return [];
  }

  return citas
    .filter(
      (c) => c.estado === 1 && c.idPaciente === idPaciente && c.fecha === iso && c.id !== excluirId,
    )
    .map((c) => ({ inicio: aMinutos(c.inicio), fin: aMinutos(c.salida) }))
    .sort((a, b) => a.inicio - b.inicio);
}

export function unirRangos(...grupos: RangoMinutos[][]): RangoMinutos[] {
  const todos = grupos
    .flat()
    .map((r) => ({ inicio: r.inicio, fin: r.fin }))
    .sort((a, b) => a.inicio - b.inicio);

  const unidos: RangoMinutos[] = [];

  for (const rango of todos) {
    const ultimo = unidos[unidos.length - 1];

    if (ultimo && rango.inicio <= ultimo.fin) {
      ultimo.fin = Math.max(ultimo.fin, rango.fin);
    } else {
      unidos.push(rango);
    }
  }

  return unidos;
}
