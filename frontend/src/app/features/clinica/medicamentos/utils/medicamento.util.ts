import { environment } from '../../../../../environments/environment';
import { GRUPOS_TERAPEUTICOS, INDICACIONES_TERAPEUTICAS } from '../constants/medicamento.constants';

export function textoGrupo(valor: string | null | undefined): string {
  return GRUPOS_TERAPEUTICOS.find((g) => g.valor === valor)?.texto ?? '';
}

export function textoIndicacion(valor: string | null | undefined): string {
  return INDICACIONES_TERAPEUTICAS.find((i) => i.valor === valor)?.texto ?? '';
}

/**
 * El backend devuelve la imagen como ruta relativa (/uploads/MEDICAMENTOS/...). Se completa con el
 * servidor del API. Si ya tienes un helper para las fotos de empleados, puedes usarlo en su lugar.
 */
export function urlImagen(foto: string | null | undefined): string | null {
  if (!foto) {
    return null;
  }

  if (/^https?:\/\//i.test(foto)) {
    return foto;
  }

  let origen = '';
  try {
    origen = new URL(environment.apiUrl, window.location.origin).origin;
  } catch {
    origen = '';
  }

  return `${origen}${foto.startsWith('/') ? '' : '/'}${foto}`;
}

/**
 * Texto que se guarda en Tratamiento.nombreMedicamento al elegir del catálogo: "Nombre concentración"
 * (ej. "Paracetamol 500 mg"). Tratamiento no tiene relación con Medicamento, así que se guarda el texto.
 * Si quieres guardar solo el nombre, cambia únicamente esta función. Máx. 100 (límite del campo).
 */
export function etiquetaMedicamento(m: { nombre: string; concentracion: string | null }): string {
  const texto = m.concentracion ? `${m.nombre} ${m.concentracion}` : m.nombre;
  return texto.slice(0, 100);
}

export function formatearFechaHora(valor: string | null | undefined): string {
  if (!valor) {
    return '-';
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return '-';
  }

  return fecha.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Mensaje del backend si existe; si no, el texto por defecto. */
export function mensajeError(error: any, porDefecto: string): string {
  return error?.error?.mensaje || porDefecto;
}
