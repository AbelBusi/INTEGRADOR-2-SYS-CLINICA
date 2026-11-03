import { fechaHoraTexto } from '../../../../shared/documentos-clinicos/utils/documento-clinico.util';
import { CitaFila, infoEstado } from '../interface/cita.interface';
import {
  ClaveReporte,
  DatosCsv,
  DefinicionReporte,
  DocumentoReporte,
  FilaPacienteReporte,
  FilaPendienteReporte,
  MapaCalor,
  SeccionReporte,
  SeccionTabla,
} from '../interface/reporte-cita-extra.interface';
import { ConteoEstados, FilaGrafico, ReporteCitas, TarjetaReporte } from '../interface/reporte-cita.interface';
import {
  COLOR_SIN_REGULARIZAR,
  SERIES_ESTADO,
  conteoVacio,
  fechaIsoTexto,
  filasPorEstado,
  filasPorPunto,
  filtrarCitas,
  isoLocal,
  porcentaje,
  segmentosDe,
  tarjetasReporte,
} from './reporte-cita.util';
import { limiteRegularizacion } from './ventana-cita.util';

export const DEFINICIONES_REPORTE: DefinicionReporte[] = [
  {
    clave: 'general',
    titulo: 'Resumen general',
    descripcion: 'Estados, médicos, evolución y días de la semana.',
    icono: 'bar_chart',
  },
  {
    clave: 'medico',
    titulo: 'Reporte por médico',
    descripcion: 'Desempeño y agenda de un médico en un periodo.',
    icono: 'medical_services',
  },
  {
    clave: 'paciente',
    titulo: 'Reporte por paciente',
    descripcion: 'Citas por paciente y cancelaciones recurrentes.',
    icono: 'groups',
  },
  {
    clave: 'horario',
    titulo: 'Demanda por horario',
    descripcion: 'Días y horas con mayor concentración de citas.',
    icono: 'schedule',
  },
  {
    clave: 'pendientes',
    titulo: 'Pendientes de regularización',
    descripcion: 'Citas vencidas, antigüedad y plazo restante.',
    icono: 'pending_actions',
  },
  {
    clave: 'agenda',
    titulo: 'Agenda del día',
    descripcion: 'Listado de citas de una fecha, ordenado por hora.',
    icono: 'event_note',
  },
];

export const COLORES_CALOR = ['#F4F4F5', '#D4D4D6', '#A9AAAD', '#7C7D80', '#58595B'];

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MS_DIA = 86400000;

const dos = (valor: number): string => String(valor).padStart(2, '0');

function sumar(conteo: ConteoEstados, estado: number): void {
  const serie = SERIES_ESTADO.find((item) => item.estado === estado);

  if (serie) {
    conteo[serie.clave] += 1;
    conteo.total += 1;
  }
}

export function contar(citas: CitaFila[]): ConteoEstados {
  const conteo = conteoVacio();
  citas.forEach((cita) => sumar(conteo, cita.estado));
  return conteo;
}

function aFechaHora(fecha: string, hora: string): Date {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [horas, minutos] = hora.split(':').map(Number);
  return new Date(anio, mes - 1, dia, horas, minutos);
}

function minutosDe(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

function horaDe(cita: CitaFila): number {
  return Number(cita.inicio.split(':')[0]);
}

function indiceDia(fecha: string): number {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return (new Date(anio, mes - 1, dia).getDay() + 6) % 7;
}

function extremos(valores: number[], porDefecto: [number, number]): [number, number] {
  if (valores.length === 0) {
    return porDefecto;
  }

  return valores.reduce<[number, number]>(
    ([minimo, maximo], valor) => [Math.min(minimo, valor), Math.max(maximo, valor)],
    [valores[0], valores[0]],
  );
}

export function periodoTexto(desde: string, hasta: string): string {
  if (desde && hasta) {
    return desde === hasta ? fechaIsoTexto(desde) : `${fechaIsoTexto(desde)} al ${fechaIsoTexto(hasta)}`;
  }

  if (desde) {
    return `Desde el ${fechaIsoTexto(desde)}`;
  }

  if (hasta) {
    return `Hasta el ${fechaIsoTexto(hasta)}`;
  }

  return 'Todas las fechas';
}

export function textoMedico(citas: CitaFila[], idMedico: number | 'todos'): string {
  return idMedico === 'todos'
    ? 'Todos los médicos'
    : (citas.find((cita) => cita.idMedico === idMedico)?.medico ?? 'Médico');
}

export function textoEstado(estado: number | 'todos'): string {
  return estado === 'todos' ? 'Todos los estados' : infoEstado(estado).texto;
}

export function csvCitas(citas: CitaFila[], pendientes: ReadonlySet<number>): DatosCsv {
  return {
    cabecera: [
      'N° de cita',
      'Paciente',
      'Médico',
      'Fecha',
      'Hora de inicio',
      'Hora de salida',
      'Estado',
      'Sin regularizar',
      'Motivo',
    ],
    filas: citas.map((cita) => [
      String(cita.id),
      cita.paciente,
      cita.medico,
      fechaIsoTexto(cita.fecha),
      cita.inicio,
      cita.salida,
      infoEstado(cita.estado).texto,
      cita.estado === 1 && pendientes.has(cita.id) ? 'Sí' : 'No',
      cita.motivo,
    ]),
  };
}

function tablaCitas(titulo: string, citas: CitaFila[], pendientes: ReadonlySet<number>): SeccionTabla {
  return {
    tipo: 'tabla',
    titulo,
    cabecera: ['Fecha', 'Horario', 'Paciente', 'Médico', 'Estado', 'Motivo'],
    filas: citas.map((cita) => [
      fechaIsoTexto(cita.fecha),
      `${cita.inicio} - ${cita.salida}`,
      cita.paciente,
      cita.medico,
      cita.estado === 1 && pendientes.has(cita.id)
        ? `${infoEstado(cita.estado).texto} (sin regularizar)`
        : infoEstado(cita.estado).texto,
      cita.motivo,
    ]),
    pesos: [1.1, 1.2, 2, 2, 1.4, 2.4],
    centradas: [],
  };
}

export function filasPacientes(citas: CitaFila[]): FilaPacienteReporte[] {
  const mapa = new Map<number, FilaPacienteReporte>();

  citas.forEach((cita) => {
    let fila = mapa.get(cita.idPaciente);

    if (!fila) {
      fila = { idPaciente: cita.idPaciente, paciente: cita.paciente, conteo: conteoVacio(), ultimaFecha: '' };
      mapa.set(cita.idPaciente, fila);
    }

    sumar(fila.conteo, cita.estado);

    if (cita.fecha > fila.ultimaFecha) {
      fila.ultimaFecha = cita.fecha;
    }
  });

  return [...mapa.values()].sort(
    (a, b) => b.conteo.total - a.conteo.total || a.paciente.localeCompare(b.paciente, 'es'),
  );
}

export function filasGraficoPacientes(filas: FilaPacienteReporte[]): FilaGrafico[] {
  return filas.map((fila) => ({
    clave: String(fila.idPaciente),
    etiqueta: fila.paciente,
    segmentos: segmentosDe(fila.conteo),
    total: fila.conteo.total,
    detalle: '',
  }));
}

export function tarjetasPaciente(filas: FilaPacienteReporte[]): TarjetaReporte[] {
  const total = filas.reduce((suma, fila) => suma + fila.conteo.total, 0);
  const recurrentes = filas.filter((fila) => fila.conteo.canceladas >= 2).length;

  return [
    { clave: 'pacientes', texto: 'Pacientes', valor: filas.length, detalle: 'Con citas en el periodo', color: '#262626' },
    { clave: 'citas', texto: 'Citas', valor: total, detalle: 'Total incluido', color: '#58595B' },
    {
      clave: 'promedio',
      texto: 'Citas por paciente',
      valor: filas.length > 0 ? Number((total / filas.length).toFixed(1)) : 0,
      detalle: 'Promedio',
      color: '#0d6b68',
    },
    {
      clave: 'recurrentes',
      texto: 'Con 2+ cancelaciones',
      valor: recurrentes,
      detalle: `${porcentaje(recurrentes, filas.length)} de los pacientes`,
      color: '#D9182A',
    },
  ];
}

export function documentoPaciente(datos: {
  filas: FilaPacienteReporte[];
  desde: string;
  hasta: string;
  medico: string;
  estado: string;
  busqueda: string;
}): DocumentoReporte {
  const total = datos.filas.reduce((suma, fila) => suma + fila.conteo.total, 0);
  const filtros = [`Médico: ${datos.medico}`, `Estado: ${datos.estado}`, `Pacientes: ${datos.filas.length}`];

  if (datos.busqueda.trim()) {
    filtros.push(`Búsqueda: ${datos.busqueda.trim()}`);
  }

  return {
    titulo: 'Reporte de citas por paciente',
    archivo: 'reporte-pacientes',
    periodo: periodoTexto(datos.desde, datos.hasta),
    filtros,
    tarjetas: tarjetasPaciente(datos.filas),
    secciones: [
      {
        tipo: 'barras',
        titulo: 'Pacientes con más citas',
        filas: filasGraficoPacientes(datos.filas.slice(0, 10)),
        leyenda: true,
        nota: datos.filas.length > 10 ? 'Se muestran los 10 pacientes con más citas.' : undefined,
      },
      {
        tipo: 'tabla',
        titulo: 'Detalle por paciente',
        cabecera: ['Paciente', 'Total', 'Programadas', 'Atendidas', 'Canceladas', 'Reprogramadas', 'Última cita'],
        filas: datos.filas.map((fila) => [
          fila.paciente,
          String(fila.conteo.total),
          String(fila.conteo.programadas),
          String(fila.conteo.atendidas),
          String(fila.conteo.canceladas),
          String(fila.conteo.reprogramadas),
          fechaIsoTexto(fila.ultimaFecha),
        ]),
        pesos: [3, 1, 1.5, 1.3, 1.4, 1.7, 1.6],
        centradas: [1, 2, 3, 4, 5, 6],
        pie: [
          'Total',
          String(total),
          String(datos.filas.reduce((suma, fila) => suma + fila.conteo.programadas, 0)),
          String(datos.filas.reduce((suma, fila) => suma + fila.conteo.atendidas, 0)),
          String(datos.filas.reduce((suma, fila) => suma + fila.conteo.canceladas, 0)),
          String(datos.filas.reduce((suma, fila) => suma + fila.conteo.reprogramadas, 0)),
          '',
        ],
      },
    ],
    csv: {
      cabecera: ['Paciente', 'Total', 'Programadas', 'Atendidas', 'Canceladas', 'Reprogramadas', 'Última cita'],
      filas: datos.filas.map((fila) => [
        fila.paciente,
        String(fila.conteo.total),
        String(fila.conteo.programadas),
        String(fila.conteo.atendidas),
        String(fila.conteo.canceladas),
        String(fila.conteo.reprogramadas),
        fechaIsoTexto(fila.ultimaFecha),
      ]),
    },
  };
}

export function documentoMedico(reporte: ReporteCitas, incluirDetalle: boolean): DocumentoReporte {
  const pacientes = filasPacientes(reporte.citas).slice(0, 10);

  const secciones: SeccionReporte[] = [
    { tipo: 'barras', titulo: 'Citas por estado', filas: filasPorEstado(reporte.conteo), leyenda: false },
    {
      tipo: 'columnas',
      titulo: `Evolución de las citas por ${reporte.granularidad === 'dia' ? 'día' : 'mes'}`,
      puntos: reporte.porTiempo,
    },
    {
      tipo: 'barras',
      titulo: 'Citas por día de la semana',
      filas: filasPorPunto(reporte.porDiaSemana),
      leyenda: true,
    },
    {
      tipo: 'tabla',
      titulo: 'Pacientes con más citas',
      cabecera: ['Paciente', 'Total', 'Atendidas', 'Canceladas', 'Última cita'],
      filas: pacientes.map((fila) => [
        fila.paciente,
        String(fila.conteo.total),
        String(fila.conteo.atendidas),
        String(fila.conteo.canceladas),
        fechaIsoTexto(fila.ultimaFecha),
      ]),
      pesos: [3, 1, 1.3, 1.4, 1.6],
      centradas: [1, 2, 3, 4],
    },
  ];

  if (incluirDetalle) {
    secciones.push(tablaCitas('Listado de citas', reporte.citas, reporte.pendientes));
  }

  return {
    titulo: 'Reporte por médico',
    archivo: 'reporte-medico',
    periodo: reporte.periodoTexto,
    filtros: [`Médico: ${reporte.medicoTexto}`, `Estado: ${reporte.estadoTexto}`, `Citas incluidas: ${reporte.conteo.total}`],
    tarjetas: tarjetasReporte(reporte),
    secciones,
    csv: csvCitas(reporte.citas, reporte.pendientes),
  };
}

export function construirMapaCalor(citas: CitaFila[]): MapaCalor {
  const [minimo, maximo] = extremos(citas.map(horaDe), [8, 17]);
  const columnas: string[] = [];

  for (let hora = minimo; hora <= maximo; hora++) {
    columnas.push(`${dos(hora)}:00`);
  }

  const valores = DIAS_SEMANA.map(() => columnas.map(() => 0));

  citas.forEach((cita) => {
    valores[indiceDia(cita.fecha)][horaDe(cita) - minimo] += 1;
  });

  return {
    filas: DIAS_SEMANA,
    columnas,
    valores,
    maximo: valores.reduce((mayor, fila) => Math.max(mayor, ...fila), 0),
  };
}

export function nivelCalor(valor: number, maximo: number): number {
  if (valor <= 0 || maximo <= 0) {
    return 0;
  }

  return Math.min(4, Math.ceil((valor / maximo) * 4));
}

export function filasPorHora(citas: CitaFila[]): FilaGrafico[] {
  const [minimo, maximo] = extremos(citas.map(horaDe), [8, 17]);
  const grupos = new Map<number, CitaFila[]>();

  citas.forEach((cita) => {
    const hora = horaDe(cita);
    const grupo = grupos.get(hora) ?? [];
    grupo.push(cita);
    grupos.set(hora, grupo);
  });

  const filas: FilaGrafico[] = [];

  for (let hora = minimo; hora <= maximo; hora++) {
    const conteo = contar(grupos.get(hora) ?? []);

    filas.push({
      clave: String(hora),
      etiqueta: `${dos(hora)}:00`,
      segmentos: segmentosDe(conteo),
      total: conteo.total,
      detalle: porcentaje(conteo.total, citas.length),
    });
  }

  return filas;
}

export function filasPorDia(citas: CitaFila[]): FilaGrafico[] {
  const grupos: CitaFila[][] = DIAS_SEMANA.map(() => []);

  citas.forEach((cita) => grupos[indiceDia(cita.fecha)].push(cita));

  return DIAS_SEMANA.map((dia, indice) => {
    const conteo = contar(grupos[indice]);

    return {
      clave: String(indice),
      etiqueta: dia,
      segmentos: segmentosDe(conteo),
      total: conteo.total,
      detalle: porcentaje(conteo.total, citas.length),
    };
  });
}

function mayor(filas: FilaGrafico[]): FilaGrafico | null {
  return filas.reduce<FilaGrafico | null>(
    (mejor, fila) => (fila.total > 0 && (!mejor || fila.total > mejor.total) ? fila : mejor),
    null,
  );
}

export function duracionPromedio(citas: CitaFila[]): number {
  if (citas.length === 0) {
    return 0;
  }

  const total = citas.reduce((suma, cita) => suma + (minutosDe(cita.salida) - minutosDe(cita.inicio)), 0);

  return Math.round(total / citas.length);
}

export function tarjetasHorario(citas: CitaFila[]): TarjetaReporte[] {
  const horaPico = mayor(filasPorHora(citas));
  const diaPico = mayor(filasPorDia(citas));

  return [
    { clave: 'total', texto: 'Citas analizadas', valor: citas.length, detalle: 'En el periodo', color: '#262626' },
    {
      clave: 'hora',
      texto: 'Hora pico',
      valor: horaPico?.total ?? 0,
      detalle: horaPico ? `${horaPico.etiqueta} - ${horaPico.etiqueta.slice(0, 2)}:59` : 'Sin datos',
      color: '#D9182A',
    },
    {
      clave: 'dia',
      texto: 'Día pico',
      valor: diaPico?.total ?? 0,
      detalle: diaPico?.etiqueta ?? 'Sin datos',
      color: '#58595B',
    },
    {
      clave: 'duracion',
      texto: 'Duración promedio',
      valor: duracionPromedio(citas),
      detalle: 'Minutos por cita',
      color: '#0d6b68',
    },
  ];
}

export function documentoHorario(datos: {
  citas: CitaFila[];
  desde: string;
  hasta: string;
  medico: string;
  soloEfectivas: boolean;
}): DocumentoReporte {
  const mapa = construirMapaCalor(datos.citas);
  const filasCsv: string[][] = [];

  mapa.filas.forEach((dia, fila) => {
    mapa.columnas.forEach((hora, columna) => {
      if (mapa.valores[fila][columna] > 0) {
        filasCsv.push([dia, hora, String(mapa.valores[fila][columna])]);
      }
    });
  });

  return {
    titulo: 'Demanda de citas por horario',
    archivo: 'reporte-horarios',
    periodo: periodoTexto(datos.desde, datos.hasta),
    filtros: [
      `Médico: ${datos.medico}`,
      datos.soloEfectivas ? 'Citas programadas y atendidas' : 'Todas las citas',
      `Citas analizadas: ${datos.citas.length}`,
    ],
    tarjetas: tarjetasHorario(datos.citas),
    secciones: [
      {
        tipo: 'mapa',
        titulo: 'Concentración de citas por día y hora de inicio',
        mapa,
        nota: 'Cada celda es la cantidad de citas que inician en esa hora. Los tonos más oscuros indican mayor demanda.',
      },
      { tipo: 'barras', titulo: 'Citas por hora de inicio', filas: filasPorHora(datos.citas), leyenda: true },
      { tipo: 'barras', titulo: 'Citas por día de la semana', filas: filasPorDia(datos.citas), leyenda: true },
    ],
    csv: { cabecera: ['Día', 'Hora de inicio', 'Citas'], filas: filasCsv },
  };
}

function textoRestante(ms: number): string {
  if (ms <= 0) {
    return 'Plazo vencido';
  }

  const minutosTotales = Math.floor(ms / 60000);
  const dias = Math.floor(minutosTotales / 1440);
  const horas = Math.floor((minutosTotales % 1440) / 60);

  return dias > 0 ? `${dias} d ${horas} h` : `${horas} h ${minutosTotales % 60} min`;
}

export function filasPendientes(
  citas: CitaFila[],
  pendientes: ReadonlySet<number>,
  idMedico: number | 'todos',
  ahora: Date,
): FilaPendienteReporte[] {
  return citas
    .filter(
      (cita) =>
        cita.estado === 1 &&
        pendientes.has(cita.id) &&
        (idMedico === 'todos' || cita.idMedico === idMedico),
    )
    .map((cita) => {
      const fin = aFechaHora(cita.fecha, cita.salida);
      const limite = limiteRegularizacion(cita);
      const restante = limite.getTime() - ahora.getTime();

      return {
        cita,
        diasAtraso: Math.max(0, Math.floor((ahora.getTime() - fin.getTime()) / MS_DIA)),
        limite,
        restanteTexto: textoRestante(restante),
        urgente: restante < MS_DIA,
      };
    })
    .sort((a, b) =>
      `${a.cita.fecha} ${a.cita.salida}`.localeCompare(`${b.cita.fecha} ${b.cita.salida}`),
    );
}

export function filasPendientesPorMedico(filas: FilaPendienteReporte[]): FilaGrafico[] {
  const mapa = new Map<number, { medico: string; total: number }>();

  filas.forEach(({ cita }) => {
    const actual = mapa.get(cita.idMedico) ?? { medico: cita.medico, total: 0 };
    actual.total += 1;
    mapa.set(cita.idMedico, actual);
  });

  return [...mapa.entries()]
    .sort((a, b) => b[1].total - a[1].total || a[1].medico.localeCompare(b[1].medico, 'es'))
    .map(([id, dato]) => ({
      clave: String(id),
      etiqueta: dato.medico,
      segmentos: [{ valor: dato.total, color: COLOR_SIN_REGULARIZAR, texto: 'Sin regularizar' }],
      total: dato.total,
      detalle: '',
    }));
}

export function filasAntiguedad(filas: FilaPendienteReporte[]): FilaGrafico[] {
  const tramos = [
    { etiqueta: 'Menos de 1 día', cumple: (dias: number) => dias < 1 },
    { etiqueta: '1 día', cumple: (dias: number) => dias === 1 },
    { etiqueta: '2 a 3 días', cumple: (dias: number) => dias >= 2 && dias <= 3 },
    { etiqueta: '4 a 7 días', cumple: (dias: number) => dias >= 4 && dias <= 7 },
    { etiqueta: 'Más de 7 días', cumple: (dias: number) => dias > 7 },
  ];

  return tramos.map((tramo, indice) => {
    const total = filas.filter((fila) => tramo.cumple(fila.diasAtraso)).length;

    return {
      clave: String(indice),
      etiqueta: tramo.etiqueta,
      segmentos: total > 0 ? [{ valor: total, color: '#58595B', texto: 'Citas' }] : [],
      total,
      detalle: porcentaje(total, filas.length),
    };
  });
}

export function tarjetasPendientes(filas: FilaPendienteReporte[]): TarjetaReporte[] {
  const medicos = new Set(filas.map((fila) => fila.cita.idMedico)).size;
  const masAntigua = filas.reduce((mayorDias, fila) => Math.max(mayorDias, fila.diasAtraso), 0);
  const urgentes = filas.filter((fila) => fila.urgente).length;

  return [
    { clave: 'total', texto: 'Sin regularizar', valor: filas.length, detalle: 'Citas vencidas', color: COLOR_SIN_REGULARIZAR },
    { clave: 'medicos', texto: 'Médicos con pendientes', valor: medicos, detalle: 'Con al menos una cita', color: '#58595B' },
    { clave: 'antigua', texto: 'Más antigua', valor: masAntigua, detalle: 'Días de atraso', color: '#262626' },
    { clave: 'urgentes', texto: 'Plazo por vencer', valor: urgentes, detalle: 'En menos de 24 h', color: '#D9182A' },
  ];
}

export function documentoPendientes(filas: FilaPendienteReporte[], medico: string): DocumentoReporte {
  const hoy = isoLocal(new Date());

  return {
    titulo: 'Citas pendientes de regularización',
    archivo: 'reporte-pendientes',
    periodo: `Al ${fechaIsoTexto(hoy)}`,
    filtros: [`Médico: ${medico}`, `Citas pendientes: ${filas.length}`],
    tarjetas: tarjetasPendientes(filas),
    secciones: [
      {
        tipo: 'barras',
        titulo: 'Pendientes por médico',
        filas: filasPendientesPorMedico(filas),
        leyenda: false,
      },
      {
        tipo: 'barras',
        titulo: 'Antigüedad de los pendientes',
        filas: filasAntiguedad(filas),
        leyenda: false,
      },
      {
        tipo: 'tabla',
        titulo: 'Detalle de citas pendientes',
        cabecera: ['Fecha', 'Horario', 'Paciente', 'Médico', 'Atraso', 'Plazo restante'],
        filas: filas.map((fila) => [
          fechaIsoTexto(fila.cita.fecha),
          `${fila.cita.inicio} - ${fila.cita.salida}`,
          fila.cita.paciente,
          fila.cita.medico,
          `${fila.diasAtraso} d`,
          fila.restanteTexto,
        ]),
        pesos: [1.1, 1.3, 2.2, 2.2, 0.9, 1.5],
        centradas: [4],
        nota: 'El plazo restante se calcula con el límite de regularización de cada cita.',
      },
    ],
    csv: {
      cabecera: [
        'N° de cita',
        'Fecha',
        'Horario',
        'Paciente',
        'Médico',
        'Días de atraso',
        'Límite para regularizar',
        'Plazo restante',
      ],
      filas: filas.map((fila) => [
        String(fila.cita.id),
        fechaIsoTexto(fila.cita.fecha),
        `${fila.cita.inicio} - ${fila.cita.salida}`,
        fila.cita.paciente,
        fila.cita.medico,
        String(fila.diasAtraso),
        fechaHoraTexto(fila.limite),
        fila.restanteTexto,
      ]),
    },
  };
}

export function citasDelDia(
  citas: CitaFila[],
  fecha: string,
  idMedico: number | 'todos',
  estado: number | 'todos',
): CitaFila[] {
  return filtrarCitas(citas, { desde: fecha, hasta: fecha, idMedico, estado }).sort((a, b) =>
    `${a.inicio} ${a.medico}`.localeCompare(`${b.inicio} ${b.medico}`, 'es'),
  );
}

export function tarjetasAgenda(conteo: ConteoEstados): TarjetaReporte[] {
  return [
    { clave: 'total', texto: 'Citas del día', valor: conteo.total, detalle: 'Total', color: '#262626' },
    { clave: 'programadas', texto: 'Programadas', valor: conteo.programadas, detalle: porcentaje(conteo.programadas, conteo.total), color: '#58595B' },
    { clave: 'atendidas', texto: 'Atendidas', valor: conteo.atendidas, detalle: porcentaje(conteo.atendidas, conteo.total), color: '#0d6b68' },
    { clave: 'canceladas', texto: 'Canceladas', valor: conteo.canceladas, detalle: porcentaje(conteo.canceladas, conteo.total), color: '#D9182A' },
  ];
}

export function documentoAgenda(datos: {
  citas: CitaFila[];
  fecha: string;
  medico: string;
  estado: string;
  pendientes: ReadonlySet<number>;
}): DocumentoReporte {
  const conteo = contar(datos.citas);

  return {
    titulo: 'Agenda de citas médicas',
    archivo: 'agenda-citas',
    periodo: fechaIsoTexto(datos.fecha),
    filtros: [`Médico: ${datos.medico}`, `Estado: ${datos.estado}`, `Citas: ${conteo.total}`],
    tarjetas: tarjetasAgenda(conteo),
    secciones: [
      {
        tipo: 'tabla',
        titulo: 'Citas del día',
        cabecera: ['Horario', 'Paciente', 'Médico', 'Motivo', 'Estado'],
        filas: datos.citas.map((cita) => [
          `${cita.inicio} - ${cita.salida}`,
          cita.paciente,
          cita.medico,
          cita.motivo,
          cita.estado === 1 && datos.pendientes.has(cita.id)
            ? `${infoEstado(cita.estado).texto} (sin regularizar)`
            : infoEstado(cita.estado).texto,
        ]),
        pesos: [1.3, 2.3, 2.2, 2.6, 1.6],
        centradas: [],
      },
    ],
    csv: csvCitas(datos.citas, datos.pendientes),
  };
}

export function claveEsReporte(valor: string): valor is ClaveReporte {
  return DEFINICIONES_REPORTE.some((definicion) => definicion.clave === valor);
}
