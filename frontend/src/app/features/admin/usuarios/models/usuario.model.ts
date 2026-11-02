export interface PersonaRef {
  id: number;
}

export interface RolRef {
  id: number;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  estado: number;
}

export interface UsuarioLeer {
  id: number;
  nombre: string;
  correo: string;
  usuario: string;
  nombreRol: string;
  estado: number;
  tipo: string;
}

export interface UsuarioCrearDTO {
  persona: PersonaRef;
  rol: RolRef;
  usuario: string;
  claveAcceso: string;
  estado: number;
}

export interface PersonaDetalle {
  id: number;
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  nacionalidad: string;
  correo: string;
}

export interface UsuarioDetalle {
  id: number;
  persona: PersonaDetalle;
  usuario: string;
  nombreRol: string;
  estado: number;
  tipo: string;
}
