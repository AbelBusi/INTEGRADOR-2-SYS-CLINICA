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

export const GENEROS = ['Masculino', 'Femenino'];

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

export function fechaMaximaNacimiento(): string {
  const fecha = new Date();

  fecha.setFullYear(fecha.getFullYear() - 18);

  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function formularioADto(form: EmpleadoForm): EmpleadoCrearDTO {
  return {
    persona: {
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
    },
    idCargo: form.idCargo as number,
  };
}
