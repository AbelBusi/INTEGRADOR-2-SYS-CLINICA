export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
  estado: number;
}

export interface EspecialidadCrearDTO {
  nombre: string;
  descripcion: string;
  estado: number;
}

export interface MensajeResponse {
  mensaje: string;
  object: Especialidad[];
}

export interface MensajeResponseSingle {
  mensaje: string;
  object: Especialidad;
}

export interface EspecialidadActualizar {
  nombre: string;
  descripcion: string;
  estado: number;
}

export interface NombreEspecialidadDTO {
  idEspecialidad: number;
  nombreEspecialidad: string;
}

export interface MensajeResponseResumen {
  mensaje: string;
  object: NombreEspecialidadDTO[];
}
