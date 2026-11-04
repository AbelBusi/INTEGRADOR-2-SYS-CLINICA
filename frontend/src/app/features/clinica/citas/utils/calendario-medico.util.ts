import { HorarioDia } from '../../horarios/interface/horario.interface';
import {
  DIAS_SEMANA,
  aFechaISO,
  aHHmm,
  aISO,
  aMinutos,
  diaSemanaDeFecha,
  inicioSemana,
  mismoDia,
  sumarDias,
} from '../../horarios/utils/calendario.util';
import { CitaFila } from '../interface/cita.interface';
import { DocumentoReporte } from '../interface/reporte-cita-extra.interface';
import { FilaGrafico, TarjetaReporte } from '../interface/reporte-cita.interface';
import {
  ResumenDiaMedico,
  TotalesCalendario,
  TramoMedico,
} from '../interface/reporte-medico.interface';
import { fechaIsoTexto } from './reporte-cita.util';

const dos = (valor: number): string => String(valor).padStart(2, '0');

export function minutosDeHora(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
}

export function horasTexto(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  return resto > 0 ? `${horas} h ${resto} min` : `${horas} h`;
}

export function aTramo(horario: HorarioDia): TramoMedico {
  return {
    id: horario.idHorario,
    diaSemana: horario.diaSemana,
    entrada: aHHmm(horario.horaEntrada),
    salida: aHHmm(horario.horaSalida),
    entradaMin: aMinutos(horario.horaEntrada),
    salidaMin: aMinutos(horario.horaSalida),
    inicio: aFechaISO(horario.fechaInicio),
    fin: aFechaISO(horario.fechaFin),
  };
}

export function tramosDelDia(tramos: TramoMedico[], fecha: Date): TramoMedico[] {
  const iso = aISO(fecha);
  const dia = diaSemanaDeFecha(fecha);

  return tramos
    .filter(
      (tramo) =>
        tramo.diaSemana === dia &&
        tramo.inicio <= iso &&
        tramo.fin >= iso &&
        tramo.salidaMin > tramo.entradaMin,
    )
    .sort((a, b) => a.entradaMin - b.entradaMin);
}

export function citasPorFecha(citas: CitaFila[]): Map<string, CitaFila[]> {
  const mapa = new Map<string, CitaFila[]>();

  citas
    .filter((cita) => cita.estado === 1 || cita.estado === 3)
    .sort((a, b) => `${a.fecha} ${a.inicio}`.localeCompare(`${b.fecha} ${b.inicio}`))
    .forEach((cita) => {
      const lista = mapa.get(cita.fecha) ?? [];
      lista.push(cita);
      mapa.set(cita.fecha, lista);
    });

  return mapa;
}

export function resumenDia(
  fecha: Date,
  tramos: TramoMedico[],
  mapa: Map<string, CitaFila[]>,
  hoy: Date,
  mesReferencia?: number,
): ResumenDiaMedico {
  const iso = aISO(fecha);
  const delDia = tramosDelDia(tramos, fecha);
  const citas = mapa.get(iso) ?? [];

  return {
    fecha,
    iso,
    delMes: mesReferencia === undefined || fecha.getMonth() === mesReferencia,
    esHoy: mismoDia(fecha, hoy),
    tramos: delDia,
    citas,
    minutosDisponibles: delDia.reduce(
      (suma, tramo) => suma + tramo.salidaMin - tramo.entradaMin,
      0,
    ),
    minutosCita: citas.reduce(
      (suma, cita) => suma + minutosDeHora(cita.salida) - minutosDeHora(cita.inicio),
      0,
    ),
  };
}

export function diasDelMes(referencia: Date): Date[] {
  const primero = new Date(referencia.getFullYear(), referencia.getMonth(), 1);
  const ultimo = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0);
  const inicio = inicioSemana(primero);
  const fin = sumarDias(inicioSemana(ultimo), 6);
  const total = Math.round((fin.getTime() - inicio.getTime()) / 86400000) + 1;

  return Array.from({ length: total }, (_, indice) => sumarDias(inicio, indice));
}

export function totalesCalendario(dias: ResumenDiaMedico[]): TotalesCalendario {
  const disponibles = dias.reduce((suma, dia) => suma + dia.minutosDisponibles, 0);
  const ocupados = dias.reduce((suma, dia) => suma + dia.minutosCita, 0);

  return {
    disponibles,
    ocupados,
    citas: dias.reduce((suma, dia) => suma + dia.citas.length, 0),
    diasAtencion: dias.filter((dia) => dia.tramos.length > 0).length,
    ocupacion: disponibles > 0 ? Math.min(100, Math.round((ocupados / disponibles) * 100)) : 0,
  };
}

export function tarjetasCalendario(totales: TotalesCalendario): TarjetaReporte[] {
  return [
    {
      clave: 'dias',
      texto: 'Días de atención',
      valor: totales.diasAtencion,
      detalle: 'Con horario',
      color: '#B5B6B8',
    },
    {
      clave: 'horas',
      texto: 'Horas de atención',
      valor: Math.round(totales.disponibles / 6) / 10,
      detalle: 'Según tu horario',
      color: '#262626',
    },
    {
      clave: 'citas',
      texto: 'Citas',
      valor: totales.citas,
      detalle: 'Programadas y atendidas',
      color: '#0d6b68',
    },
    {
      clave: 'ocupacion',
      texto: 'Ocupación (%)',
      valor: totales.ocupacion,
      detalle: `${horasTexto(totales.ocupados)} con cita`,
      color: '#58595B',
    },
  ];
}

function ocupacionDia(dia: ResumenDiaMedico): string {
  return dia.minutosDisponibles > 0
    ? `${Math.min(100, Math.round((dia.minutosCita / dia.minutosDisponibles) * 100))} %`
    : '-';
}

function horarioTexto(dia: ResumenDiaMedico): string {
  return dia.tramos.length > 0
    ? dia.tramos.map((tramo) => `${tramo.entrada} - ${tramo.salida}`).join(' / ')
    : 'Sin horario';
}

export function documentoCalendario(datos: {
  medico: string;
  periodo: string;
  dias: ResumenDiaMedico[];
  tramos: TramoMedico[];
}): DocumentoReporte {
  const { dias, tramos } = datos;
  const totales = totalesCalendario(dias);
  const activos = dias.filter((dia) => dia.tramos.length > 0 || dia.citas.length > 0);
  const desde = dias[0]?.iso ?? '';
  const hasta = dias[dias.length - 1]?.iso ?? '';

  const vigentes = tramos
    .filter((tramo) => tramo.inicio <= hasta && tramo.fin >= desde)
    .sort((a, b) => a.diaSemana - b.diaSemana || a.entradaMin - b.entradaMin);

  const barras: FilaGrafico[] = activos.map((dia) => {
    const dato = DIAS_SEMANA[diaSemanaDeFecha(dia.fecha) - 1];
    const horas = Math.round(dia.minutosCita / 6) / 10;

    return {
      clave: dia.iso,
      etiqueta: `${dato.corto} ${dos(dia.fecha.getDate())}/${dos(dia.fecha.getMonth() + 1)}`,
      segmentos: horas > 0 ? [{ valor: horas, color: '#0d6b68', texto: 'Horas con cita' }] : [],
      total: horas,
      detalle: ocupacionDia(dia),
    };
  });

  return {
    titulo: 'Calendario de atención del médico',
    archivo: 'calendario-atencion',
    periodo: datos.periodo,
    filtros: [`Médico: ${datos.medico}`, `Días con actividad: ${activos.length}`],
    tarjetas: tarjetasCalendario(totales),
    secciones: [
      {
        tipo: 'tabla',
        titulo: 'Calendario del periodo',
        cabecera: ['Fecha', 'Día', 'Horario de atención', 'Citas', 'Horas con cita', 'Ocupación'],
        filas: activos.map((dia) => [
          fechaIsoTexto(dia.iso),
          DIAS_SEMANA[diaSemanaDeFecha(dia.fecha) - 1].largo,
          horarioTexto(dia),
          String(dia.citas.length),
          horasTexto(dia.minutosCita),
          ocupacionDia(dia),
        ]),
        pesos: [1.2, 1.4, 2.4, 0.9, 1.4, 1.2],
        centradas: [3, 4, 5],
      },
      { tipo: 'barras', titulo: 'Horas con cita por día', filas: barras, leyenda: false },
      {
        tipo: 'tabla',
        titulo: 'Horario semanal vigente',
        cabecera: ['Día', 'Entrada', 'Salida', 'Horas', 'Vigente desde', 'Vigente hasta'],
        filas: vigentes.map((tramo) => [
          DIAS_SEMANA[tramo.diaSemana - 1].largo,
          tramo.entrada,
          tramo.salida,
          horasTexto(tramo.salidaMin - tramo.entradaMin),
          fechaIsoTexto(tramo.inicio),
          fechaIsoTexto(tramo.fin),
        ]),
        pesos: [1.6, 1, 1, 1, 1.5, 1.5],
        centradas: [1, 2, 3],
      },
    ],
    csv: {
      cabecera: [
        'Fecha',
        'Día',
        'Horario de atención',
        'Horas disponibles',
        'Citas',
        'Horas con cita',
        'Ocupación',
      ],
      filas: activos.map((dia) => [
        fechaIsoTexto(dia.iso),
        DIAS_SEMANA[diaSemanaDeFecha(dia.fecha) - 1].largo,
        horarioTexto(dia),
        horasTexto(dia.minutosDisponibles),
        String(dia.citas.length),
        horasTexto(dia.minutosCita),
        ocupacionDia(dia),
      ]),
    },
  };
}
