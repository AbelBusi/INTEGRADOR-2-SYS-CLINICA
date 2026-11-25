export type EstadoDescanso = 'VIGENTE' | 'CANCELADO';

export interface DescansoMedicoDatosBase {
  pacienteNombre: string;
  pacienteDocumento: string;
  medicoNombre: string;
  especialidad: string;
  numeroColegiatura: string | null;
  fechaAtencion: string;
}

export interface CancelacionDescanso {
  fechaCancelacion: string;
  motivo: string;
  canceladoPor: string;
}

export interface DescansoMedico {
  id: number;
  idCita: number;
  estado: EstadoDescanso;
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
  cancelacion: CancelacionDescanso | null;
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

export interface DescansoMedicoCancelar {
  motivo: string;
  codigoVerificacion: string;
}

export type ResultadoAuditoria = 'EMITIDO' | 'CODIGO_INVALIDO' | 'CANCELADO';

export interface EventoAuditoriaDescanso {
  id: number;
  resultado: ResultadoAuditoria;
  fechaEvento: string;
  realizadoPor: string;
  ipOrigen: string | null;
  codigoDocumento: string | null;
  hashContenido: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  dias: number | null;
  justificacion: string | null;
  observacion: string | null;
}

export interface DescansoMedicoHistorial {
  descanso: DescansoMedico;
  eventos: EventoAuditoriaDescanso[];
}

export interface ErroresDescanso {
  fechaInicio?: string;
  fechaFin?: string;
  dias?: string;
  justificacion?: string;
}
