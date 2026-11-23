import {
  OpcionLista,
  TIPO_DIAGNOSTICO,
  URGENCIA_DERIVACION,
} from '../constants/historia-clinica.constants';
import { FactorRh, GrupoSanguineo, HistoriaClinica } from '../interface/historia-clinica.interface';

/** 'yyyy-MM-dd' o 'yyyy-MM-ddTHH:mm:ss' -> 'dd/MM/yyyy'. Evita new Date() para no desfasar por zona horaria. */
export function formatearFecha(valor: string | null | undefined): string {
  if (!valor || valor.length < 10) {
    return '';
  }
  const [anio, mes, dia] = valor.substring(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

/** 'HH:mm:ss' o ISO datetime -> 'HH:mm'. */
export function formatearHora(valor: string | null | undefined): string {
  if (!valor) {
    return '';
  }
  const hora = valor.includes('T') ? valor.substring(11) : valor;
  return hora.substring(0, 5);
}

/** ISO datetime -> 'dd/MM/yyyy HH:mm'. */
export function formatearFechaHora(valor: string | null | undefined): string {
  if (!valor) {
    return '';
  }
  const fecha = formatearFecha(valor);
  const hora = valor.includes('T') ? formatearHora(valor) : '';
  return hora ? `${fecha} ${hora}` : fecha;
}

export function fechaHoraActual(): string {
  const d = new Date();
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()} ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

export function calcularEdad(fechaNacimiento: string | null | undefined): string {
  if (!fechaNacimiento || fechaNacimiento.length < 10) {
    return '';
  }
  const [a, m, d] = fechaNacimiento.substring(0, 10).split('-').map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - a;
  if (hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d)) {
    edad--;
  }
  return edad >= 0 ? `${edad} ${edad === 1 ? 'año' : 'años'}` : '';
}

export function etiqueta<T extends string>(
  opciones: OpcionLista<T>[],
  valor: T | null | undefined,
  vacio = '',
): string {
  if (!valor) {
    return vacio;
  }
  return opciones.find((o) => o.valor === valor)?.texto ?? valor;
}

/** 'A' + 'POSITIVO' -> 'A+'. Devuelve '' si falta alguno de los dos. */
export function grupoConRh(grupo: GrupoSanguineo | null, rh: FactorRh | null): string {
  if (!grupo || !rh) {
    return '';
  }
  return `${grupo}${rh === 'POSITIVO' ? '+' : '-'}`;
}

export function textoGenero(genero: string | null | undefined): string {
  if (!genero) {
    return '';
  }
  const g = genero.trim().toUpperCase();
  if (g === 'M') {
    return 'Masculino';
  }
  if (g === 'F') {
    return 'Femenino';
  }
  return genero;
}

export function textoTipoDiagnostico(tipo: number | null | undefined): string {
  if (tipo === null || tipo === undefined) {
    return '';
  }
  return TIPO_DIAGNOSTICO[tipo] ?? `Tipo ${tipo}`;
}

export function textoUrgencia(urgencia: number | null | undefined): string {
  if (urgencia === null || urgencia === undefined) {
    return '';
  }
  return URGENCIA_DERIVACION[urgencia] ?? `Nivel ${urgencia}`;
}

/** Campos clínicos generales que todavía no se han registrado. */
export function camposPendientes(historia: HistoriaClinica): string[] {
  const pendientes: string[] = [];
  if (!historia.grupoSanguineo) {
    pendientes.push('grupo sanguíneo');
  }
  if (!historia.factorRh) {
    pendientes.push('factor Rh');
  }
  return pendientes;
}

export function mensajeError(error: any, porDefecto: string): string {
  return error?.error?.mensaje || porDefecto;
}
