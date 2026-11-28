export type GrupoTerapeutico =
  | 'ANALGESICO_ANTIPIRETICO'
  | 'AINE'
  | 'ANTIBIOTICO'
  | 'ANTIHISTAMINICO'
  | 'ANTIHIPERTENSIVO'
  | 'ANTIDIABETICO'
  | 'ANTIULCEROSO'
  | 'ANTIESPASMODICO'
  | 'ANTIDIARREICO'
  | 'ANTITUSIVO'
  | 'BRONCODILATADOR'
  | 'CORTICOIDE'
  | 'ANTIFUNGICO'
  | 'ANTIPARASITARIO'
  | 'ANTIVIRAL'
  | 'ANSIOLITICO'
  | 'ANTICONVULSIVANTE'
  | 'VITAMINA_SUPLEMENTO'
  | 'HORMONAL'
  | 'ANESTESICO_LOCAL'
  | 'ANTISEPTICO'
  | 'HIPOLIPEMIANTE'
  | 'DIURETICO'
  | 'ANTICOAGULANTE'
  | 'DESCONGESTIONANTE_NASAL'
  | 'OTRO';

export type IndicacionTerapeutica =
  | 'ALIVIO_DOLOR_FIEBRE'
  | 'ALIVIO_DOLOR_INFLAMACION'
  | 'INFECCIONES_BACTERIANAS'
  | 'ALERGIA'
  | 'PRESION_ARTERIAL'
  | 'DIABETES'
  | 'ACIDEZ_GASTRICA'
  | 'COLICOS_ESPASMOS'
  | 'DIARREA_REHIDRATACION'
  | 'TOS_SECRECIONES'
  | 'DIFICULTAD_RESPIRATORIA'
  | 'INFLAMACION_ALERGIA_SEVERA'
  | 'INFECCIONES_HONGOS'
  | 'PARASITOSIS'
  | 'INFECCIONES_VIRALES'
  | 'ANSIEDAD_SUENO'
  | 'CONVULSIONES'
  | 'DEFICIENCIA_NUTRICIONAL'
  | 'ANTICONCEPCION'
  | 'ANESTESIA_LOCAL'
  | 'DESINFECCION'
  | 'COLESTEROL'
  | 'EDEMAS'
  | 'PREVENCION_COAGULOS'
  | 'CONGESTION_NASAL'
  | 'OTRA';

/** Estado: 0 eliminado, 1 activo, 2 inactivo. */
export interface Medicamento {
  id: number;
  nombre: string;
  principioActivo: string | null;
  concentracion: string | null;
  grupoTerapeutico: GrupoTerapeutico;
  indicacionTerapeutica: IndicacionTerapeutica | null;
  laboratorio: string | null;
  descripcion: string | null;
  requiereReceta: boolean;
  foto: string | null;
  estado: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface MedicamentoGuardar {
  nombre: string;
  principioActivo: string | null;
  concentracion: string | null;
  grupoTerapeutico: GrupoTerapeutico;
  indicacionTerapeutica: IndicacionTerapeutica | null;
  laboratorio: string | null;
  descripcion: string | null;
  requiereReceta: boolean;
  /** Solo al editar: true = quitar la imagen actual. */
  quitarImagen?: boolean;
}

/** Medicamento ya registrado con un nombre parecido al que se escribe. */
export interface MedicamentoSimilar {
  id: number;
  nombre: string;
  concentracion: string | null;
  grupoTerapeutico: GrupoTerapeutico;
  estado: number;
}
