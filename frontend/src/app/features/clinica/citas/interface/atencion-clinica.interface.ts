import { Cita } from './cita.interface';
import { Indicacion } from './indicacion.interface';
import { ExamenSolicitado } from './examen-solicitado.interface';
export * from './tratamiento.interface';
export * from './examen-solicitado.interface';

export interface Diagnostico {
  id: number;
  idCitaMedica: number;
  codigo: string;
  descripcion: string;
  tipoDiagnostico: number;
  observaciones: string;
  fecDiagnostico: string;
  estado: number;
}

export interface Tratamiento {
  id: number;
  idDiagnostico: number;
  nombreMedicamento: string;
  dosis: string;
  viaAdministracion: string;
  frecuencia: string;
  duracionDias: number;
  totCantidad: number;
  descIndicacion: string;
  estado: number;
}

export interface Derivacion {
  id: number;
  codigo: string;
  idDiagnostico: number;
  idEspecialidad: number;
  nombreEspecialidad: string;
  motivo: string;
  urgencia: number;
  estado: number;
}

export interface DiagnosticoDetalle {
  diagnostico: Diagnostico;
  tratamientos: Tratamiento[];
  indicaciones: Indicacion[];
  examenesSolicitados: ExamenSolicitado[];
  derivaciones: Derivacion[];
}

export interface AtencionClinica {
  cita: Cita;
  diagnosticos: DiagnosticoDetalle[];
}

export interface DiagnosticoCrearDTO {
  codigo: string;
  descripcion: string;
  tipoDiagnostico: number;
  observaciones: string;
}
export type DerivacionActualizarDTO = DerivacionCrearDTO;
export interface DerivacionCrearDTO {
  idEspecialidad: number;
  motivo: string;
  urgencia: number;
}
