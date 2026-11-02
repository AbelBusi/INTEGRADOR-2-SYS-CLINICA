export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  estado: number;
}

export interface RolCrearDTO {
  nombre: string;
  descripcion: string;
  estado: number;
}

export interface RolActualizarDTO {
  nombre: string;
  descripcion: string;
  estado: number;
}
