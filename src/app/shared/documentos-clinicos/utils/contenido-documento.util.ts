import { DiagnosticoDetalle } from '../../../features/clinica/citas/interface/atencion-clinica.interface';
import { etiquetaTipoDiagnostico, etiquetaUrgencia } from '../../../features/clinica/citas/utils/atencion-clinica.util';
import {
  DEFINICIONES_DOCUMENTOS,
  MOTIVOS_NO_DISPONIBLE,
} from '../constants/documento-clinico.constants';
import {
  ColumnaContenido,
  ContenidoDocumento,
  ContextoClinico,
  DatosIdentificacion,
  DefinicionDocumento,
  DocumentoDisponible,
  GrupoContenido,
  ParDato,
  TipoDocumentoClinico,
} from '../interface/documento-clinico.interface';
import { fechaHoraTexto, fechaTexto, numeroDocumento } from './documento-clinico.util';

const NOTA_RESUMEN =
  'Este documento resume la atención. Los tratamientos, indicaciones, exámenes y derivaciones se emiten en sus documentos independientes.';

function limpiar(pares: ParDato[]): ParDato[] {
  return pares.filter((par) => par.valor.trim() !== '');
}

function agruparPorDiagnostico<T>(
  detalles: DiagnosticoDetalle[],
  items: (detalle: DiagnosticoDetalle) => T[],
  columnas: ColumnaContenido[],
  fila: (item: T, indice: number) => string[],
): GrupoContenido[] {
  return detalles
    .filter((detalle) => items(detalle).length > 0)
    .map((detalle) => ({
      encabezado: `Diagnóstico: ${detalle.diagnostico.codigo} - ${detalle.diagnostico.descripcion}`,
      columnas,
      filas: items(detalle).map(fila),
    }));
}

function construirGrupos(tipo: TipoDocumentoClinico, ctx: ContextoClinico): GrupoContenido[] {
  const detalles = ctx.atencion.diagnosticos;

  switch (tipo) {
    case 'resumen':
      if (detalles.length === 0) {
        return [];
      }
      return [
        {
          encabezado: 'Diagnósticos',
          columnas: [
            { cabecera: 'Código', peso: 1.1, titulo: true },
            { cabecera: 'Diagnóstico', peso: 3 },
            { cabecera: 'Tipo', peso: 1.3 },
            { cabecera: 'Observaciones', peso: 3 },
          ],
          filas: detalles.map((d) => [
            d.diagnostico.codigo,
            d.diagnostico.descripcion,
            etiquetaTipoDiagnostico(d.diagnostico.tipoDiagnostico),
            d.diagnostico.observaciones,
          ]),
        },
        {
          encabezado: 'Registros asociados',
          columnas: [
            { cabecera: 'Diagnóstico', peso: 3, titulo: true },
            { cabecera: 'Tratamientos', peso: 1.2 },
            { cabecera: 'Indicaciones', peso: 1.2 },
            { cabecera: 'Exámenes', peso: 1.2 },
            { cabecera: 'Derivaciones', peso: 1.2 },
          ],
          filas: detalles.map((d) => [
            `${d.diagnostico.codigo} - ${d.diagnostico.descripcion}`,
            String(d.tratamientos.length),
            String(d.indicaciones.length),
            String(d.examenesSolicitados.length),
            String(d.derivaciones.length),
          ]),
        },
      ];

    case 'diagnostico':
      if (detalles.length === 0) {
        return [];
      }
      return [
        {
          encabezado: null,
          columnas: [
            { cabecera: 'Código', peso: 1.1, titulo: true },
            { cabecera: 'Descripción', peso: 3 },
            { cabecera: 'Tipo', peso: 1.3 },
            { cabecera: 'Fecha', peso: 1.6 },
            { cabecera: 'Observaciones', peso: 3 },
          ],
          filas: detalles.map((d) => [
            d.diagnostico.codigo,
            d.diagnostico.descripcion,
            etiquetaTipoDiagnostico(d.diagnostico.tipoDiagnostico),
            fechaHoraTexto(d.diagnostico.fecDiagnostico),
            d.diagnostico.observaciones,
          ]),
        },
      ];

    case 'tratamientos':
      return agruparPorDiagnostico(
        detalles,
        (d) => d.tratamientos,
        [
          { cabecera: 'Medicamento', peso: 3, titulo: true },
          { cabecera: 'Dosis', peso: 1.6 },
          { cabecera: 'Vía', peso: 1.3 },
          { cabecera: 'Frecuencia', peso: 2 },
          { cabecera: 'Duración', peso: 1.4 },
          { cabecera: 'Cantidad', peso: 1.2 },
          { cabecera: 'Indicación', peso: 3.5 },
        ],
        (t) => [
          t.nombreMedicamento,
          t.dosis,
          t.viaAdministracion,
          t.frecuencia,
          `${t.duracionDias} día(s)`,
          String(t.totCantidad),
          t.descIndicacion,
        ],
      );

    case 'indicaciones':
      return agruparPorDiagnostico(
        detalles,
        (d) => d.indicaciones,
        [
          { cabecera: 'Tipo', peso: 1.8, titulo: true },
          { cabecera: 'Descripción', peso: 4 },
          { cabecera: 'Frecuencia', peso: 1.8 },
          { cabecera: 'Reposo', peso: 1.4 },
        ],
        (i) => [
          i.tipoIndicacion,
          i.descripcion,
          i.frecuencia,
          i.diasReposo > 0 ? `${i.diasReposo} día(s)` : 'Sin reposo',
        ],
      );

    case 'examenes':
      return agruparPorDiagnostico(
        detalles,
        (d) => d.examenesSolicitados,
        [{ cabecera: 'Examen / motivo', peso: 6, titulo: true }],
        (e, indice) => [`${indice + 1}. ${e.motivo}`],
      );

    case 'derivaciones':
      return agruparPorDiagnostico(
        detalles,
        (d) => d.derivaciones,
        [
          { cabecera: 'Especialidad', peso: 2.6, titulo: true },
          { cabecera: 'Urgencia', peso: 1.5 },
          { cabecera: 'Motivo', peso: 5 },
        ],
        (d) => [d.nombreEspecialidad, etiquetaUrgencia(d.urgencia), d.motivo],
      );
  }
}

function cantidadRegistros(tipo: TipoDocumentoClinico, ctx: ContextoClinico): number {
  const detalles = ctx.atencion.diagnosticos;
  const sumar = (seleccionar: (d: DiagnosticoDetalle) => number): number =>
    detalles.reduce((total, d) => total + seleccionar(d), 0);

  switch (tipo) {
    case 'resumen':
    case 'diagnostico':
      return detalles.length;
    case 'tratamientos':
      return sumar((d) => d.tratamientos.length);
    case 'indicaciones':
      return sumar((d) => d.indicaciones.length);
    case 'examenes':
      return sumar((d) => d.examenesSolicitados.length);
    case 'derivaciones':
      return sumar((d) => d.derivaciones.length);
  }
}

export function construirContenido(
  definicion: DefinicionDocumento,
  ctx: ContextoClinico,
): ContenidoDocumento {
  return {
    definicion,
    numero: numeroDocumento(definicion.prefijo, ctx.cita.id),
    grupos: construirGrupos(definicion.tipo, ctx),
    nota: definicion.tipo === 'resumen' ? NOTA_RESUMEN : null,
  };
}

export function construirIdentificacion(ctx: ContextoClinico): DatosIdentificacion {
  const paciente = ctx.paciente;
  const medico = ctx.medico;
  const documento = [paciente.tipoDocumento, paciente.numeroDocumento]
    .filter((valor) => valor.trim() !== '')
    .join(' ');

  return {
    paciente: limpiar([
      { etiqueta: 'Paciente', valor: paciente.nombreCompleto },
      { etiqueta: 'Documento', valor: documento },
      { etiqueta: 'Fecha de nacimiento', valor: paciente.fechaNacimiento },
      { etiqueta: 'Edad', valor: paciente.edad },
      { etiqueta: 'Sexo', valor: paciente.genero },
      { etiqueta: 'Cód. asegurado', valor: paciente.codigoAsegurado },
      { etiqueta: 'Entidad asegurada', valor: paciente.entidadAsegurado },
    ]),
    atencion: limpiar([
      { etiqueta: 'N° de atención', valor: ctx.numeroAtencion },
      { etiqueta: 'Fecha de atención', valor: fechaTexto(ctx.cita.fecha) },
      { etiqueta: 'Horario', valor: `${ctx.cita.inicio} - ${ctx.cita.salida}` },
      { etiqueta: 'Médico tratante', valor: medico.nombreCompleto },
      { etiqueta: 'Especialidad', valor: medico.especialidad },
      { etiqueta: 'Colegiatura', valor: medico.numeroColegiatura },
      { etiqueta: 'Reg. especialidad', valor: medico.numeroEspecialidad },
      { etiqueta: 'Consejo regional', valor: medico.consejoRegional },
    ]),
    motivo: ctx.cita.motivo.trim(),
  };
}

export function evaluarDisponibilidad(ctx: ContextoClinico): DocumentoDisponible[] {
  return DEFINICIONES_DOCUMENTOS.map((definicion) => {
    const cantidad = cantidadRegistros(definicion.tipo, ctx);

    return {
      ...definicion,
      disponible: cantidad > 0,
      cantidad,
      motivoNoDisponible: cantidad > 0 ? '' : MOTIVOS_NO_DISPONIBLE[definicion.tipo],
    };
  });
}
