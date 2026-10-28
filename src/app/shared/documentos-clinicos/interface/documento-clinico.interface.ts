import type { jsPDF } from 'jspdf';
import type { UserOptions } from 'jspdf-autotable';

import { AtencionClinica } from '../../../features/clinica/citas/interface/atencion-clinica.interface';
import { CitaFila } from '../../../features/clinica/citas/interface/cita.interface';

export type AutoTable = (doc: jsPDF, opciones: UserOptions) => void;

export type TipoDocumentoClinico =
  'resumen' | 'diagnostico' | 'tratamientos' | 'indicaciones' | 'examenes' | 'derivaciones';

export type FormatoDocumento = 'a4' | 'ticket';

export type AnchoTicket = 58 | 80;

export interface DefinicionDocumento {
  tipo: TipoDocumentoClinico;
  titulo: string;
  tituloPdf: string;
  descripcion: string;
  icono: string;
  prefijo: string;
  admiteTicket: boolean;
}

export interface DocumentoDisponible extends DefinicionDocumento {
  disponible: boolean;
  cantidad: number;
  motivoNoDisponible: string;
}

export interface Establecimiento {
  entidad: string;
  nombre: string;
  logoUrl: string;
  codigoIpress: string;
  direccion: string;
  telefono: string;
  correo: string;
  ruc: string;
  marcaDeAgua: boolean;
}

export interface DatosPaciente {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  edad: string;
  genero: string;
  codigoAsegurado: string;
  entidadAsegurado: string;
}

export interface DatosMedico {
  nombreCompleto: string;
  especialidad: string;
  numeroColegiatura: string;
  numeroEspecialidad: string;
  consejoRegional: string;
}

export interface ContextoClinico {
  cita: CitaFila;
  atencion: AtencionClinica;
  paciente: DatosPaciente;
  medico: DatosMedico;
  numeroAtencion: string;
  emitidoEn: Date;
}

export interface ColumnaContenido {
  cabecera: string;
  peso: number;
  titulo?: boolean;
}

export interface GrupoContenido {
  encabezado: string | null;
  columnas: ColumnaContenido[];
  filas: string[][];
}

export interface ContenidoDocumento {
  definicion: DefinicionDocumento;
  numero: string;
  grupos: GrupoContenido[];
  nota: string | null;
}

export interface ParDato {
  etiqueta: string;
  valor: string;
}

export interface DatosIdentificacion {
  paciente: ParDato[];
  atencion: ParDato[];
  motivo: string;
}

export interface ImagenPdf {
  dataUrl: string;
  formato: 'PNG' | 'JPEG';
  ancho: number;
  alto: number;
}

export interface OpcionesGeneracion {
  tipos: TipoDocumentoClinico[];
  formato: FormatoDocumento;
  anchoTicket: AnchoTicket;
  consolidado: boolean;
}

export interface ArchivoGenerado {
  clave: string;
  etiqueta: string;
  nombre: string;
  blob: Blob;
  url: string;
}
