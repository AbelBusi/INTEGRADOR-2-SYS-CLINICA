export type FechaHoraApi = string | number[] | null | undefined;

interface PartesFecha {
  anio: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;
}

function partes(valor: FechaHoraApi): PartesFecha | null {
  if (!valor) {
    return null;
  }

  if (Array.isArray(valor)) {
    const [anio, mes, dia, hora = 0, minuto = 0] = valor;
    return { anio, mes, dia, hora, minuto };
  }

  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(valor);

  if (!coincidencia) {
    return null;
  }

  return {
    anio: Number(coincidencia[1]),
    mes: Number(coincidencia[2]),
    dia: Number(coincidencia[3]),
    hora: Number(coincidencia[4] ?? 0),
    minuto: Number(coincidencia[5] ?? 0),
  };
}

const dos = (numero: number): string => String(numero).padStart(2, '0');

export function formatearFecha(valor: FechaHoraApi): string {
  const p = partes(valor);
  return p ? `${dos(p.dia)}/${dos(p.mes)}/${p.anio}` : '—';
}

export function formatearFechaHora(valor: FechaHoraApi): string {
  const p = partes(valor);
  return p ? `${dos(p.dia)}/${dos(p.mes)}/${p.anio} ${dos(p.hora)}:${dos(p.minuto)}` : '—';
}

export function claveOrden(valor: FechaHoraApi): string {
  const p = partes(valor);
  return p ? `${p.anio}${dos(p.mes)}${dos(p.dia)}${dos(p.hora)}${dos(p.minuto)}` : '';
}

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function dato(valor: string | null | undefined): string {
  return valor && valor.trim() !== '' ? valor : '—';
}
