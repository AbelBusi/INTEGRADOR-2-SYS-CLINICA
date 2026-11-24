export interface DescansoMedicoDatosBase {
  pacienteNombre: string;
  pacienteDocumento: string;
  medicoNombre: string;
  especialidad: string;
  numeroColegiatura: string | null;
  fechaAtencion: string;
}

export interface DescansoMedico {
  id: number;
  numero: string;
  codigoDocumento: string;
  datos: DescansoMedicoDatosBase;
  fechaInicio: string;
  fechaFin: string;
  dias: number;
  justificacion: string;
  fechaEmision: string;
  metodoConfirmacion: string;
  fechaConfirmacion: string;
  tipoFirma: string;
  algoritmoFirma: string;
  firma: string;
  hashContenido: string;
}

export interface DescansoMedicoContexto {
  descanso: DescansoMedico | null;
  datos: DescansoMedicoDatosBase;
  puedeEmitir: boolean;
  motivoBloqueo: string | null;
  venceEmision: string | null;
}

export interface DescansoMedicoCrear {
  fechaInicio: string;
  fechaFin: string;
  dias: number;
  justificacion: string;
  codigoVerificacion: string;
}

export interface ErroresDescanso {
  fechaInicio?: string;
  fechaFin?: string;
  dias?: string;
  justificacion?: string;
}
