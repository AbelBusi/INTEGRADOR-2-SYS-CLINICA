export interface DoctorActual {
  id: number;
  cpm: string;
  nombre: string;
  apellidos: string;
  especialidad: string;
  genero: string;
  estado: number;
}

export interface DoctorCita {
  citaId: number;
  pacienteId: number;
  dni: string;
  nombrePaciente: string;
  motivo: string;
  especialidad: string;
  fecha: string;
  horaInicio: string;
  horaSalida: string;
  estado: number;
}

export interface PacienteDoctor {
  id: number;
  dni: string;
  nombre: string;
  apellidos: string;
}

export interface Atencion {
  id: number;
  citaId: number;
  fechaAtencion: string;
  doctor: string;
  especialidad: string;
  motivo: string;
  diagnostico: string;
  observaciones: string;
  tratamiento: string;
  recomendaciones: string;
}

export interface AtencionCrear {
  diagnostico: string;
  observaciones: string;
  tratamiento: string;
  recomendaciones: string;
}
