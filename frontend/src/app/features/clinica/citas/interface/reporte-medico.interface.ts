import { CitaFila } from './cita.interface';

export type ClaveReportePortal =
  'agenda' | 'calendario' | 'pendientes' | 'productividad' | 'actividad' | 'pacientes' | 'horario';

export interface DefinicionReportePortal {
  clave: ClaveReportePortal;
  titulo: string;
  descripcion: string;
  icono: string;
  grupo: string;
}

export interface GrupoReportePortal {
  titulo: string;
  items: DefinicionReportePortal[];
}

export type MarcaAgenda = 'en_curso' | 'siguiente' | 'sin_regularizar';

export interface ResumenPuntualidad {
  conRegistro: number;
  puntuales: number;
  promedio: number;
}

export interface TramoMedico {
  id: number;
  diaSemana: number;
  entrada: string;
  salida: string;
  entradaMin: number;
  salidaMin: number;
  inicio: string;
  fin: string;
}

export interface ResumenDiaMedico {
  fecha: Date;
  iso: string;
  delMes: boolean;
  esHoy: boolean;
  tramos: TramoMedico[];
  citas: CitaFila[];
  minutosDisponibles: number;
  minutosCita: number;
}

export interface TotalesCalendario {
  disponibles: number;
  ocupados: number;
  citas: number;
  diasAtencion: number;
  ocupacion: number;
}

export interface BloqueHorarioVista {
  id: number;
  top: number;
  alto: number;
  texto: string;
}

export interface BloqueCitaVista {
  cita: CitaFila;
  top: number;
  alto: number;
  color: string;
}

export interface ColumnaSemanaMedico {
  resumen: ResumenDiaMedico;
  dia: { numero: number; corto: string; largo: string };
  horarios: BloqueHorarioVista[];
  citas: BloqueCitaVista[];
}

export interface ConteoEtiquetado {
  clave: string;
  etiqueta: string;
  detalle: string;
  total: number;
}

export interface ResumenActividadClinica {
  atenciones: number;
  diagnosticos: number;
  diagnosticosDistintos: number;
  tratamientos: number;
  indicaciones: number;
  examenes: number;
  derivaciones: number;
  conDerivacion: number;
  topDiagnosticos: ConteoEtiquetado[];
  tiposDiagnostico: ConteoEtiquetado[];
  topMedicamentos: ConteoEtiquetado[];
  topExamenes: ConteoEtiquetado[];
  topEspecialidades: ConteoEtiquetado[];
  urgencias: ConteoEtiquetado[];
}
