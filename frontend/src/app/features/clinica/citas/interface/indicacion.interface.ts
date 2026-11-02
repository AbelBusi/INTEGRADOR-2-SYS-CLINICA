export interface Indicacion {
  id: number;
  tipoIndicacion: string;
  descripcion: string;
  diasReposo: number;
  frecuencia: string;
}

export interface IndicacionCrearDTO {
  tipoIndicacion: string;
  descripcion: string;
  diasReposo: number;
  frecuencia: string;
}

export type IndicacionActualizarDTO = IndicacionCrearDTO;

export interface IndicacionMensajeResponse {
  mensaje: string;
  object?: Indicacion;
}
