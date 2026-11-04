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
  inicioAtencion?: string | number[] | null;
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

export interface EspecialidadBusqueda {
  id: number;
  nombre: string;
  cantidadMedicos: number;
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
  5: {
    texto: 'Atención no finalizada',
    clases: 'bg-amber-50 text-amber-700 border-amber-300 rounded-sm',
    punto: 'bg-amber-500',
  },
};


export const OPCIONES_ESTADO = [
  { valor: 1, texto: 'Programadas' },
  { valor: 2, texto: 'Canceladas' },
  { valor: 3, texto: 'Atendidas' },
  { valor: 4, texto: 'Reprogramadas' },
  { valor: 5, texto: 'No finalizadas' },
];

export const DURACIONES = [15, 20, 30, 45, 60];

export function infoEstado(estado: number): InfoEstadoCita {
  return ESTADOS_CITA[estado] ?? ESTADOS_CITA[0];
}

export type AccionHistorial =
  | 'CREADA'
  | 'MODIFICADA'
  | 'REPROGRAMADA'
  | 'CANCELADA'
  | 'ATENDIDA'
  | 'ELIMINADA'
  | 'INICIADA'
  | 'CLINICA_MODIFICADA'
  | 'INTENTO_BLOQUEADO'
  | 'INICIO_REGULARIZACION'
  | 'INASISTENCIA'
  | 'VENCIDA_SIN_FINALIZAR';

export interface HistorialCita {
  id: number;
  idCita: number;
  accion: AccionHistorial;
  fechaEvento: string | number[];
  idUsuario: number | null;
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
  INICIADA: { texto: 'Atención iniciada', icono: 'play_circle', punto: 'bg-[#0d6b68]' },
  CLINICA_MODIFICADA: {
    texto: 'Registro clínico posterior',
    icono: 'assignment',
    punto: 'bg-amber-500',
  },
  INTENTO_BLOQUEADO: { texto: 'Operación bloqueada', icono: 'block', punto: 'bg-[#D9182A]' },
  INICIO_REGULARIZACION: {
    texto: 'Regularización iniciada',
    icono: 'fact_check',
    punto: 'bg-amber-500',
  },
  INASISTENCIA: { texto: 'Inasistencia registrada', icono: 'person_off', punto: 'bg-[#D9182A]' },
  VENCIDA_SIN_FINALIZAR: {
    texto: 'Atención no finalizada por vencimiento',
    icono: 'warning',
    punto: 'bg-amber-500',
  },
};

export type MotivoRegularizacionAdministrativa =
  'NO_REALIZADA_ESTABLECIMIENTO' | 'SUSPENDIDA_INSTITUCIONAL' | 'CANCELADA_PACIENTE';

export const OPCIONES_REGULARIZACION_ADMINISTRATIVA: {
  valor: MotivoRegularizacionAdministrativa;
  titulo: string;
  descripcion: string;
  permiteReprogramar: boolean;
  icono: string;
}[] = [
  {
    valor: 'NO_REALIZADA_ESTABLECIMIENTO',
    titulo: 'Atención no realizada por el establecimiento',
    descripcion: 'Médico ausente, problemas operativos o consultorio no disponible.',
    permiteReprogramar: true,
    icono: 'domain_disabled',
  },
  {
    valor: 'SUSPENDIDA_INSTITUCIONAL',
    titulo: 'Atención suspendida por motivos institucionales',
    descripcion: 'Suspensión de actividades o contingencias del establecimiento.',
    permiteReprogramar: true,
    icono: 'report_problem',
  },
  {
    valor: 'CANCELADA_PACIENTE',
    titulo: 'Paciente solicitó cancelar la cita',
    descripcion: 'Se registra la cancelación; no se habilita la reprogramación automática.',
    permiteReprogramar: false,
    icono: 'event_busy',
  },
];
