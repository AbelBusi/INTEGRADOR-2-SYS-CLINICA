export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  estado: number;
}

export interface RolCrearDTO {
  nombre: string;
  descripcion: string;
}

export interface MensajeResponse {
  mensaje: string;
  object: Rol[];
}

export interface MensajeResponseSingle {
  mensaje: string;
  object: Rol;
}

export interface RolActualizar {
  nombre: string;
  descripcion: string;
}

export interface NombreRolDTO {
  idRol: number;
  nombreEspecialidad: string;
}

export interface MensajeResponseResumen {
  mensaje: string;
  object: NombreRolDTO[];
}
