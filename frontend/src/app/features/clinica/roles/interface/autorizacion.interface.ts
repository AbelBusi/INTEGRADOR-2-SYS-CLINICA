export interface MensajeResponse<T> {
  mensaje: string;
  object: T;
}

export interface PermisoItem {
  id: number;
  nombre: string;
  codigo: string;
}

export interface PermisoModulo {
  modulo: string;
  permisos: PermisoItem[];
}

export interface PermisosModulos {
  modulos: PermisoModulo[];
}

export interface AutorizacionRol {
  rol: string;
  permisos: PermisoModulo[];
}

export interface AutorizacionSincronizarDTO {
  idRol: number;
  idPermisos: number[];
}

export interface AutorizacionRespuesta {
  idRol: number;
  permisos: { idPermiso: number }[];
}
