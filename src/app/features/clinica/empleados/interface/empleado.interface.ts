export interface MensajeResponse<T> {
  mensaje: string;
  object: T;
}

export interface Empleado {
  id: number;
  nombreCompleto: string;
  numeroDocumento: string;
  telefono: string;
  cargo: string;
  fechaIngreso: string;
  foto: string | null;
  estado: number;
}

export interface EmpleadoDetalle {
  id: number;
  idTipoDocumento: number;
  codigoTipoDocumento: string;
  descripcionTipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  direccion: string;
  correo: string;
  nacionalidad: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  idCargo: number;
  cargo: string;
  fechaIngreso: string;
  fechaRetiro: string | null;
  foto: string | null;
  estado: number;
}

export interface EmpleadoRespuesta {
  id: number;
  idPersona: number;
  idCargo: number;
  cargo: string;
  fechaIngreso: string;
  fechaRetiro: string | null;
  foto: string | null;
  estado: number;
}

export interface PersonaDTO {
  idTipoDocumento: number;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  direccion: string;
  correo: string;
  nacionalidad: string;
}

export interface EmpleadoCrearDTO {
  persona: PersonaDTO;
  idCargo: number;
}

export interface EmpleadoActualizarDTO {
  persona: PersonaDTO;
  idCargo: number;
}

export interface EmpleadoForm {
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
  idCargo: number | null;
}

export interface CargoResumen {
  idCargo: number;
  nombre: string;
}

export interface TipoDocumentoResumen {
  idTipoDocumento: number;
  codigo: string;
  longitud: number;
}

export const GENEROS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
];

export function formularioVacio(): EmpleadoForm {
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
    nacionalidad: '',
    idCargo: null,
  };
}

export function formularioADto(form: EmpleadoForm): EmpleadoCrearDTO {
  return {
    persona: {
      idTipoDocumento: form.idTipoDocumento as number,
      numeroDocumento: form.numeroDocumento.trim(),
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      fechaNacimiento: form.fechaNacimiento,
      genero: form.genero,
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      correo: form.correo.trim(),
      nacionalidad: form.nacionalidad.trim(),
    },
    idCargo: form.idCargo as number,
  };
}
