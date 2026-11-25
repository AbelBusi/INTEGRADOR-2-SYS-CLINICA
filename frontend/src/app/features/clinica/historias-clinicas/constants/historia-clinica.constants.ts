import {
  FactorRh,
  GrupoSanguineo,
  Parentesco,
  TipoAlergia,
  TipoAntecedenteFamiliar,
  TipoAntecedentePersonal,
} from '../interface/historia-clinica.interface';

/* ------------------------------ Opciones de listas ------------------------------ */

export interface OpcionLista<T extends string> {
  valor: T;
  texto: string;
}

export const OPCIONES_GRUPO_SANGUINEO: OpcionLista<GrupoSanguineo>[] = [
  { valor: 'A', texto: 'A' },
  { valor: 'B', texto: 'B' },
  { valor: 'AB', texto: 'AB' },
  { valor: 'O', texto: 'O' },
];

export const OPCIONES_FACTOR_RH: OpcionLista<FactorRh>[] = [
  { valor: 'POSITIVO', texto: 'Positivo (+)' },
  { valor: 'NEGATIVO', texto: 'Negativo (-)' },
];

export const OPCIONES_TIPO_ANTECEDENTE_PERSONAL: OpcionLista<TipoAntecedentePersonal>[] = [
  { valor: 'ENFERMEDAD_PREVIA', texto: 'Enfermedad previa' },
  { valor: 'ENFERMEDAD_CRONICA', texto: 'Enfermedad crónica' },
  { valor: 'QUIRURGICO', texto: 'Antecedente quirúrgico' },
  { valor: 'HOSPITALIZACION', texto: 'Hospitalización' },
  { valor: 'OTRO', texto: 'Otro antecedente' },
];

export const OPCIONES_TIPO_ANTECEDENTE_FAMILIAR: OpcionLista<TipoAntecedenteFamiliar>[] = [
  { valor: 'ENFERMEDAD_HEREDITARIA', texto: 'Enfermedad hereditaria' },
  { valor: 'ANTECEDENTE_RELEVANTE', texto: 'Antecedente relevante' },
];

export const OPCIONES_PARENTESCO: OpcionLista<Parentesco>[] = [
  { valor: 'PADRE', texto: 'Padre' },
  { valor: 'MADRE', texto: 'Madre' },
  { valor: 'HERMANO', texto: 'Hermano/a' },
  { valor: 'ABUELO', texto: 'Abuelo/a' },
  { valor: 'TIO', texto: 'Tío/a' },
  { valor: 'OTRO', texto: 'Otro' },
];

export const OPCIONES_TIPO_ALERGIA: OpcionLista<TipoAlergia>[] = [
  { valor: 'MEDICAMENTOSA', texto: 'Medicamentosa' },
  { valor: 'ALIMENTARIA', texto: 'Alimentaria' },
  { valor: 'AMBIENTAL', texto: 'Ambiental' },
  { valor: 'CONTACTO', texto: 'Por contacto' },
  { valor: 'OTRA', texto: 'Otra' },
];

/* ------------------------------ Códigos numéricos de atención ------------------------------ */
/**
 * ASUMIDO: el backend entrega tipoDiagnostico y urgencia como enteros sin enum.
 * Ajustar estos mapas a los valores reales. Si llega un código desconocido se muestra "Tipo N" / "Nivel N".
 */
export const TIPO_DIAGNOSTICO: Record<number, string> = {
  1: 'Presuntivo',
  2: 'Definitivo',
  3: 'Repetitivo',
};

export const URGENCIA_DERIVACION: Record<number, string> = {
  1: 'Baja',
  2: 'Media',
  3: 'Alta',
};

export const INSTITUCION_NOMBRE = 'Centro de Salud Especializado José Olaya Balandra';

/* ------------------------------ Títulos de grupo del panel del paciente ------------------------------ */

export const GRUPOS_ANTECEDENTE_PERSONAL: OpcionLista<TipoAntecedentePersonal>[] = [
  { valor: 'ENFERMEDAD_PREVIA', texto: 'Enfermedades previas' },
  { valor: 'ENFERMEDAD_CRONICA', texto: 'Enfermedades crónicas' },
  { valor: 'QUIRURGICO', texto: 'Antecedentes quirúrgicos' },
  { valor: 'HOSPITALIZACION', texto: 'Hospitalizaciones' },
  { valor: 'OTRO', texto: 'Otros antecedentes' },
];

export const GRUPOS_ANTECEDENTE_FAMILIAR: OpcionLista<TipoAntecedenteFamiliar>[] = [
  { valor: 'ENFERMEDAD_HEREDITARIA', texto: 'Enfermedades hereditarias' },
  { valor: 'ANTECEDENTE_RELEVANTE', texto: 'Antecedentes familiares relevantes' },
];
