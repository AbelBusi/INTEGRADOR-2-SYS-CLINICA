export interface InicioSolicitud {
  usuario: string;
  claveAcceso: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}
