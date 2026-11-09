import { Cita } from './cita.interface';

export interface CitaFiltros {
  paciente?: string;
  numeroDocumento?: string;
  fecha?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  turno?: 'MANANA' | 'TARDE' | '';
  horaDesde?: string;
  horaHasta?: string;
  diaSemana?: number | null;
  estado?: number[];
  enAtencion?: boolean;
  idEspecialidad?: number | null;
  idMedico?: number | null;
  registradoPor?: string;
  registroPresencial?: boolean | null;
}

export interface PaginaCitas {
  contenido: Cita[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
}

export const DIAS_SEMANA = [
  { valor: 1, texto: 'Lunes' },
  { valor: 2, texto: 'Martes' },
  { valor: 3, texto: 'Miércoles' },
  { valor: 4, texto: 'Jueves' },
  { valor: 5, texto: 'Viernes' },
  { valor: 6, texto: 'Sábado' },
  { valor: 7, texto: 'Domingo' },
];
