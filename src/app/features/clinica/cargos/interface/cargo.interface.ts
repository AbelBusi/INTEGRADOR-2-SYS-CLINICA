export interface cargo {
  id: number;
  nombre: string;
  descripcion: string;
  estado: number;
}

export interface CargoCrearDTO {
  nombre: string;
  descripcion: string;
}

export interface MensajeResponse {
  mensaje: string;
  object: cargo[];
}

export interface MensajeResponseSingle {
  mensaje: string;
  object: cargo;
}

export interface CargoActualizarDTO {
  nombre: string;
  descripcion: string;
}
