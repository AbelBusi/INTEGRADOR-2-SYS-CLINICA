export type HoraApi = string | number[];
export type FechaApi = string | number[];

export type VistaCalendario = 'mes' | 'semana' | 'dia';
export type EstadoVigencia = 'vigente' | 'proximo' | 'vencido';

export interface MensajeResponse<T> {
  mensaje: string;
  object: T;
}

export interface HorarioResumen {
  id: number;
  idEmpleado: number;
  empleado: string;
  foto: string | null;
  diaSemana: number;
  horaEntrada: HoraApi;
  horaSalida: HoraApi;
  fechaInicio: FechaApi;
  fechaFin: FechaApi;
  estado: number;
}

export interface HorarioDia {
  idHorario: number;
  diaSemana: number;
  horaEntrada: HoraApi;
  horaSalida: HoraApi;
  fechaInicio: FechaApi;
  fechaFin: FechaApi;
}

export interface EmpleadoHorario {
  idEmpleado: number;
  horarios: HorarioDia[];
}

export interface HorarioCrearItem {
  diaSemana: number;
  horaEntrada: string;
  horaSalida: string;
}

export interface HorarioCrearDTO {
  idEmpleado: number;
  fechaInicio: string;
  fechaFin: string;
  horarios: HorarioCrearItem[];
}

export interface HorarioActualizarDTO {
  diaSemana: number;
  horaEntrada: string;
  horaSalida: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface HorarioCreado {
  idEmpleado: number;
  horarios: HorarioDia[];
}

export interface TramoDetalle {
  id: number;
  diaSemana: number;
  entrada: string;
  salida: string;
  minutos: number;
  inicio: string;
  fin: string;
  vigencia: EstadoVigencia;
}

export interface EmpleadoLista {
  id: number;
  nombreCompleto: string;
  numeroDocumento: string;
  telefono: string | null;
  cargo: string;
  fechaIngreso: string;
  foto: string | null;
  estado: number;
}

export interface EmpleadoResumen {
  idEmpleado: number;
  nombre: string;
}

export interface CargoResumen {
  idCargo: number;
  nombre: string;
}

export interface EmpleadoAgenda {
  id: number;
  nombre: string;
  cargo: string;
  foto: string | null;
  color: string;
}
