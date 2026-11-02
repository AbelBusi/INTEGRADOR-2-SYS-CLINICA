import { FechaApi } from '../../horarios/interface/horario.interface';
import {
  aFechaISO,
  aMinutos,
  fechaDesdeISO,
  formatearDiaLargo,
} from '../../horarios/utils/calendario.util';
import { CitaFila, MedicoInfo, PacienteInfo, UsuarioRegistro } from '../interface/cita.interface';

export const ENTIDAD = {
  nombre: 'Hospital José Olaya',
  institucion: 'Ministerio de Salud',
};

export interface DatosComprobante {
  cita: CitaFila;
  paciente: PacienteInfo | null;
  medico: MedicoInfo | null;
  registradoPor: UsuarioRegistro | null;
  emitido: Date;
}

export function numeroCita(id: number): string {
  return `CM-${String(id).padStart(6, '0')}`;
}

export function dato(valor: string | null | undefined): string {
  return valor && valor.trim() !== '' ? valor : '-';
}

export function duracionMinutos(cita: CitaFila): number {
  return aMinutos(cita.salida) - aMinutos(cita.inicio);
}

export function fechaCitaLarga(cita: CitaFila): string {
  return formatearDiaLargo(fechaDesdeISO(cita.fecha));
}

export function fechaHoraCorta(fecha: Date): string {
  const dos = (n: number): string => String(n).padStart(2, '0');
  return `${dos(fecha.getDate())}/${dos(fecha.getMonth() + 1)}/${fecha.getFullYear()} ${dos(fecha.getHours())}:${dos(fecha.getMinutes())}`;
}

export function edadDesde(nacimiento: FechaApi | null | undefined): string {
  if (!nacimiento) {
    return '-';
  }

  const nacido = fechaDesdeISO(aFechaISO(nacimiento));
  const hoy = new Date();

  let anios = hoy.getFullYear() - nacido.getFullYear();
  const sinCumplir =
    hoy.getMonth() < nacido.getMonth() ||
    (hoy.getMonth() === nacido.getMonth() && hoy.getDate() < nacido.getDate());

  if (sinCumplir) {
    anios--;
  }

  return anios >= 0 ? `${anios} años` : '-';
}

export function nombrePaciente(datos: DatosComprobante): string {
  return datos.paciente
    ? `${datos.paciente.nombre} ${datos.paciente.apellidos}`.trim()
    : datos.cita.paciente;
}

export function documentoPaciente(datos: DatosComprobante): string {
  return datos.paciente
    ? `${datos.paciente.codigoTipoDocumento} ${datos.paciente.numeroDocumento}`.trim()
    : '';
}

export function nombreArchivoPdf(datos: DatosComprobante): string {
  return `Cita_${numeroCita(datos.cita.id)}_${datos.cita.fecha.replace(/-/g, '')}.pdf`;
}
