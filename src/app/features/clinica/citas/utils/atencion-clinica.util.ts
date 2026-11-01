export interface OpcionCatalogo {
  valor: number;
  texto: string;
}

export const TIPOS_DIAGNOSTICO: OpcionCatalogo[] = [
  { valor: 1, texto: 'Presuntivo' },
  { valor: 2, texto: 'Definitivo' },
  { valor: 3, texto: 'Repetitivo' },
];

export const NIVELES_URGENCIA: OpcionCatalogo[] = [
  { valor: 1, texto: 'Normal' },
  { valor: 2, texto: 'Urgente' },
  { valor: 3, texto: 'Emergencia' },
];

export const VIAS_ADMINISTRACION: string[] = [
  'Oral',
  'Sublingual',
  'Bucal',
  'Tópica',
  'Transdérmica',
  'Inhalatoria',
  'Nasal',
  'Intranasal',
  'Oftálmica',
  'Ótica',
  'Rectal',
  'Vaginal',
  'Intravaginal',
  'Uretral',
  'Intravesical',
  'Intravenosa',
  'Intramuscular',
  'Subcutánea',
  'Intradérmica',
  'Intraarticular',
  'Intratecal',
  'Intraperitoneal',
  'Intracardiaca',
  'Intraósea',
  'Epidural',
  'Intralesional',
  'Intravítrea',
  'Endotraqueal',
  'Intrabursal',
];

export function etiquetaTipoDiagnostico(valor: number): string {
  return TIPOS_DIAGNOSTICO.find((o) => o.valor === valor)?.texto ?? 'Sin tipo';
}

export function etiquetaUrgencia(valor: number): string {
  return NIVELES_URGENCIA.find((o) => o.valor === valor)?.texto ?? 'Sin urgencia';
}

export function clasesUrgencia(valor: number): string {
  switch (valor) {
    case 3:
      return 'border-[#D9182A]/30 bg-[#D9182A]/5 text-[#D9182A]';
    case 2:
      return 'border-amber-300 bg-amber-50 text-amber-700';
    default:
      return 'border-gray-300 bg-gray-50 text-gray-600';
  }
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

export interface PrioridadExamen {
  valor: string;
  etiqueta: string;
}

export const PRIORIDADES_EXAMEN: PrioridadExamen[] = [
  { valor: 'NORMAL', etiqueta: 'Normal' },
  { valor: 'PRIORITARIO', etiqueta: 'Prioritario' },
  { valor: 'URGENTE', etiqueta: 'Urgente' },
];

export function etiquetaPrioridadExamen(valor: string): string {
  return PRIORIDADES_EXAMEN.find((p) => p.valor === valor)?.etiqueta ?? valor;
}

export function clasePrioridadExamen(valor: string): string {
  switch (valor) {
    case 'URGENTE':
      return 'border-[#D9182A] bg-[#D9182A] text-white';
    case 'PRIORITARIO':
      return 'border-[#58595B] bg-[#58595B] text-white';
    default:
      return 'border-neutral-300 bg-white text-neutral-600';
  }
}
