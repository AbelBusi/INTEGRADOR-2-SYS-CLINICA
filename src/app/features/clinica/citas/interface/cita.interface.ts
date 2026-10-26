import { FechaApi, HoraApi } from '../../horarios/interface/horario.interface';
export type ResolucionRegularizacion = 'ATENDIDA' | 'CANCELADA';

export interface MensajeResponse<T> {
  mensaje: string;
  object: T;
}

export interface Cita {
  id: number;
  idPaciente: number;
  paciente: string;
  idMedico: number;
  medico: string;
  idUsuario: number;
  fechaCita: FechaApi;
  horaInicio: HoraApi;
  horaSalida: HoraApi;
  motivo: string;
  estado: number;
}

export interface CitaFila extends Cita {
  fecha: string;
  inicio: string;
  salida: string;
}

export interface CitaDTO {
  idPaciente: number;
  idMedico: number;
  idUsuario: number;
  fechaCita: string;
  horaInicio: string;
  horaSalida: string;
  motivo: string;
}

export interface PacienteBusqueda {
  idPaciente: number;
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  genero: string;
}

export interface PacienteInfo {
  id: number;
  codigoTipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: FechaApi | null;
  genero: string;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
  nacionalidad: string;
  codigoAsegurado: string;
  entidadAsegurado: string;
}

export interface UsuarioRegistro {
  id: number;
  usuario: string;
  nombreCompleto: string;
}

export interface MedicoResumen {
  idMedico: number;
  nombre: string;
}

export interface EspecialidadResumen {
  idEspecialidad: number;
  nombre: string;
}

export interface MedicoInfo {
  id: number;
  idEmpleado: number;
  idEspecialidad: number;
  especialidad: string;
  nombre: string;
  apellidos: string;
  codigoTipoDocumento: string | null;
  numeroDocumento: string | null;
  telefono: string | null;
  correo: string | null;
  cargo: string | null;
  numeroColegiatura: string | null;
  numeroEspecialidad: string | null;
  consejoRegional: string | null;
}

export interface InfoEstadoCita {
  texto: string;
  clases: string;
  punto: string;
}



export const ESTADOS_CITA: Record<number, InfoEstadoCita> = {
  0: {
    texto: 'Eliminada',
    clases: 'bg-gray-100 text-gray-500 border-gray-300 rounded-sm',
    punto: 'bg-gray-400',
  },
  1: {
    texto: 'Programada',
    clases: 'bg-gray-100 text-[#58595B] border-gray-300 rounded-sm',
    punto: 'bg-[#58595B]',
  },
  2: {
    texto: 'Cancelada',
    clases: 'bg-white text-[#D9182A] border-[#D9182A] rounded-sm',
    punto: 'bg-[#D9182A]',
  },
  3: {
    texto: 'Atendida',
    clases: 'bg-gray-100 text-[#58595B] border-gray-300 rounded-sm',
    punto: 'bg-[#58595B]',
  },
  4: {
    texto: 'Reprogramada',
    clases: 'bg-white text-[#D9182A] border-[#D9182A] rounded-sm',
    punto: 'bg-[#D9182A]',
  },
};


export const OPCIONES_ESTADO = [
  { valor: 1, texto: 'Programadas' },
  { valor: 2, texto: 'Canceladas' },
  { valor: 3, texto: 'Atendidas' },
  { valor: 4, texto: 'Reprogramadas' },
];

export const DURACIONES = [15, 20, 30, 45, 60];

export function infoEstado(estado: number): InfoEstadoCita {
  return ESTADOS_CITA[estado] ?? ESTADOS_CITA[0];
}

export type AccionHistorial =
  'CREADA' | 'MODIFICADA' | 'REPROGRAMADA' | 'CANCELADA' | 'ATENDIDA' | 'ELIMINADA';

export interface HistorialCita {
  id: number;
  idCita: number;
  accion: AccionHistorial;
  fechaEvento: string | number[];
  idUsuario: number;
  usuario: string;
  nombreUsuario: string;
  observacion: string | null;
  datosAnteriores: Record<string, unknown> | null;
  datosNuevos: Record<string, unknown> | null;
}

export interface InfoAccionHistorial {
  texto: string;
  icono: string;
  punto: string;
}

export const ACCIONES_HISTORIAL: Record<AccionHistorial, InfoAccionHistorial> = {
  CREADA: { texto: 'Cita registrada', icono: 'event', punto: 'bg-[#0d6b68]' },
  MODIFICADA: { texto: 'Datos modificados', icono: 'edit', punto: 'bg-[#58595B]' },
  REPROGRAMADA: { texto: 'Cita reprogramada', icono: 'update', punto: 'bg-amber-500' },
  CANCELADA: { texto: 'Cita cancelada', icono: 'event_busy', punto: 'bg-[#D9182A]' },
  ATENDIDA: { texto: 'Atención médica registrada', icono: 'task_alt', punto: 'bg-[#0d6b68]' },
  ELIMINADA: { texto: 'Cita eliminada', icono: 'delete', punto: 'bg-neutral-400' },
};
