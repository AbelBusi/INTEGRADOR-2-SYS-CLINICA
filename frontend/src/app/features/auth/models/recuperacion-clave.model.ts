export type CanalRecuperacion = 'CORREO' | 'SMS';

export type PasoRecuperacion = 'solicitud' | 'verificacion' | 'nueva-clave' | 'exito';

export interface RecuperarClaveRequest {
  usuario: string;
  numeroDocumento: string;
  canal: CanalRecuperacion;
  destino: string;
}

export interface VerificarCodigoRequest {
  usuario: string;
  codigo: string;
}

export interface RestablecerClaveRequest {
  usuario: string;
  codigo: string;
  nuevaClave: string;
}

export interface MensajeResponse {
  mensaje: string;
}
