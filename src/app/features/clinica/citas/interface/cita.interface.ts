export interface CitaMedicaLeer {
  id: number;
  nombrePaciente: string;
  apellidosPaciente: string;
  motivoConsulta: string;
  especialidad: string;
  diaConsulta: string;
  horaInicio: string;
  horaSalida: string;
  nombreDoctor: string;
  estado: number;
}

export interface MensajeResponse {
  mensaje: string;
  object: CitaMedicaLeer | CitaMedicaLeer[];
}

export interface CitaMedicaRefDTO {
  id: number;
}

export interface CitaMedicaCrearDTO {
  recepcionista: CitaMedicaRefDTO;
  paciente: CitaMedicaRefDTO;
  doctor: CitaMedicaRefDTO;
  especialidad: CitaMedicaRefDTO;
  motivo: string;
  fecha: string;
  horaInicio: string;
  horaSalida: string;
  costo: number;
  estado: number;
}

export interface CitaMedicaActualizarDTO {
  recepcionista: { id: number };
  paciente: { id: number };
  doctor: { id: number };
  especialidad: { id: number };
  motivo: string;
  fecha: string; // LocalDate → "YYYY-MM-DD"
  horaInicio: string; // LocalTime → "HH:mm"
  horaSalida: string; // LocalTime → "HH:mm"
  costo: number;
  estado: number;
}

export interface CitaMedicaResumenDTO {
  id: number;
  nombrePaciente: string;
  apellidosPaciente: string;
  motivoConsulta: string;
  especialidad: string;
  nombreDoctor: string;
  diaConsulta: string; // "YYYY-MM-DD"
  horaInicio: string; // "HH:mm"
  horaSalida: string; // "HH:mm"
  costo: number;
  estado: number;

  // IDs necesarios para pre-llenar el modal de edición
  recepcionistaId?: number;
  pacienteId?: number;
  especialidadId?: number;
  doctorId?: number;
}
