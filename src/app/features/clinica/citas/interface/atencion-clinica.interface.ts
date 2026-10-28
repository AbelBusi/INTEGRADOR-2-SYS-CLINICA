import { Cita } from './cita.interface';

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

export interface Indicacion {
  id: number;
  idDiagnostico: number;
  tipoIndicacion: string;
  descripcion: string;
  diasReposo: number;
  frecuencia: string;
  estado: number;
}

export interface ExamenSolicitado {
  id: number;
  idDiagnostico: number;
  motivo: string;
  estado: number;
}

export interface Derivacion {
  id: number;
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

export interface TratamientoCrearDTO {
  nombreMedicamento: string;
  dosis: string;
  viaAdministracion: string;
  frecuencia: string;
  duracionDias: number;
  totCantidad: number;
  descIndicacion: string;
}

export interface IndicacionCrearDTO {
  tipoIndicacion: string;
  descripcion: string;
  diasReposo: number;
  frecuencia: string;
}

export interface ExamenSolicitadoCrearDTO {
  motivo: string;
}

export interface DerivacionCrearDTO {
  idEspecialidad: number;
  motivo: string;
  urgencia: number;
}
