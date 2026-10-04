export interface PacienteCita {
  citaId: number;
  doctor: string;
  especialidad: string;
  fecha: string;
  horaInicio: string;
  horaSalida: string;
  estado: number;
  recepcionista: string;
}

export interface PersonaPaciente {
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

export interface PacienteActual {
  id: number;
  persona: PersonaPaciente;
  entidadAseguradora: string;
  codigoAseguradora: string;
  estado: number;
}
