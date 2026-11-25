/**
 * Modelos TypeScript del módulo Historias Clínicas.
 * Reflejan 1:1 los DTO del backend (com.salud.consultorio.dto.historiaClinica).
 *
 * Convenciones de serialización de Jackson:
 *  - LocalDate      -> 'yyyy-MM-dd'
 *  - LocalTime      -> 'HH:mm:ss'
 *  - LocalDateTime  -> 'yyyy-MM-ddTHH:mm:ss'
 */

export type GrupoSanguineo = 'A' | 'B' | 'AB' | 'O';
export type FactorRh = 'POSITIVO' | 'NEGATIVO';

export type TipoAntecedentePersonal =
  'ENFERMEDAD_PREVIA' | 'ENFERMEDAD_CRONICA' | 'QUIRURGICO' | 'HOSPITALIZACION' | 'OTRO';

export type TipoAntecedenteFamiliar = 'ENFERMEDAD_HEREDITARIA' | 'ANTECEDENTE_RELEVANTE';

export type Parentesco = 'PADRE' | 'MADRE' | 'HERMANO' | 'ABUELO' | 'TIO' | 'OTRO';

export type TipoAlergia = 'MEDICAMENTOSA' | 'ALIMENTARIA' | 'AMBIENTAL' | 'CONTACTO' | 'OTRA';

export interface Pagina<T> {
  contenido: T[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
}

/* ------------------------------ Historia ------------------------------ */

export interface PacienteHistoria {
  idPaciente: number;
  nombreCompleto: string;
  numeroDocumento: string;
  fechaNacimiento: string | null;
  genero: string | null;
}

export interface AntecedentePersonal {
  id: number;
  tipo: TipoAntecedentePersonal;
  descripcion: string;
  anio: number | null;
  observacion: string | null;
  fechaActualizacion: string;
}

export interface AntecedenteFamiliar {
  id: number;
  tipo: TipoAntecedenteFamiliar;
  parentesco: Parentesco | null;
  descripcion: string;
  observacion: string | null;
  fechaActualizacion: string;
}

export interface Alergia {
  id: number;
  sustancia: string;
  tipoAlergia: TipoAlergia;
  reaccion: string | null;
  observacion: string | null;
  fechaActualizacion: string;
}

export interface HistoriaClinica {
  id: number;
  numeroHistoria: string;
  paciente: PacienteHistoria;
  grupoSanguineo: GrupoSanguineo | null;
  factorRh: FactorRh | null;
  observaciones: string | null;
  fechaCreacion: string;
  fechaActualizacion: string | null;
  antecedentesPersonales: AntecedentePersonal[];
  antecedentesFamiliares: AntecedenteFamiliar[];
  alergias: Alergia[];
  /** Control de concurrencia: se reenvía al actualizar los datos generales. */
  version: number;
}

/**
 * Fila del listado principal.
 * NO existe todavía en el backend: ver backend/LISTADO_HISTORIAS.md.
 */
export interface HistoriaClinicaResumen {
  id: number;
  numeroHistoria: string;
  idPaciente: number;
  nombreCompleto: string;
  numeroDocumento: string;
  grupoSanguineo: GrupoSanguineo | null;
  factorRh: FactorRh | null;
  fechaCreacion: string;
  fechaActualizacion: string | null;
}

/* ------------------------------ Escritura ------------------------------ */

export interface HistoriaClinicaCrear {
  idPaciente: number;
  grupoSanguineo: GrupoSanguineo | null;
  factorRh: FactorRh | null;
  observaciones: string | null;
}

/** Campos null = sin cambio. observaciones '' = limpiar el campo. */
export interface HistoriaClinicaActualizar {
  grupoSanguineo: GrupoSanguineo | null;
  factorRh: FactorRh | null;
  observaciones: string | null;
  version: number;
}

export interface AntecedentePersonalGuardar {
  tipo: TipoAntecedentePersonal;
  descripcion: string;
  anio: number | null;
  observacion: string | null;
}

export interface AntecedenteFamiliarGuardar {
  tipo: TipoAntecedenteFamiliar;
  parentesco: Parentesco | null;
  descripcion: string;
  observacion: string | null;
}

export interface AlergiaGuardar {
  sustancia: string;
  tipoAlergia: TipoAlergia;
  reaccion: string | null;
  observacion: string | null;
}

/* ------------------------- Atenciones (solo lectura) ------------------------- */

export interface TratamientoAtencion {
  id: number;
  nombreMedicamento: string;
  dosis: string | null;
  viaAdministracion: string | null;
  frecuencia: string | null;
  duracionDias: number | null;
  cantidadTotal: number | null;
  indicacion: string | null;
}

export interface IndicacionAtencion {
  id: number;
  tipoIndicacion: string;
  descripcion: string | null;
  diasReposo: number | null;
  frecuencia: string | null;
}

export interface DerivacionAtencion {
  id: number;
  codigo: string;
  especialidad: string;
  motivo: string | null;
  urgencia: number | null;
  fechaDerivacion: string | null;
}

export interface DiagnosticoAtencion {
  id: number;
  codigo: string;
  descripcion: string;
  tipoDiagnostico: number | null;
  observaciones: string | null;
  fechaDiagnostico: string | null;
  tratamientos: TratamientoAtencion[];
  indicaciones: IndicacionAtencion[];
  derivaciones: DerivacionAtencion[];
}

export interface AtencionHistoria {
  idCita: number;
  fechaCita: string;
  horaInicio: string | null;
  horaSalida: string | null;
  inicioAtencion: string | null;
  finAtencion: string | null;
  idMedico: number;
  medico: string;
  especialidad: string;
  motivo: string | null;
  diagnosticos: DiagnosticoAtencion[];
}

/* ------------------------------ Auditoría (solo lectura) ------------------------------ */

export type EntidadAuditoriaHC =
  'HISTORIA_CLINICA' | 'ANTECEDENTE_PERSONAL' | 'ANTECEDENTE_FAMILIAR' | 'ALERGIA';

export type OperacionAuditoriaHC = 'CREACION' | 'MODIFICACION' | 'ELIMINACION';

export interface AuditoriaHistoria {
  id: number;
  entidad: EntidadAuditoriaHC;
  idRegistro: number;
  operacion: OperacionAuditoriaHC;
  /** Nombre completo de quien realizó el cambio. */
  usuario: string;
  fechaEvento: string;
  /** En una modificación solo vienen los campos que cambiaron. */
  datosAnteriores: Record<string, unknown> | null;
  datosNuevos: Record<string, unknown> | null;
}
