import { FechaHoraApi } from '../utils/formato.util';

export type TipoUsuario = 'PACIENTE' | 'EMPLEADO';

export interface MensajeResponse<T> {
  mensaje: string;
  object: T;
}

export interface UsuarioListado {
  id: number;
  persona: string;
  nombreUsuario: string;
  rol: string;
  fechaCreacion: FechaHoraApi;
  fechaActualizacion: FechaHoraApi;
  requiereCambioClave: boolean;
  estado: number;
  idRegistro?: number | null;
}

export interface UsuarioFila extends UsuarioListado {
  tipo: TipoUsuario;
}

export interface PersonaUsuario {
  idPersona: number;
  nombreCompleto: string;
}

export interface RolResumen {
  idRol: number;
  nombre: string;
}

export interface UsuarioAltaDTO {
  idPersona: number;
  tipo: TipoUsuario;
  idRol: number | null;
}

export interface UsuarioCreado {
  id: number;
  usuario: string;
  correoEnmascarado: string;
}

export interface PacienteDetalle {
  id: number;
  codigoTipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
  nacionalidad: string;
  codigoAsegurado: string;
  entidadAsegurado: string;
}

export interface EmpleadoDetalle {
  id: number;
  codigoTipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
  nacionalidad: string;
  cargo: string;
  fechaIngreso: string;
  fechaRetiro: string | null;
  foto: string | null;
}

export interface DatoVista {
  etiqueta: string;
  valor: string;
}

export interface DetallePersona {
  nombreCompleto: string;
  foto: string | null;
  tituloRegistro: string;
  personales: DatoVista[];
  registro: DatoVista[];
}
