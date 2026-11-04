export type TipoUsuario = 'PACIENTE' | 'EMPLEADO';

export interface MensajeResponse<T> {
  mensaje: string;
  object: T;
}

export interface RolResumen {
  idRol: number;
  nombre: string;
}

export interface UsuarioListado {
  id: number;
  usuario: string;
  nombreCompleto: string;
  numeroDocumento: string;
  estado: number;
  registroPresencial: boolean;
  roles: RolResumen[];
}

export interface PersonaBusqueda {
  idPersona: number;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  genero: string | null;
  esPaciente: boolean;
  esEmpleado: boolean;
  tieneCorreo: boolean;
}

export interface UsuarioFila extends UsuarioListado {
  tipos: TipoUsuario[];
}

export interface UsuarioRoles {
  id: number;
  usuario: string;
  nombreCompleto: string;
  roles: RolResumen[];
}

export interface PersonaUsuario {
  idPersona: number;
  nombreCompleto: string;
  numeroDocumento?: string;
}

export interface UsuarioAltaDTO {
  idPersona: number;
  tipo: TipoUsuario;
  idRoles: number[];
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

export interface RolOpcion {
  idRol: number;
  nombre: string;
  obligatorio: boolean;
  recomendado: boolean;
}

export interface RolesAsignables {
  idPersona: number;
  nombreCompleto: string;
  numeroDocumento: string;
  esPaciente: boolean;
  esEmpleado: boolean;
  esMedico: boolean;
  cargo: string | null;
  roles: RolOpcion[];
  avisos: string[];
}
