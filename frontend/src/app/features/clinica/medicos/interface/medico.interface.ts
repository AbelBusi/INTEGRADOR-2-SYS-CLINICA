export interface MensajeResponse<T> {
  mensaje: string;
  object: T;
}

export interface Medico {
  id: number;
  nombreCompleto: string;
  cargo: string;
  especialidad: string;
  numeroColegiatura: string;
  telefono: string | null;
  foto: string | null;
  estado: number;
}

export interface MedicoDetalle {
  id: number;
  idTipoDocumento: number;
  codigoTipoDocumento: string;
  descripcionTipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
  nacionalidad: string;
  idEmpleado: number;
  idCargo: number;
  cargo: string;
  fechaIngreso: string;
  fechaRetiro: string | null;
  foto: string | null;
  estadoEmpleado: number;
  idEspecialidad: number;
  especialidad: string;
  numeroColegiatura: string;
  numeroEspecialidad: string | null;
  consejoRegional: string | null;
  estado: number;
}

export interface MedicoRespuesta {
  id: number;
  idEmpleado: number;
  idEspecialidad: number;
  especialidad: string;
  numeroColegiatura: string;
  numeroEspecialidad: string | null;
  consejoRegional: string | null;
  estado: number;
}

export interface EmpleadoMedicoResumen {
  idEmpleado: number;
  nombre: string;
}

export interface EspecialidadResumen {
  idEspecialidad: number;
  nombre: string;
}

export interface MedicoCrearDTO {
  idEmpleado: number;
  idEspecialidad: number;
  numeroColegiatura: string;
  numeroEspecialidad: string | null;
  consejoRegional: string | null;
}

export interface MedicoActualizarDTO {
  idEspecialidad: number;
  numeroColegiatura: string;
  numeroEspecialidad: string | null;
  consejoRegional: string | null;
}

export interface MedicoForm {
  idEmpleado: number | null;
  idEspecialidad: number | null;
  numeroColegiatura: string;
  numeroEspecialidad: string;
  consejoRegional: string;
}

export function formularioVacio(): MedicoForm {
  return {
    idEmpleado: null,
    idEspecialidad: null,
    numeroColegiatura: '',
    numeroEspecialidad: '',
    consejoRegional: '',
  };
}

export interface DisponibilidadCodigos {
  colegiaturaDisponible: boolean;
  especialidadDisponible: boolean;
}

export function formularioACrearDto(form: MedicoForm): MedicoCrearDTO {
  return {
    idEmpleado: form.idEmpleado as number,
    idEspecialidad: form.idEspecialidad as number,
    numeroColegiatura: form.numeroColegiatura.trim(),
    numeroEspecialidad: form.numeroEspecialidad.trim() || null,
    consejoRegional: form.consejoRegional.trim() || null,
  };
}

export function formularioAActualizarDto(form: MedicoForm): MedicoActualizarDTO {
  return {
    idEspecialidad: form.idEspecialidad as number,
    numeroColegiatura: form.numeroColegiatura.trim(),
    numeroEspecialidad: form.numeroEspecialidad.trim() || null,
    consejoRegional: form.consejoRegional.trim() || null,
  };
}

const REGIONES = [
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali',
];

export const CONSEJOS_REGIONALES = REGIONES.map((region) => `CMP-${region}`);

export function consejoAleatorio(): string {
  return CONSEJOS_REGIONALES[Math.floor(Math.random() * CONSEJOS_REGIONALES.length)];
}

export function generarNumeroColegiatura(): string {
  return String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');
}

export function generarNumeroEspecialidad(): string {
  return `RNE-${Math.floor(Math.random() * 90000) + 10000}`;
}

export function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
