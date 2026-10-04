export type TipoTrabajador = 'DOCTOR' | 'RECEPCIONISTA';

export interface HorarioTrabajoLeer {
  id: number;
  personaId: number;
  nombreCompleto: string;
  tipo: TipoTrabajador;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  estado: number;
}

export interface HorarioCrearDTO {
  tipo: TipoTrabajador;
  referenciaId: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  estado: number;
}

export interface HorarioActualizarDTO {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  estado: number;
}

export interface Disponibilidad {
  id: number;
  nombre: string;
}

export interface AgendaBloque {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

export interface AgendaCita {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  descripcion: string;
}

export interface Agenda {
  bloques: AgendaBloque[];
  citas: AgendaCita[];
}

export const DIAS_SEMANA: { valor: number; nombre: string }[] = [
  { valor: 1, nombre: 'Lunes' },
  { valor: 2, nombre: 'Martes' },
  { valor: 3, nombre: 'Miércoles' },
  { valor: 4, nombre: 'Jueves' },
  { valor: 5, nombre: 'Viernes' },
  { valor: 6, nombre: 'Sábado' },
  { valor: 7, nombre: 'Domingo' },
];

export function nombreDia(valor: number): string {
  return DIAS_SEMANA.find((d) => d.valor === valor)?.nombre ?? `Día ${valor}`;
}
