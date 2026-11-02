export interface DerivacionCita {
  id: number;
  codigo: string;
  idDiagnostico: number;
  codigoDiagnostico: string;
  idPaciente: number;
  pacienteNombre: string;
  pacienteDocumento: string;
  idEspecialidad: number;
  especialidadNombre: string;
  medicoSolicitante: string;
  fechaDerivacion: string;
  urgencia: number;
  estado: number;
  motivo: string;
  idCitaMedica: number | null;
}
