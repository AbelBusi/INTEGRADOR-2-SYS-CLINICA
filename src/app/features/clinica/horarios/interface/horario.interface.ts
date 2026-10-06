export type HoraApi = string | number[];

export type VistaCalendario = 'mes' | 'semana' | 'dia';

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
  estado: number;
}

export interface HorarioDia {
  idHorario: number;
  diaSemana: number;
  horaEntrada: HoraApi;
  horaSalida: HoraApi;
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
  horarios: HorarioCrearItem[];
}

export interface HorarioCreado {
  idEmpleado: number;
  horarios: unknown[];
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
