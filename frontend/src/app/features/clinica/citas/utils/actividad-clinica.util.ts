import { AtencionClinica } from '../interface/atencion-clinica.interface';
import { DocumentoReporte } from '../interface/reporte-cita-extra.interface';
import { FilaGrafico, TarjetaReporte } from '../interface/reporte-cita.interface';
import { ConteoEtiquetado, ResumenActividadClinica } from '../interface/reporte-medico.interface';
import { normalizar } from '../../horarios/utils/calendario.util';
import { etiquetaTipoDiagnostico, etiquetaUrgencia } from './atencion-clinica.util';
import { porcentaje } from './reporte-cita.util';

function agrupar<T>(
  items: T[],
  clave: (item: T) => string,
  etiqueta: (item: T) => string,
  base: number,
): ConteoEtiquetado[] {
  const mapa = new Map<string, ConteoEtiquetado>();

  items.forEach((item) => {
    const llave = normalizar((clave(item) ?? '').trim());

    if (!llave) {
      return;
    }

    const actual = mapa.get(llave);

    if (actual) {
      actual.total += 1;
    } else {
      mapa.set(llave, {
        clave: llave,
        etiqueta: (etiqueta(item) ?? '').trim(),
        detalle: '',
        total: 1,
      });
    }
  });

  return [...mapa.values()]
    .sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta, 'es'))
    .map((conteo) => ({ ...conteo, detalle: porcentaje(conteo.total, base) }));
}

export function resumirActividad(atenciones: AtencionClinica[]): ResumenActividadClinica {
  const detalles = atenciones.flatMap((atencion) => atencion.diagnosticos);
  const tratamientos = detalles.flatMap((detalle) => detalle.tratamientos);
  const indicaciones = detalles.flatMap((detalle) => detalle.indicaciones);
  const examenes = detalles.flatMap((detalle) => detalle.examenesSolicitados);
  const derivaciones = detalles.flatMap((detalle) => detalle.derivaciones);

  const topDiagnosticos = agrupar(
    detalles,
    (detalle) => detalle.diagnostico.codigo,
    (detalle) => `${detalle.diagnostico.codigo} · ${detalle.diagnostico.descripcion}`,
    detalles.length,
  );

  return {
    atenciones: atenciones.length,
    diagnosticos: detalles.length,
    diagnosticosDistintos: topDiagnosticos.length,
    tratamientos: tratamientos.length,
    indicaciones: indicaciones.length,
    examenes: examenes.length,
    derivaciones: derivaciones.length,
    conDerivacion: atenciones.filter((atencion) =>
      atencion.diagnosticos.some((detalle) => detalle.derivaciones.length > 0),
    ).length,
    topDiagnosticos,
    tiposDiagnostico: agrupar(
      detalles,
      (detalle) => String(detalle.diagnostico.tipoDiagnostico),
      (detalle) => etiquetaTipoDiagnostico(detalle.diagnostico.tipoDiagnostico),
      detalles.length,
    ),
    topMedicamentos: agrupar(
      tratamientos,
      (tratamiento) => tratamiento.nombreMedicamento,
      (tratamiento) => tratamiento.nombreMedicamento,
      tratamientos.length,
    ),
    topExamenes: agrupar(
      examenes,
      (examen) => examen.nombreExamen,
      (examen) => examen.nombreExamen,
      examenes.length,
    ),
    topEspecialidades: agrupar(
      derivaciones,
      (derivacion) => derivacion.nombreEspecialidad,
      (derivacion) => derivacion.nombreEspecialidad,
      derivaciones.length,
    ),
    urgencias: agrupar(
      derivaciones,
      (derivacion) => String(derivacion.urgencia),
      (derivacion) => etiquetaUrgencia(derivacion.urgencia),
      derivaciones.length,
    ),
  };
}

export function filasConteo(
  conteos: ConteoEtiquetado[],
  color: string,
  limite = 10,
): FilaGrafico[] {
  return conteos.slice(0, limite).map((conteo) => ({
    clave: conteo.clave,
    etiqueta: conteo.etiqueta,
    segmentos: [{ valor: conteo.total, color, texto: conteo.etiqueta }],
    total: conteo.total,
    detalle: conteo.detalle,
  }));
}

export function tarjetasActividad(resumen: ResumenActividadClinica): TarjetaReporte[] {
  return [
    {
      clave: 'atenciones',
      texto: 'Atenciones',
      valor: resumen.atenciones,
      detalle: 'Analizadas',
      color: '#262626',
    },
    {
      clave: 'diagnosticos',
      texto: 'Diagnósticos',
      valor: resumen.diagnosticos,
      detalle: `${resumen.diagnosticosDistintos} distintos`,
      color: '#58595B',
    },
    {
      clave: 'tratamientos',
      texto: 'Tratamientos',
      valor: resumen.tratamientos,
      detalle: 'Medicamentos prescritos',
      color: '#0d6b68',
    },
    {
      clave: 'indicaciones',
      texto: 'Indicaciones',
      valor: resumen.indicaciones,
      detalle: 'Registradas',
      color: '#B5B6B8',
    },
    {
      clave: 'examenes',
      texto: 'Exámenes',
      valor: resumen.examenes,
      detalle: 'Solicitados',
      color: '#58595B',
    },
    {
      clave: 'derivaciones',
      texto: 'Derivaciones',
      valor: resumen.derivaciones,
      detalle: `${resumen.conDerivacion} atenciones`,
      color: '#D9182A',
    },
  ];
}

export function documentoActividad(datos: {
  resumen: ResumenActividadClinica;
  periodo: string;
  medico: string;
  truncado: boolean;
  limite: number;
}): DocumentoReporte {
  const { resumen } = datos;
  const filtros = [`Médico: ${datos.medico}`, `Atenciones analizadas: ${resumen.atenciones}`];

  if (datos.truncado) {
    filtros.push(`Se analizaron las ${datos.limite} atenciones más recientes`);
  }

  return {
    titulo: 'Actividad clínica del médico',
    archivo: 'actividad-clinica',
    periodo: datos.periodo,
    filtros,
    tarjetas: tarjetasActividad(resumen),
    secciones: [
      {
        tipo: 'barras',
        titulo: 'Diagnósticos más frecuentes',
        filas: filasConteo(resumen.topDiagnosticos, '#58595B'),
        leyenda: false,
      },
      {
        tipo: 'barras',
        titulo: 'Medicamentos más prescritos',
        filas: filasConteo(resumen.topMedicamentos, '#0d6b68'),
        leyenda: false,
      },
      {
        tipo: 'barras',
        titulo: 'Exámenes más solicitados',
        filas: filasConteo(resumen.topExamenes, '#58595B'),
        leyenda: false,
      },
      {
        tipo: 'barras',
        titulo: 'Derivaciones por especialidad',
        filas: filasConteo(resumen.topEspecialidades, '#D9182A'),
        leyenda: false,
      },
      {
        tipo: 'barras',
        titulo: 'Derivaciones por urgencia',
        filas: filasConteo(resumen.urgencias, '#B5B6B8'),
        leyenda: false,
      },
      {
        tipo: 'barras',
        titulo: 'Diagnósticos por tipo',
        filas: filasConteo(resumen.tiposDiagnostico, '#B5B6B8'),
        leyenda: false,
      },
      {
        tipo: 'tabla',
        titulo: 'Detalle de diagnósticos',
        cabecera: ['Código y diagnóstico', 'Casos', '% del total'],
        filas: resumen.topDiagnosticos
          .slice(0, 20)
          .map((conteo) => [conteo.etiqueta, String(conteo.total), conteo.detalle]),
        pesos: [5, 1, 1.4],
        centradas: [1, 2],
        nota: 'Información agregada: no incluye datos de identificación de los pacientes.',
      },
    ],
    csv: {
      cabecera: ['Código y diagnóstico', 'Casos', 'Porcentaje'],
      filas: resumen.topDiagnosticos.map((conteo) => [
        conteo.etiqueta,
        String(conteo.total),
        conteo.detalle,
      ]),
    },
  };
}
