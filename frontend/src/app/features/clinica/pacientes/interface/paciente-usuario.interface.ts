export interface PacienteUsuarioEstado {
  idPaciente: number;
  idPersona: number;
  tieneCorreo: boolean;
  tieneUsuario: boolean;
}

export interface UsuarioRegistrado {
  id: number;
  usuario: string;
  correoEnmascarado: string;
}
