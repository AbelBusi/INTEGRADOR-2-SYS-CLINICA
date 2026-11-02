export interface Tratamiento {
  id: number;
  nombreMedicamento: string;
  dosis: string;
  viaAdministracion: string;
  frecuencia: string;
  duracionDias: number;
  totCantidad: number;
  descIndicacion: string;
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

export type TratamientoActualizarDTO = TratamientoCrearDTO;
