import { CitaFila, infoEstado } from '../interface/cita.interface';
import {
  ClaveEstadoReporte,
  ConteoEstados,
  FilaGrafico,
  FilaMedicoReporte,
  FiltroReporteCita,
  GranularidadReporte,
  OpcionMedicoReporte,
  PuntoReporte,
  RangoRapido,
  ReporteCitas,
  SegmentoGrafico,
  SerieEstado,
  TarjetaReporte,
} from '../interface/reporte-cita.interface';

export const SERIES_ESTADO: SerieEstado[] = [
  { clave: 'programadas', estado: 1, texto: 'Programadas', color: '#58595B' },
  { clave: 'atendidas', estado: 3, texto: 'Atendidas', color: '#0d6b68' },
  { clave: 'canceladas', estado: 2, texto: 'Canceladas', color: '#D9182A' },
  { clave: 'reprogramadas', estado: 4, texto: 'Reprogramadas', color: '#B5B6B8' },
];

export const COLOR_SIN_REGULARIZAR = '#F59E0B';

export const RANGOS_RAPIDOS: { clave: RangoRapido; texto: string }[] = [
  { clave: 'hoy', texto: 'Hoy' },
  { clave: 'semana', texto: 'Últimos 7 días' },
  { clave: 'mes', texto: 'Este mes' },
  { clave: 'mes_anterior', texto: 'Mes anterior' },
  { clave: 'todo', texto: 'Todo' },
];

const CLAVE_POR_ESTADO: Record<number, ClaveEstadoReporte> = {
  1: 'programadas',
  2: 'canceladas',
  3: 'atendidas',
  4: 'reprogramadas',
};

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const dos = (valor: number): string => String(valor).padStart(2, '0');

function partes(iso: string): [number, number, number] {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return [anio, mes, dia];
}

export function isoLocal(fecha: Date): string {
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

export function fechaIsoTexto(iso: string): string {
  if (!iso) {
    return '';
  }

  const [anio, mes, dia] = partes(iso);
  return `${dos(dia)}/${dos(mes)}/${anio}`;
}

export function hexARgb(hex: string): [number, number, number] {
  const limpio = hex.replace('#', '');
  return [
    parseInt(limpio.slice(0, 2), 16),
    parseInt(limpio.slice(2, 4), 16),
    parseInt(limpio.slice(4, 6), 16),
  ];
}

export function porcentaje(valor: number, total: number): string {
  const resultado = total > 0 ? (valor / total) * 100 : 0;
  return `${resultado.toFixed(1).replace('.', ',')} %`;
}

export function maximoRedondeado(valor: number): number {
  if (valor <= 0) {
    return 2;
  }

  const magnitud = Math.pow(10, Math.floor(Math.log10(valor)));
  const factor = [2, 4, 6, 8, 10].find((candidato) => candidato * magnitud >= valor) ?? 10;

  return factor * magnitud;
}

export function conteoVacio(): ConteoEstados {
  return { programadas: 0, atendidas: 0, canceladas: 0, reprogramadas: 0, total: 0 };
}

function acumular(conteo: ConteoEstados, estado: number): void {
  const clave = CLAVE_POR_ESTADO[estado];

  if (!clave) {
    return;
  }

  conteo[clave] += 1;
  conteo.total += 1;
}

export function rangoFechas(
  rango: RangoRapido,
  base: Date = new Date(),
): { desde: string; hasta: string } {
  const anio = base.getFullYear();
  const mes = base.getMonth();

  switch (rango) {
    case 'hoy':
      return { desde: isoLocal(base), hasta: isoLocal(base) };
    case 'semana':
      return { desde: isoLocal(new Date(anio, mes, base.getDate() - 6)), hasta: isoLocal(base) };
    case 'mes':
      return {
        desde: isoLocal(new Date(anio, mes, 1)),
        hasta: isoLocal(new Date(anio, mes + 1, 0)),
      };
    case 'mes_anterior':
      return {
        desde: isoLocal(new Date(anio, mes - 1, 1)),
        hasta: isoLocal(new Date(anio, mes, 0)),
      };
    default:
      return { desde: '', hasta: '' };
  }
}

export function filtrarCitas(citas: CitaFila[], filtro: FiltroReporteCita): CitaFila[] {
  return citas.filter((cita) => {
    if (!CLAVE_POR_ESTADO[cita.estado]) {
      return false;
    }
    if (filtro.estado !== 'todos' && cita.estado !== filtro.estado) {
      return false;
    }
    if (filtro.idMedico !== 'todos' && cita.idMedico !== filtro.idMedico) {
      return false;
    }
    if (filtro.desde && cita.fecha < filtro.desde) {
      return false;
    }
    if (filtro.hasta && cita.fecha > filtro.hasta) {
      return false;
    }
    return true;
  });
}

export function opcionesMedico(citas: CitaFila[]): OpcionMedicoReporte[] {
  const mapa = new Map<number, string>();

  citas.forEach((cita) => mapa.set(cita.idMedico, cita.medico));

  return [...mapa]
    .map(([idMedico, medico]) => ({ idMedico, medico }))
    .sort((a, b) => a.medico.localeCompare(b.medico, 'es'));
}

function textoPeriodo(filtro: FiltroReporteCita): string {
  if (filtro.desde && filtro.hasta) {
    return filtro.desde === filtro.hasta
      ? fechaIsoTexto(filtro.desde)
      : `${fechaIsoTexto(filtro.desde)} al ${fechaIsoTexto(filtro.hasta)}`;
  }

  if (filtro.desde) {
    return `Desde el ${fechaIsoTexto(filtro.desde)}`;
  }

  if (filtro.hasta) {
    return `Hasta el ${fechaIsoTexto(filtro.hasta)}`;
  }

  return 'Todas las fechas';
}

function decidirGranularidad(citas: CitaFila[]): GranularidadReporte {
  if (citas.length === 0) {
    return 'dia';
  }

  const [a1, m1, d1] = partes(citas[0].fecha);
  const [a2, m2, d2] = partes(citas[citas.length - 1].fecha);
  const dias = (Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86400000;

  return dias <= 31 ? 'dia' : 'mes';
}

function puntosTiempo(citas: CitaFila[], granularidad: GranularidadReporte): PuntoReporte[] {
  if (citas.length === 0) {
    return [];
  }

  const mapa = new Map<string, PuntoReporte>();
  const minimo = citas[0].fecha;
  const maximo = citas[citas.length - 1].fecha;
  const [a1, m1, d1] = partes(minimo);
  const [a2, m2] = partes(maximo);

  if (granularidad === 'dia') {
    const cursor = new Date(a1, m1 - 1, d1);

    while (isoLocal(cursor) <= maximo) {
      const clave = isoLocal(cursor);
      mapa.set(clave, {
        clave,
        etiqueta: `${dos(cursor.getDate())}/${dos(cursor.getMonth() + 1)}`,
        conteo: conteoVacio(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
  } else {
    let anio = a1;
    let mes = m1;

    while (anio < a2 || (anio === a2 && mes <= m2)) {
      const clave = `${anio}-${dos(mes)}`;
      mapa.set(clave, {
        clave,
        etiqueta: `${MESES[mes - 1]} ${String(anio).slice(2)}`,
        conteo: conteoVacio(),
      });
      mes += 1;

      if (mes > 12) {
        mes = 1;
        anio += 1;
      }
    }
  }

  citas.forEach((cita) => {
    const clave = granularidad === 'dia' ? cita.fecha : cita.fecha.slice(0, 7);
    const punto = mapa.get(clave);

    if (punto) {
      acumular(punto.conteo, cita.estado);
    }
  });

  return [...mapa.values()];
}

export function construirReporte(
  citas: CitaFila[],
  pendientes: ReadonlySet<number>,
  filtro: FiltroReporteCita,
): ReporteCitas {
  const clave = (cita: CitaFila): string => `${cita.fecha} ${cita.inicio}`;
  const filtradas = filtrarCitas(citas, filtro).sort((a, b) => clave(a).localeCompare(clave(b)));

  const conteo = conteoVacio();
  const medicos = new Map<number, FilaMedicoReporte>();
  const semana: PuntoReporte[] = DIAS_SEMANA.map((texto, indice) => ({
    clave: String(indice),
    etiqueta: texto,
    conteo: conteoVacio(),
  }));
  let sinRegularizar = 0;

  filtradas.forEach((cita) => {
    acumular(conteo, cita.estado);

    let fila = medicos.get(cita.idMedico);

    if (!fila) {
      fila = {
        idMedico: cita.idMedico,
        medico: cita.medico,
        conteo: conteoVacio(),
        tasaAtencion: '',
      };
      medicos.set(cita.idMedico, fila);
    }

    acumular(fila.conteo, cita.estado);

    const [anio, mes, dia] = partes(cita.fecha);
    acumular(semana[(new Date(anio, mes - 1, dia).getDay() + 6) % 7].conteo, cita.estado);

    if (cita.estado === 1 && pendientes.has(cita.id)) {
      sinRegularizar += 1;
    }
  });

  const porMedico = [...medicos.values()]
    .map((fila) => ({
      ...fila,
      tasaAtencion: porcentaje(fila.conteo.atendidas, fila.conteo.total),
    }))
    .sort((a, b) => b.conteo.total - a.conteo.total || a.medico.localeCompare(b.medico, 'es'));

  const granularidad = decidirGranularidad(filtradas);

  return {
    filtro,
    citas: filtradas,
    pendientes,
    conteo,
    sinRegularizar,
    porMedico,
    porTiempo: puntosTiempo(filtradas, granularidad),
    granularidad,
    porDiaSemana: semana,
    periodoTexto: textoPeriodo(filtro),
    medicoTexto:
      filtro.idMedico === 'todos'
        ? 'Todos los médicos'
        : (citas.find((cita) => cita.idMedico === filtro.idMedico)?.medico ?? 'Médico'),
    estadoTexto: filtro.estado === 'todos' ? 'Todos los estados' : infoEstado(filtro.estado).texto,
  };
}

export function tarjetasReporte(reporte: ReporteCitas): TarjetaReporte[] {
  const c = reporte.conteo;

  return [
    {
      clave: 'total',
      texto: 'Total de citas',
      valor: c.total,
      detalle: 'En el periodo',
      color: '#262626',
    },
    {
      clave: 'atendidas',
      texto: 'Atendidas',
      valor: c.atendidas,
      detalle: porcentaje(c.atendidas, c.total),
      color: '#0d6b68',
    },
    {
      clave: 'programadas',
      texto: 'Programadas',
      valor: c.programadas,
      detalle: porcentaje(c.programadas, c.total),
      color: '#58595B',
    },
    {
      clave: 'canceladas',
      texto: 'Canceladas',
      valor: c.canceladas,
      detalle: porcentaje(c.canceladas, c.total),
      color: '#D9182A',
    },
    {
      clave: 'reprogramadas',
      texto: 'Reprogramadas',
      valor: c.reprogramadas,
      detalle: porcentaje(c.reprogramadas, c.total),
      color: '#B5B6B8',
    },
    {
      clave: 'sin-regularizar',
      texto: 'Sin regularizar',
      valor: reporte.sinRegularizar,
      detalle: 'Citas vencidas',
      color: COLOR_SIN_REGULARIZAR,
    },
  ];
}

export function segmentosDe(conteo: ConteoEstados): SegmentoGrafico[] {
  return SERIES_ESTADO.map((serie) => ({
    valor: conteo[serie.clave],
    color: serie.color,
    texto: serie.texto,
  })).filter((segmento) => segmento.valor > 0);
}

export function filasPorEstado(conteo: ConteoEstados): FilaGrafico[] {
  return SERIES_ESTADO.map((serie) => ({
    clave: serie.clave,
    etiqueta: serie.texto,
    segmentos: [{ valor: conteo[serie.clave], color: serie.color, texto: serie.texto }],
    total: conteo[serie.clave],
    detalle: porcentaje(conteo[serie.clave], conteo.total),
  }));
}

export function filasPorMedico(filas: FilaMedicoReporte[]): FilaGrafico[] {
  return filas.map((fila) => ({
    clave: String(fila.idMedico),
    etiqueta: fila.medico,
    segmentos: segmentosDe(fila.conteo),
    total: fila.conteo.total,
    detalle: '',
  }));
}

export function filasPorPunto(puntos: PuntoReporte[]): FilaGrafico[] {
  return puntos.map((punto) => ({
    clave: punto.clave,
    etiqueta: punto.etiqueta,
    segmentos: segmentosDe(punto.conteo),
    total: punto.conteo.total,
    detalle: '',
  }));
}
