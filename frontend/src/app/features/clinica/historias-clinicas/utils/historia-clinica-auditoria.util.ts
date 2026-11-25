import {
  OPCIONES_FACTOR_RH,
  OPCIONES_PARENTESCO,
  OPCIONES_TIPO_ALERGIA,
  OPCIONES_TIPO_ANTECEDENTE_FAMILIAR,
  OPCIONES_TIPO_ANTECEDENTE_PERSONAL,
} from '../constants/historia-clinica.constants';
import {
  AuditoriaHistoria,
  EntidadAuditoriaHC,
  HistoriaClinica,
  OperacionAuditoriaHC,
} from '../interface/historia-clinica.interface';
import { etiqueta, formatearFechaHora } from './historia-clinica.util';

/** Un campo que cambió: valor anterior -> valor nuevo. */
export interface CambioAuditoria {
  campo: string;
  anterior: string;
  nuevo: string;
}

/** Un dato de un registro recién creado o dado de baja. */
export interface DatoAuditoria {
  campo: string;
  valor: string;
}

/** Evento de auditoría ya traducido para mostrarlo al usuario. */
export interface EventoAuditoriaVista {
  id: number;
  operacion: OperacionAuditoriaHC;
  titulo: string;
  /** Nombre del registro afectado (alergia, antecedente). Vacío para la información general. */
  registro: string;
  usuario: string;
  fecha: string;
  cambios: CambioAuditoria[];
  datos: DatoAuditoria[];
}

const SIN_DATO = 'Sin dato';

const TITULOS: Record<EntidadAuditoriaHC, Record<OperacionAuditoriaHC, string>> = {
  HISTORIA_CLINICA: {
    CREACION: 'Historia clínica creada',
    MODIFICACION: 'Información general actualizada',
    ELIMINACION: 'Historia clínica dada de baja',
  },
  ANTECEDENTE_PERSONAL: {
    CREACION: 'Antecedente personal registrado',
    MODIFICACION: 'Antecedente personal actualizado',
    ELIMINACION: 'Antecedente personal eliminado',
  },
  ANTECEDENTE_FAMILIAR: {
    CREACION: 'Antecedente familiar registrado',
    MODIFICACION: 'Antecedente familiar actualizado',
    ELIMINACION: 'Antecedente familiar eliminado',
  },
  ALERGIA: {
    CREACION: 'Alergia registrada',
    MODIFICACION: 'Alergia actualizada',
    ELIMINACION: 'Alergia eliminada',
  },
};

const ETIQUETAS_CAMPO: Record<string, string> = {
  numeroHistoria: 'N° de historia',
  grupoSanguineo: 'Grupo sanguíneo',
  factorRh: 'Factor Rh',
  observaciones: 'Observaciones',
  tipo: 'Tipo',
  descripcion: 'Descripción',
  anio: 'Año',
  observacion: 'Observación',
  parentesco: 'Parentesco',
  sustancia: 'Sustancia',
  tipoAlergia: 'Tipo de alergia',
  reaccion: 'Reacción',
  estado: 'Estado',
};

function etiquetaCampo(campo: string): string {
  return ETIQUETAS_CAMPO[campo] ?? campo;
}

function vacio(valor: unknown): boolean {
  return valor === null || valor === undefined || valor === '';
}

function textoValor(entidad: EntidadAuditoriaHC, campo: string, valor: unknown): string {
  if (vacio(valor)) {
    return SIN_DATO;
  }

  const v = String(valor);

  switch (campo) {
    case 'tipo':
      return etiqueta<string>(
        entidad === 'ANTECEDENTE_FAMILIAR'
          ? OPCIONES_TIPO_ANTECEDENTE_FAMILIAR
          : OPCIONES_TIPO_ANTECEDENTE_PERSONAL,
        v,
        v,
      );
    case 'parentesco':
      return etiqueta<string>(OPCIONES_PARENTESCO, v, v);
    case 'factorRh':
      return etiqueta<string>(OPCIONES_FACTOR_RH, v, v);
    case 'tipoAlergia':
      return etiqueta<string>(OPCIONES_TIPO_ALERGIA, v, v);
    case 'estado':
      return v === '0' ? 'Eliminado' : v === '1' ? 'Activo' : v;
    default:
      return v;
  }
}

function texto(valor: unknown): string {
  return typeof valor === 'string' && valor.trim() ? valor.trim() : '';
}

/**
 * Nombre del registro afectado. En una modificación solo vienen los campos que cambiaron, así que si
 * el evento no lo trae se busca entre los registros vigentes de la historia.
 */
function nombreRegistro(e: AuditoriaHistoria, historia: HistoriaClinica | null): string {
  const nuevos = e.datosNuevos ?? {};
  const anteriores = e.datosAnteriores ?? {};

  switch (e.entidad) {
    case 'HISTORIA_CLINICA':
      return '';

    case 'ALERGIA':
      return (
        texto(nuevos['sustancia']) ||
        texto(anteriores['sustancia']) ||
        historia?.alergias.find((a) => a.id === e.idRegistro)?.sustancia ||
        `Registro N° ${e.idRegistro}`
      );

    case 'ANTECEDENTE_PERSONAL':
      return (
        texto(nuevos['descripcion']) ||
        texto(anteriores['descripcion']) ||
        historia?.antecedentesPersonales.find((a) => a.id === e.idRegistro)?.descripcion ||
        `Registro N° ${e.idRegistro}`
      );

    case 'ANTECEDENTE_FAMILIAR':
      return (
        texto(nuevos['descripcion']) ||
        texto(anteriores['descripcion']) ||
        historia?.antecedentesFamiliares.find((a) => a.id === e.idRegistro)?.descripcion ||
        `Registro N° ${e.idRegistro}`
      );
  }
}

export function construirEventoVista(
  e: AuditoriaHistoria,
  historia: HistoriaClinica | null,
): EventoAuditoriaVista {
  const anteriores = e.datosAnteriores ?? {};
  const nuevos = e.datosNuevos ?? {};

  let cambios: CambioAuditoria[] = [];
  let datos: DatoAuditoria[] = [];

  if (e.operacion === 'MODIFICACION') {
    cambios = Object.keys(nuevos).map((campo) => ({
      campo: etiquetaCampo(campo),
      anterior: textoValor(e.entidad, campo, anteriores[campo]),
      nuevo: textoValor(e.entidad, campo, nuevos[campo]),
    }));
  } else {
    // Creación: lo que se registró. Eliminación: lo que tenía el registro al darse de baja.
    const fuente = e.operacion === 'CREACION' ? nuevos : anteriores;

    datos = Object.keys(fuente)
      .filter((campo) => campo !== 'estado' && !vacio(fuente[campo]))
      .map((campo) => ({
        campo: etiquetaCampo(campo),
        valor: textoValor(e.entidad, campo, fuente[campo]),
      }));
  }

  return {
    id: e.id,
    operacion: e.operacion,
    titulo: TITULOS[e.entidad]?.[e.operacion] ?? `${e.operacion} · ${e.entidad}`,
    registro: nombreRegistro(e, historia),
    usuario: e.usuario,
    fecha: formatearFechaHora(e.fechaEvento),
    cambios,
    datos,
  };
}
