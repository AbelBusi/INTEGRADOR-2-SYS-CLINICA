export interface PacienteInterface {
  id: number;
  dni: string;
  paciente: string;
  genero: string;
  telefono: string;
  entidadAseguradora: string;
  estado: number;
}

export interface PersonaLeerDTO {
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

export interface PacienteDetalleLeerDTO {
  id: number;
  persona: PersonaLeerDTO;
  entidadAseguradora: string;
  codigoAseguradora: string;
  estado: number;
}

export interface PersonaActualizarDTO {
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  nacionalidad: string;
  correo: string;
  estado: number;
}

export interface PacienteActualizarDTO {
  entidadAseguradora: string;
  codigoAseguradora: string;
  estado: number;
  persona: PersonaActualizarDTO;
}

export interface PersonaCrearDTO {
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  nacionalidad: string;
  correo: string;
  estado: number;
}

export interface PacienteCrearDTO {
  entidadAseguradora: string;
  codigoAseguradora: string;
  estado: number;
  persona: PersonaCrearDTO;
}

export interface PacienteMensajeResponse {
  mensaje: string;
  object: PacienteDetalleLeerDTO;
}

export interface PacienteResumenDTO {
  idPaciente: number;
  nombrePaciente: string;
}
