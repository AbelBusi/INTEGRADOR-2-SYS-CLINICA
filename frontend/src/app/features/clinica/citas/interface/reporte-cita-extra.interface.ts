import { CitaFila } from './cita.interface';
import {
  ConteoEstados,
  FilaGrafico,
  PuntoReporte,
  RangoRapido,
  TarjetaReporte,
} from './reporte-cita.interface';

export type ClaveReporte = 'general' | 'medico' | 'paciente' | 'horario' | 'pendientes' | 'agenda';

export interface DefinicionReporte {
  clave: ClaveReporte;
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface CambioRango {
  rango: RangoRapido;
  desde: string;
  hasta: string;
}

export interface MapaCalor {
  filas: string[];
  columnas: string[];
  valores: number[][];
  maximo: number;
}

export interface SeccionBarras {
  tipo: 'barras';
  titulo: string;
  filas: FilaGrafico[];
  leyenda: boolean;
  nota?: string;
}

export interface SeccionColumnas {
  tipo: 'columnas';
  titulo: string;
  puntos: PuntoReporte[];
}

export interface SeccionMapa {
  tipo: 'mapa';
  titulo: string;
  mapa: MapaCalor;
  nota?: string;
}

export interface SeccionTabla {
  tipo: 'tabla';
  titulo: string;
  cabecera: string[];
  filas: string[][];
  pesos: number[];
  centradas: number[];
  pie?: string[];
  nota?: string;
}

export type SeccionReporte = SeccionBarras | SeccionColumnas | SeccionMapa | SeccionTabla;

export interface DatosCsv {
  cabecera: string[];
  filas: string[][];
}

export interface DocumentoReporte {
  titulo: string;
  archivo: string;
  periodo: string;
  filtros: string[];
  tarjetas: TarjetaReporte[];
  secciones: SeccionReporte[];
  csv: DatosCsv;
}

export interface FilaPacienteReporte {
  idPaciente: number;
  paciente: string;
  conteo: ConteoEstados;
  ultimaFecha: string;
}

export interface FilaPendienteReporte {
  cita: CitaFila;
  diasAtraso: number;
  limite: Date;
  restanteTexto: string;
  urgente: boolean;
}
