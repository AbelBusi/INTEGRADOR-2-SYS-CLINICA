const pad = (n: number): string => String(n).padStart(2, '0');

export function hoyIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Días del periodo contando inicio y fin (del 1 al 3 = 3 días). */
export function calcularDias(inicio: string, fin: string): number | null {
  if (!inicio || !fin || fin < inicio) {
    return null;
  }

  const [ai, mi, di] = inicio.split('-').map(Number);
  const [af, mf, df] = fin.split('-').map(Number);
  const ms = Date.UTC(af, mf - 1, df) - Date.UTC(ai, mi - 1, di);

  return Math.round(ms / 86_400_000) + 1;
}

/** 'YYYY-MM-DD...' -> 'dd/MM/yyyy' sin pasar por Date (evita desfases de zona horaria). */
export function formatearFecha(iso: string | null | undefined): string {
  if (!iso || iso.length < 10) {
    return '—';
  }

  const [a, m, d] = iso.substring(0, 10).split('-');
  return `${d}/${m}/${a}`;
}

/** 'YYYY-MM-DDTHH:mm:ss' -> 'dd/MM/yyyy HH:mm:ss' */
export function formatearFechaHora(iso: string | null | undefined): string {
  if (!iso || iso.length < 19) {
    return '—';
  }

  return `${formatearFecha(iso)} ${iso.substring(11, 19)}`;
}

export function textoDias(dias: number | null | undefined): string {
  if (!dias) {
    return '—';
  }

  return `${dias} ${dias === 1 ? 'día' : 'días'}`;
}

export function etiquetaMetodo(metodo: string): string {
  return metodo === 'CODIGO_TEMPORAL' ? 'Código de verificación temporal' : metodo;
}

export function mensajeError(error: any, porDefecto: string): string {
  return error?.error?.mensaje || error?.error?.message || porDefecto;
}
