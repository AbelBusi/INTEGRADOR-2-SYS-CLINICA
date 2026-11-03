export interface RolPerfil {
  idRol: number;
  nombre: string;
  descripcion: string | null;
}

export interface DatoPerfil {
  etiqueta: string;
  valor: string;
}

export interface Perfil {
  nombres: string;
  apellidos: string;
  tipoDocumento: string | null;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: string;
  nacionalidad: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string;
  usuario: string;
  estado: number;
  roles: RolPerfil[];
  datosAdicionales: DatoPerfil[];
}

export interface ActualizarContactoDTO {
  telefono: string;
  direccion: string;
}

export interface CambiarClavePerfilDTO {
  claveActual: string;
  nuevaClave: string;
  confirmacionClave: string;
}

export interface MensajeObjeto<T> {
  mensaje: string;
  object: T;
}
