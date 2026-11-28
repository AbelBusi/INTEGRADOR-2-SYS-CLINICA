export interface ExamenMedico {
  id: number;
  nombre: string;
  tipoExamen: string;
  descripcion?: string | null;
  estado: number;
}

export interface ExamenMedicoCrearDTO {
  nombre: string;
  tipoExamen: string;
  descripcion?: string | null;
}

export type ExamenMedicoActualizarDTO = ExamenMedicoCrearDTO;

export interface ExamenMedicoResponse {
  mensaje: string;
  object: ExamenMedico[];
}

export interface ExamenMedicoResponseSingle {
  mensaje: string;
  object: ExamenMedico;
}

export interface ExamenMedicoBusqueda {
  id: number;
  nombre: string;
  tipoExamen: string;
}

export interface ExamenMedicoBusquedaResponse {
  mensaje: string;
  object: ExamenMedicoBusqueda[];
}

export const TIPOS_EXAMEN: string[] = [
  'Laboratorio',
  'Imagenología',
  'Cardiológico',
  'Endoscópico',
  'Anatomía patológica',
  'Función respiratoria',
  'Neurofisiológico',
  'Otro',
];
