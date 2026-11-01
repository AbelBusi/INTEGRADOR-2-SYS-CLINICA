export interface ExamenSolicitado {
  id: number;
  nombreExamen: string;
  tipoExamen: string;
  motivo: string;
  indicaciones: string | null;
  prioridad: string;
  requiereAyuno: boolean;
  fechaSolicitud: string;
  observacion: string | null;
}

export interface ExamenSolicitadoCrearDTO {
  nombreExamen: string;
  tipoExamen: string;
  motivo: string;
  indicaciones: string;
  prioridad: string;
  requiereAyuno: boolean;
  observacion: string;
}

export type ExamenSolicitadoActualizarDTO = ExamenSolicitadoCrearDTO;
