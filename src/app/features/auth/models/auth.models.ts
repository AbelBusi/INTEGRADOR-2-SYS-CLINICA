export interface InicioSolicitud {
  usuario: string;
  claveAcceso: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface Perfil {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface LoginResponse {
  sesion?: TokenResponse;
  requiere_seleccion_rol: boolean;
  token_seleccion?: string;
  perfiles?: Perfil[];
}

export interface SeleccionarRolSolicitud {
  tokenSeleccion: string;
  idRol: number;
}
