import { formatearFechaCorta } from '../../horarios/utils/calendario.util';
import { ACCIONES_HISTORIAL, HistorialCita, infoEstado } from '../interface/cita.interface';

export interface NombresHistorial {
  medico: Record<number, string>;
  paciente: Record<number, string>;
}

export interface CambioHistorial {
  campo: string;
  antes: string;
  despues: string;
}

export interface EventoVista {
  id: number;
  etiqueta: string;
  icono: string;
  punto: string;
  fecha: string;
  hora: string;
  responsable: string;
  descripcion: string;
  cambios: CambioHistorial[];
  observacion: string | null;
  etiquetaObservacion: string;
}

const ETIQUETAS_CAMPO: Record<string, string> = {
  fechaCita: 'Fecha',
  horaInicio: 'Hora de inicio',
  horaSalida: 'Hora de salida',
  idMedico: 'Médico',
  idPaciente: 'Paciente',
  idUsuario: 'Registrado por',
  motivo: 'Motivo',
};

const ORDEN_CAMPOS = Object.keys(ETIQUETAS_CAMPO);

function aTexto(clave: string, valor: unknown, nombres: NombresHistorial): string {
  if (valor === null || valor === undefined || valor === '') {
    return '—';
  }

  switch (clave) {
    case 'fechaCita':
      return formatearFechaCorta(String(valor));
    case 'horaInicio':
    case 'horaSalida':
      return String(valor).slice(0, 5);
    case 'estado':
      return infoEstado(Number(valor)).texto;
    case 'idMedico':
      return nombres.medico[Number(valor)] ?? `Médico N.º ${valor}`;
    case 'idPaciente':
      return nombres.paciente[Number(valor)] ?? `Paciente N.º ${valor}`;
    case 'idUsuario':
      return `Usuario N.º ${valor}`;
    default:
      return String(valor);
  }
}

export function parsearFechaEvento(valor: string | number[]): Date {
  if (Array.isArray(valor)) {
    const [anio, mes, dia, hora = 0, minuto = 0, segundo = 0] = valor;
    return new Date(anio, mes - 1, dia, hora, minuto, segundo);
  }
  return new Date(valor.replace(/(\.\d{3})\d+/, '$1'));
}

function calcularCambios(evento: HistorialCita, nombres: NombresHistorial): CambioHistorial[] {
  if (evento.accion !== 'MODIFICADA' && evento.accion !== 'REPROGRAMADA') {
    return [];
  }

  const anteriores = evento.datosAnteriores ?? {};
  const nuevos = evento.datosNuevos ?? {};

  return ORDEN_CAMPOS.filter((clave) => clave in anteriores || clave in nuevos).map((clave) => ({
    campo: ETIQUETAS_CAMPO[clave],
    antes: aTexto(clave, anteriores[clave], nombres),
    despues: aTexto(clave, nuevos[clave], nombres),
  }));
}

function calcularDescripcion(evento: HistorialCita, nombres: NombresHistorial): string {
  const nuevos = evento.datosNuevos ?? {};

  switch (evento.accion) {
    case 'CREADA': {
      const fecha = aTexto('fechaCita', nuevos['fechaCita'], nombres);
      const inicio = aTexto('horaInicio', nuevos['horaInicio'], nombres);
      const salida = aTexto('horaSalida', nuevos['horaSalida'], nombres);
      const medico = aTexto('idMedico', nuevos['idMedico'], nombres);
      return `Cita programada para el ${fecha} de ${inicio} a ${salida} con ${medico}.`;
    }
    case 'MODIFICADA':
      return 'Se modificaron los datos de la cita.';
    case 'REPROGRAMADA':
      return 'Se cambió la fecha, la hora o el médico de la cita.';
    case 'CANCELADA':
      return 'La cita fue cancelada.';
    case 'ATENDIDA':
      return 'El médico registró la atención de la cita.';
    case 'ELIMINADA':
      return 'La cita fue eliminada del sistema.';
  }
}

export function describirEvento(evento: HistorialCita, nombres: NombresHistorial): EventoVista {
  const info = ACCIONES_HISTORIAL[evento.accion];
  const fecha = parsearFechaEvento(evento.fechaEvento);
  const regularizada = evento.datosNuevos?.['regularizacion'] === true;

  return {
    id: evento.id,
    etiqueta: regularizada ? 'Cita regularizada' : info.texto,
    icono: info.icono,
    punto: info.punto,
    fecha: fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
    hora: fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    responsable: evento.nombreUsuario?.trim() || evento.usuario,
    descripcion: regularizada
      ? evento.accion === 'ATENDIDA'
        ? 'La cita venció sin resolverse y se regularizó como atendida.'
        : 'La cita venció sin resolverse y se regularizó como no realizada (cancelada).'
      : calcularDescripcion(evento, nombres),
    cambios: calcularCambios(evento, nombres),
    observacion: evento.observacion,
    etiquetaObservacion: regularizada
      ? 'Justificación'
      : evento.accion === 'CANCELADA'
        ? 'Motivo de cancelación'
        : 'Observación',
  };
}
