export type EstadoRegistro =
  'NO_ELEGIBLE' | 'CUENTA_EXISTENTE' | 'PUEDE_CREAR_CUENTA' | 'PUEDE_AGREGAR_ROL';

export type PasoRegistro = 'identificacion' | 'datos' | 'correo' | 'verificacion' | 'exito';

export interface DocumentoPaciente {
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface DatosPersonales {
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
}

export interface IdentidadPaciente extends DocumentoPaciente, DatosPersonales {}


export interface ElegibilidadResponse {
  estado: EstadoRegistro;
  mensaje: string;
  tieneCorreo: boolean;
  correoEnmascarado: string | null;
}

export interface EnviarCodigoRegistroRequest extends IdentidadPaciente {
  correoNuevo?: string;
}

export interface CodigoEnviadoResponse {
  mensaje: string;
  correoEnmascarado: string;
}

export interface CompletarRegistroRequest extends IdentidadPaciente {
  codigo: string;
}

export interface RegistroCompletadoResponse {
  cuentaNueva: boolean;
  mensaje: string;
  correoEnmascarado: string;
}
