export interface MensajeResponse<T> {
  mensaje: string;
  object: T;
}

export interface Paciente {
  id: number;
  paciente: string;
  genero: string;
  telefono: string | null;
  codigoAsegurado: string;
  entidadAsegurado: string;
  estado: number;
}

export interface PacienteDetalle {
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
  fechaCreacion: string;
  fechaActualizacion: string;
  codigoAsegurado: string;
  entidadAsegurado: string;
  estado: number;
}

export interface PacienteRespuesta {
  id: number;
  entidadAsegurado: string;
  codigoAsegurado: string;
  estado: number;
}

export interface PersonaDTO {
  tipoDocumento: number;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
  nacionalidad: string;
}

export interface PacienteCrearDTO {
  entidadAsegurado: string;
  codigoAsegurado: string;
  persona: PersonaDTO;
}

export interface PacienteActualizarDTO {
  codigoAsegurado: string;
  persona: PersonaDTO;
}

export interface PersonaCrearDTO {
  codigoAsegurado: string;
  persona: PersonaDTO;
}


export interface PacienteForm {
  idTipoDocumento: number | null;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  direccion: string;
  correo: string;
  nacionalidad: string;
  entidadAsegurado: string;
  codigoAsegurado: string;
}

export interface TipoDocumentoResumen {
  idTipoDocumento: number;
  codigo: string;
  longitud: number;
}

export const GENEROS = ['Masculino', 'Femenino'];

export const ENTIDAD_ASEGURADORA = 'SIS';

export function generarCodigoAsegurado(): string {
  const numero = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  return `SIS-${numero}`;
}

export function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function fechaMaximaNacimiento(): string {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const mes = String(ayer.getMonth() + 1).padStart(2, '0');
  const dia = String(ayer.getDate()).padStart(2, '0');
  return `${ayer.getFullYear()}-${mes}-${dia}`;
}

export const NACIONALIDADES = [
  'Peruana',
  'Argentina',
  'Boliviana',
  'Brasileña',
  'Chilena',
  'Colombiana',
  'Ecuatoriana',
  'Mexicana',
  'Venezolana',
  'Otra',
];

export function formularioVacio(): PacienteForm {
  return {
    idTipoDocumento: null,
    numeroDocumento: '',
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    telefono: '',
    direccion: '',
    correo: '',
    nacionalidad: 'Peruana',
    entidadAsegurado: ENTIDAD_ASEGURADORA,
    codigoAsegurado: '',
  };
}

function personaDesdeFormulario(form: PacienteForm): PersonaDTO {
  return {
    tipoDocumento: form.idTipoDocumento as number,
    numeroDocumento: form.numeroDocumento.trim(),
    nombre: form.nombre.trim(),
    apellidos: form.apellidos.trim(),
    fechaNacimiento: form.fechaNacimiento,
    genero: form.genero,
    telefono: form.telefono.trim() || null,
    direccion: form.direccion.trim() || null,
    correo: form.correo.trim() || null,
    nacionalidad: form.nacionalidad.trim(),
  };
}

export function formularioACrearDto(form: PacienteForm): PacienteCrearDTO {
  return {
    entidadAsegurado: form.entidadAsegurado.trim(),
    codigoAsegurado: form.codigoAsegurado.trim(),
    persona: personaDesdeFormulario(form),
  };
}

export function formularioAActualizarDto(form: PacienteForm): PacienteActualizarDTO {
  return {
    codigoAsegurado: form.codigoAsegurado.trim(),
    persona: personaDesdeFormulario(form),
  };
}
