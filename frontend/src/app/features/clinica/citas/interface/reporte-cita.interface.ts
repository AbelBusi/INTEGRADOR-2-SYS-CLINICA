import { CitaFila } from './cita.interface';

export type ClaveEstadoReporte = 'programadas' | 'atendidas' | 'canceladas' | 'reprogramadas';

export type GranularidadReporte = 'dia' | 'mes';

export type FormatoReporte = 'pdf' | 'csv';

export type RangoRapido = 'hoy' | 'semana' | 'mes' | 'mes_anterior' | 'todo' | 'personalizado';

export interface ConteoEstados {
  programadas: number;
  atendidas: number;
  canceladas: number;
  reprogramadas: number;
  total: number;
}

export interface FiltroReporteCita {
  desde: string;
  hasta: string;
  idMedico: number | 'todos';
  estado: number | 'todos';
}

export interface SerieEstado {
  clave: ClaveEstadoReporte;
  estado: number;
  texto: string;
  color: string;
}

export interface OpcionMedicoReporte {
  idMedico: number;
  medico: string;
}

export interface FilaMedicoReporte {
  idMedico: number;
  medico: string;
  conteo: ConteoEstados;
  tasaAtencion: string;
}

export interface PuntoReporte {
  clave: string;
  etiqueta: string;
  conteo: ConteoEstados;
}

export interface TarjetaReporte {
  clave: string;
  texto: string;
  valor: number;
  detalle: string;
  color: string;
}

export interface SegmentoGrafico {
  valor: number;
  color: string;
  texto: string;
}

export interface FilaGrafico {
  clave: string;
  etiqueta: string;
  segmentos: SegmentoGrafico[];
  total: number;
  detalle: string;
}

export interface ReporteCitas {
  filtro: FiltroReporteCita;
  citas: CitaFila[];
  pendientes: ReadonlySet<number>;
  conteo: ConteoEstados;
  sinRegularizar: number;
  porMedico: FilaMedicoReporte[];
  porTiempo: PuntoReporte[];
  granularidad: GranularidadReporte;
  porDiaSemana: PuntoReporte[];
  periodoTexto: string;
  medicoTexto: string;
  estadoTexto: string;
}

export interface OpcionesExportacionReporte {
  graficos: boolean;
  detalle: boolean;
}
