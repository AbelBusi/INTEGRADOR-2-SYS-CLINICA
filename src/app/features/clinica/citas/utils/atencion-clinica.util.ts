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
