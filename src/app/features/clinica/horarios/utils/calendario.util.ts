import { HoraApi } from '../interface/horario.interface';

export const DIAS_SEMANA = [
  { numero: 1, corto: 'LUN', largo: 'Lunes' },
  { numero: 2, corto: 'MAR', largo: 'Martes' },
  { numero: 3, corto: 'MIÉ', largo: 'Miércoles' },
  { numero: 4, corto: 'JUE', largo: 'Jueves' },
  { numero: 5, corto: 'VIE', largo: 'Viernes' },
  { numero: 6, corto: 'SÁB', largo: 'Sábado' },
  { numero: 7, corto: 'DOM', largo: 'Domingo' },
];

export const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export const ALTURA_HORA = 64;

export const COLORES_CARGO = [
  '#0d6b68',
  '#D9182A',
  '#58595B',
  '#3f8f8c',
  '#B81424',
  '#0a4f4d',
  '#7a1520',
  '#6f7072',
];

export const COLOR_SIN_CARGO = '#8a8b8e';

export interface BloquePosicionado<T> {
  item: T;
  inicio: number;
  fin: number;
  carril: number;
  carriles: number;
}

export function aHHmm(valor: HoraApi): string {
  if (Array.isArray(valor)) {
    const horas = String(valor[0] ?? 0).padStart(2, '0');
    const minutos = String(valor[1] ?? 0).padStart(2, '0');
    return `${horas}:${minutos}`;
  }
  return valor.substring(0, 5);
}

export function aMinutos(valor: HoraApi): number {
  const [horas, minutos] = aHHmm(valor).split(':').map(Number);
  return horas * 60 + minutos;
}

export function formatearDuracion(minutos: number): string {
  const horas = minutos / 60;
  return `${Number.isInteger(horas) ? horas : horas.toFixed(1)} h`;
}

export function diaSemanaDeFecha(fecha: Date): number {
  const dia = fecha.getDay();
  return dia === 0 ? 7 : dia;
}

export function sumarDias(fecha: Date, dias: number): Date {
  const resultado = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

export function inicioSemana(fecha: Date): Date {
  return sumarDias(fecha, -(diaSemanaDeFecha(fecha) - 1));
}

export function mismoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function mesCorto(fecha: Date): string {
  return MESES[fecha.getMonth()].substring(0, 3);
}

export function formatearRangoSemana(inicio: Date): string {
  const fin = sumarDias(inicio, 6);

  if (inicio.getMonth() === fin.getMonth() && inicio.getFullYear() === fin.getFullYear()) {
    return `${inicio.getDate()} - ${fin.getDate()} de ${MESES[fin.getMonth()]}, ${fin.getFullYear()}`;
  }

  if (inicio.getFullYear() === fin.getFullYear()) {
    return `${inicio.getDate()} ${mesCorto(inicio)} - ${fin.getDate()} ${mesCorto(fin)}, ${fin.getFullYear()}`;
  }

  return `${inicio.getDate()} ${mesCorto(inicio)} ${inicio.getFullYear()} - ${fin.getDate()} ${mesCorto(fin)} ${fin.getFullYear()}`;
}

export function formatearDiaLargo(fecha: Date): string {
  const dia = DIAS_SEMANA[diaSemanaDeFecha(fecha) - 1].largo;
  return `${dia}, ${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

export function formatearMes(fecha: Date): string {
  const mes = MESES[fecha.getMonth()];
  return `${mes.charAt(0).toUpperCase()}${mes.slice(1)} ${fecha.getFullYear()}`;
}

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');
}

export function distribuirBloques<T>(
  items: { item: T; inicio: number; fin: number }[],
): BloquePosicionado<T>[] {
  const ordenados = [...items].sort((a, b) => a.inicio - b.inicio || a.fin - b.fin);
  const resultado: BloquePosicionado<T>[] = [];
  let grupo: BloquePosicionado<T>[] = [];
  let finGrupo = -1;

  const cerrarGrupo = (): void => {
    const carriles = grupo.reduce((maximo, bloque) => Math.max(maximo, bloque.carril + 1), 1);
    grupo.forEach((bloque) => (bloque.carriles = carriles));
    resultado.push(...grupo);
    grupo = [];
    finGrupo = -1;
  };

  for (const actual of ordenados) {
    if (grupo.length && actual.inicio >= finGrupo) {
      cerrarGrupo();
    }

    const ocupados = new Set(
      grupo.filter((bloque) => bloque.fin > actual.inicio).map((bloque) => bloque.carril),
    );

    let carril = 0;
    while (ocupados.has(carril)) {
      carril++;
    }

    grupo.push({ ...actual, carril, carriles: 1 });
    finGrupo = Math.max(finGrupo, actual.fin);
  }

  if (grupo.length) {
    cerrarGrupo();
  }

  return resultado;
}
