import { AtencionClinica } from '../../../features/clinica/citas/interface/atencion-clinica.interface';
import { CitaFila, MedicoInfo, PacienteInfo } from '../../../features/clinica/citas/interface/cita.interface';
import {
  ContextoClinico,
  DatosMedico,
  DatosPaciente,
} from '../interface/documento-clinico.interface';

const dos = (valor: number): string => String(valor).padStart(2, '0');

export function aFecha(valor: unknown): Date | null {
  if (!valor) {
    return null;
  }

  if (valor instanceof Date) {
    return valor;
  }

  if (Array.isArray(valor)) {
    const [anio, mes, dia, hora = 0, minuto = 0] = valor as number[];
    return new Date(anio, mes - 1, dia, hora, minuto);
  }

  if (typeof valor === 'string') {
    const texto = valor.trim();
    const coincidencia = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(texto);

    if (coincidencia) {
      return new Date(
        Number(coincidencia[1]),
        Number(coincidencia[2]) - 1,
        Number(coincidencia[3]),
        Number(coincidencia[4] ?? 0),
        Number(coincidencia[5] ?? 0),
      );
    }

    const fecha = new Date(texto);
    return isNaN(fecha.getTime()) ? null : fecha;
  }

  if (typeof valor === 'object') {
    const objeto = valor as { year?: number; month?: number; day?: number };
    if (objeto.year && objeto.month && objeto.day) {
      return new Date(objeto.year, objeto.month - 1, objeto.day);
    }
  }

  return null;
}

export function fechaTexto(valor: unknown): string {
  const fecha = aFecha(valor);
  return fecha ? `${dos(fecha.getDate())}/${dos(fecha.getMonth() + 1)}/${fecha.getFullYear()}` : '';
}

export function fechaHoraTexto(valor: unknown): string {
  const fecha = aFecha(valor);
  return fecha ? `${fechaTexto(fecha)} ${dos(fecha.getHours())}:${dos(fecha.getMinutes())}` : '';
}

export function edadTexto(nacimiento: unknown, referencia: Date): string {
  const fecha = aFecha(nacimiento);

  if (!fecha) {
    return '';
  }

  let anios = referencia.getFullYear() - fecha.getFullYear();
  const cumplio =
    referencia.getMonth() > fecha.getMonth() ||
    (referencia.getMonth() === fecha.getMonth() && referencia.getDate() >= fecha.getDate());

  if (!cumplio) {
    anios -= 1;
  }

  if (anios >= 1) {
    return `${anios} ${anios === 1 ? 'año' : 'años'}`;
  }

  const meses = Math.max(
    0,
    (referencia.getFullYear() - fecha.getFullYear()) * 12 +
      referencia.getMonth() -
      fecha.getMonth() -
      (referencia.getDate() < fecha.getDate() ? 1 : 0),
  );

  return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
}

function generoTexto(genero: string | null | undefined): string {
  const valor = (genero ?? '').trim();

  switch (valor.toUpperCase()) {
    case 'M':
      return 'Masculino';
    case 'F':
      return 'Femenino';
    default:
      return valor;
  }
}

export function numeroAtencion(idCita: number): string {
  return `ATN-${String(idCita).padStart(6, '0')}`;
}

export function numeroDocumento(prefijo: string, idCita: number): string {
  return `${prefijo}-${String(idCita).padStart(6, '0')}`;
}

export function sanitizarNombreArchivo(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '_');
}

export function construirContexto(
  cita: CitaFila,
  atencion: AtencionClinica | null | undefined,
  paciente: PacienteInfo | null,
  medico: MedicoInfo | null,
): ContextoClinico {
  const emitidoEn = new Date();

  const datosPaciente: DatosPaciente = {
    nombreCompleto: paciente ? `${paciente.nombre} ${paciente.apellidos}`.trim() : cita.paciente,
    tipoDocumento: paciente?.codigoTipoDocumento ?? '',
    numeroDocumento: paciente?.numeroDocumento ?? '',
    fechaNacimiento: paciente ? fechaTexto(paciente.fechaNacimiento) : '',
    edad: paciente ? edadTexto(paciente.fechaNacimiento, emitidoEn) : '',
    genero: generoTexto(paciente?.genero),
    codigoAsegurado: paciente?.codigoAsegurado ?? '',
    entidadAsegurado: paciente?.entidadAsegurado ?? '',
  };

  const datosMedico: DatosMedico = {
    nombreCompleto: medico ? `${medico.nombre} ${medico.apellidos}`.trim() : cita.medico,
    especialidad: medico?.especialidad ?? '',
    numeroColegiatura: medico?.numeroColegiatura ?? '',
    numeroEspecialidad: medico?.numeroEspecialidad ?? '',
    consejoRegional: medico?.consejoRegional ?? '',
  };

  return {
    cita,
    atencion: atencion ?? { cita, diagnosticos: [] },
    paciente: datosPaciente,
    medico: datosMedico,
    numeroAtencion: numeroAtencion(cita.id),
    emitidoEn,
  };
}
