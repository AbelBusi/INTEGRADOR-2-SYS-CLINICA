import { aFecha } from '../../../../shared/documentos-clinicos/utils/documento-clinico.util';
import { CitaFila, infoEstado } from '../interface/cita.interface';
import { DocumentoReporte } from '../interface/reporte-cita-extra.interface';
import { FilaGrafico, ReporteCitas, TarjetaReporte } from '../interface/reporte-cita.interface';
import {
  DefinicionReportePortal,
  GrupoReportePortal,
  MarcaAgenda,
  ResumenPuntualidad,
} from '../interface/reporte-medico.interface';
import { contar, csvCitas, filasPacientes, filasPorHora } from './reporte-cita-extra.util';
import {
  COLOR_SIN_REGULARIZAR,
  fechaIsoTexto,
  filasPorEstado,
  filasPorPunto,
  isoLocal,
  porcentaje,
} from './reporte-cita.util';

export const DEFINICIONES_PORTAL: DefinicionReportePortal[] = [
  {
    clave: 'agenda',
    titulo: 'Agenda del día',
    descripcion: 'Tus citas de hoy o de otra fecha, con la siguiente cita y hoja imprimible.',
    icono: 'today',
    grupo: 'Mi jornada',
  },
  {
    clave: 'calendario',
    titulo: 'Mi calendario de atención',
    descripcion: 'Tu horario y tus citas por semana o mes, con la ocupación de tu agenda.',
    icono: 'calendar_month',
    grupo: 'Mi jornada',
  },
  {
    clave: 'pendientes',
    titulo: 'Pendientes de regularización',
    descripcion: 'Citas vencidas que debes regularizar y el plazo que te queda.',
    icono: 'pending_actions',
    grupo: 'Mi jornada',
  },
  {
    clave: 'productividad',
    titulo: 'Mi productividad',
    descripcion: 'Atenciones, cancelaciones, pacientes y puntualidad de inicio.',
    icono: 'insights',
    grupo: 'Mi desempeño',
  },
  {
    clave: 'actividad',
    titulo: 'Actividad clínica',
    descripcion: 'Diagnósticos, medicamentos, exámenes y derivaciones más frecuentes.',
    icono: 'medical_information',
    grupo: 'Mi desempeño',
  },
  {
    clave: 'pacientes',
    titulo: 'Mis pacientes',
    descripcion: 'Pacientes atendidos, frecuencia de citas y cancelaciones.',
    icono: 'groups',
    grupo: 'Mi desempeño',
  },
  {
    clave: 'horario',
    titulo: 'Demanda por horario',
    descripcion: 'Días y horas en que se concentran tus citas.',
    icono: 'schedule',
    grupo: 'Mi desempeño',
  },
];

export function gruposPortal(): GrupoReportePortal[] {
  const titulos = [...new Set(DEFINICIONES_PORTAL.map((definicion) => definicion.grupo))];

  return titulos.map((titulo) => ({
    titulo,
    items: DEFINICIONES_PORTAL.filter((definicion) => definicion.grupo === titulo),
  }));
}

const UMBRAL_PUNTUAL = 10;

const TRAMOS_PUNTUALIDAD: {
  etiqueta: string;
  cumple: (minutos: number) => boolean;
  color: string;
}[] = [
  { etiqueta: 'A la hora o antes', cumple: (minutos) => minutos <= 0, color: '#0d6b68' },
  {
    etiqueta: 'De 1 a 10 min',
    cumple: (minutos) => minutos >= 1 && minutos <= 10,
    color: '#0d6b68',
  },
  {
    etiqueta: 'De 11 a 20 min',
    cumple: (minutos) => minutos >= 11 && minutos <= 20,
    color: '#58595B',
  },
  {
    etiqueta: 'De 21 a 30 min',
    cumple: (minutos) => minutos >= 21 && minutos <= 30,
    color: '#B5B6B8',
  },
  { etiqueta: 'Más de 30 min', cumple: (minutos) => minutos > 30, color: '#D9182A' },
];

function fechaHora(fecha: string, hora: string): Date {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [horas, minutos] = hora.split(':').map(Number);
  return new Date(anio, mes - 1, dia, horas, minutos);
}

export function textoMarca(marca: MarcaAgenda | null | undefined): string {
  switch (marca) {
    case 'en_curso':
      return 'En curso';
    case 'siguiente':
      return 'Siguiente';
    case 'sin_regularizar':
      return 'Sin regularizar';
    default:
      return '';
  }
}

export function marcasAgenda(
  citas: CitaFila[],
  pendientes: ReadonlySet<number>,
  ahora: Date,
): Map<number, MarcaAgenda> {
  const marcas = new Map<number, MarcaAgenda>();
  const hoy = isoLocal(ahora);
  let siguienteAsignada = false;

  citas
    .filter((cita) => cita.estado === 1)
    .forEach((cita) => {
      const inicio = fechaHora(cita.fecha, cita.inicio);
      const fin = fechaHora(cita.fecha, cita.salida);

      if (ahora >= fin || pendientes.has(cita.id)) {
        marcas.set(cita.id, 'sin_regularizar');
        return;
      }

      if (ahora >= inicio) {
        marcas.set(cita.id, 'en_curso');
        return;
      }

      if (!siguienteAsignada && cita.fecha === hoy) {
        marcas.set(cita.id, 'siguiente');
        siguienteAsignada = true;
      }
    });

  return marcas;
}

export function tarjetasAgendaMedico(
  citas: CitaFila[],
  marcas: Map<number, MarcaAgenda>,
): TarjetaReporte[] {
  const atendidas = citas.filter((cita) => cita.estado === 3).length;
  const sinRegularizar = citas.filter((cita) => marcas.get(cita.id) === 'sin_regularizar').length;
  const porAtender = citas.filter(
    (cita) => cita.estado === 1 && marcas.get(cita.id) !== 'sin_regularizar',
  ).length;

  return [
    {
      clave: 'total',
      texto: 'Citas del día',
      valor: citas.length,
      detalle: 'En la agenda',
      color: '#262626',
    },
    {
      clave: 'atendidas',
      texto: 'Atendidas',
      valor: atendidas,
      detalle: porcentaje(atendidas, citas.length),
      color: '#0d6b68',
    },
    {
      clave: 'por-atender',
      texto: 'Por atender',
      valor: porAtender,
      detalle: 'Incluye la cita en curso',
      color: '#58595B',
    },
    {
      clave: 'sin-regularizar',
      texto: 'Sin regularizar',
      valor: sinRegularizar,
      detalle: 'Citas vencidas',
      color: COLOR_SIN_REGULARIZAR,
    },
  ];
}

function estadoConMarca(cita: CitaFila, marcas: Map<number, MarcaAgenda>): string {
  const marca = textoMarca(marcas.get(cita.id));
  const estado = infoEstado(cita.estado).texto;

  return marca ? `${estado} (${marca.toLowerCase()})` : estado;
}

export function documentoAgendaMedico(datos: {
  citas: CitaFila[];
  fecha: string;
  medico: string;
  marcas: Map<number, MarcaAgenda>;
  pendientes: ReadonlySet<number>;
}): DocumentoReporte {
  return {
    titulo: 'Agenda de atención del día',
    archivo: 'agenda-medico',
    periodo: fechaIsoTexto(datos.fecha),
    filtros: [`Médico: ${datos.medico}`, `Citas: ${datos.citas.length}`],
    tarjetas: tarjetasAgendaMedico(datos.citas, datos.marcas),
    secciones: [
      {
        tipo: 'tabla',
        titulo: 'Citas del día',
        cabecera: ['Horario', 'Paciente', 'Motivo', 'Estado', 'Notas'],
        filas: datos.citas.map((cita) => [
          `${cita.inicio} - ${cita.salida}`,
          cita.paciente,
          cita.motivo,
          estadoConMarca(cita, datos.marcas),
          '',
        ]),
        pesos: [1.3, 2.2, 2.4, 1.7, 2.2],
        centradas: [],
      },
      {
        tipo: 'barras',
        titulo: 'Citas por hora de inicio',
        filas: filasPorHora(datos.citas),
        leyenda: true,
      },
    ],
    csv: csvCitas(datos.citas, datos.pendientes),
  };
}

export function retrasoMinutos(cita: CitaFila): number | null {
  if (!cita.inicioAtencion) {
    return null;
  }

  const real = aFecha(cita.inicioAtencion);

  if (!real) {
    return null;
  }

  const programada = fechaHora(cita.fecha, cita.inicio);

  return Math.round((real.getTime() - programada.getTime()) / 60000);
}

export function resumenPuntualidad(citas: CitaFila[]): ResumenPuntualidad {
  const retrasos = citas
    .filter((cita) => cita.estado === 3)
    .map(retrasoMinutos)
    .filter((retraso): retraso is number => retraso !== null);

  if (retrasos.length === 0) {
    return { conRegistro: 0, puntuales: 0, promedio: 0 };
  }

  const suma = retrasos.reduce((total, retraso) => total + Math.max(0, retraso), 0);

  return {
    conRegistro: retrasos.length,
    puntuales: retrasos.filter((retraso) => retraso <= UMBRAL_PUNTUAL).length,
    promedio: Math.round(suma / retrasos.length),
  };
}

export function filasPuntualidad(citas: CitaFila[]): FilaGrafico[] {
  const retrasos = citas
    .filter((cita) => cita.estado === 3)
    .map(retrasoMinutos)
    .filter((retraso): retraso is number => retraso !== null);

  if (retrasos.length === 0) {
    return [];
  }

  return TRAMOS_PUNTUALIDAD.map((tramo, indice) => {
    const total = retrasos.filter((retraso) => tramo.cumple(retraso)).length;

    return {
      clave: String(indice),
      etiqueta: tramo.etiqueta,
      segmentos: total > 0 ? [{ valor: total, color: tramo.color, texto: tramo.etiqueta }] : [],
      total,
      detalle: porcentaje(total, retrasos.length),
    };
  });
}

export function tarjetasProductividad(citas: CitaFila[]): TarjetaReporte[] {
  const conteo = contar(citas);
  const pacientes = filasPacientes(citas);
  const recurrentes = pacientes.filter((fila) => fila.conteo.total > 1).length;
  const dias = new Set(citas.filter((cita) => cita.estado === 3).map((cita) => cita.fecha)).size;
  const promedio = dias > 0 ? Number((conteo.atendidas / dias).toFixed(1)) : 0;
  const puntualidad = resumenPuntualidad(citas);

  return [
    {
      clave: 'total',
      texto: 'Citas del periodo',
      valor: conteo.total,
      detalle: 'Total registrado',
      color: '#262626',
    },
    {
      clave: 'atendidas',
      texto: 'Atendidas',
      valor: conteo.atendidas,
      detalle: porcentaje(conteo.atendidas, conteo.total),
      color: '#0d6b68',
    },
    {
      clave: 'canceladas',
      texto: 'Canceladas',
      valor: conteo.canceladas,
      detalle: porcentaje(conteo.canceladas, conteo.total),
      color: '#D9182A',
    },
    {
      clave: 'pacientes',
      texto: 'Pacientes distintos',
      valor: pacientes.length,
      detalle: `${recurrentes} recurrentes`,
      color: '#58595B',
    },
    {
      clave: 'promedio',
      texto: 'Atenciones por día',
      valor: promedio,
      detalle: `En ${dias} día(s)`,
      color: '#B5B6B8',
    },
    {
      clave: 'puntualidad',
      texto: 'Inicio puntual (%)',
      valor:
        puntualidad.conRegistro > 0
          ? Math.round((puntualidad.puntuales / puntualidad.conRegistro) * 100)
          : 0,
      detalle: puntualidad.conRegistro > 0 ? 'Hasta 10 min de retraso' : 'Sin registro de inicio',
      color: '#0d6b68',
    },
  ];
}

export function documentoProductividad(reporte: ReporteCitas, medico: string): DocumentoReporte {
  const pacientes = filasPacientes(reporte.citas).slice(0, 10);
  const puntualidad = resumenPuntualidad(reporte.citas);

  return {
    titulo: 'Productividad del médico',
    archivo: 'mi-productividad',
    periodo: reporte.periodoTexto,
    filtros: [`Médico: ${medico}`, `Citas incluidas: ${reporte.conteo.total}`],
    tarjetas: tarjetasProductividad(reporte.citas),
    secciones: [
      {
        tipo: 'barras',
        titulo: 'Citas por estado',
        filas: filasPorEstado(reporte.conteo),
        leyenda: false,
      },
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
        tipo: 'barras',
        titulo: 'Puntualidad de inicio de la atención',
        filas: filasPuntualidad(reporte.citas),
        leyenda: false,
        nota: `Atenciones con hora de inicio registrada: ${puntualidad.conRegistro}. Retraso promedio: ${puntualidad.promedio} min.`,
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
    ],
    csv: csvCitas(reporte.citas, reporte.pendientes),
  };
}
