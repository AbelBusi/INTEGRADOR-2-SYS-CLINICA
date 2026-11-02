export const ESTADO_DERIVACION = {
  ELIMINADA: 0,
  PENDIENTE: 1,
  PROGRAMADA: 2,
  CANCELADA: 3,
} as const;

export function mensajeBloqueoDerivacion(estado: number): string {
  switch (estado) {
    case ESTADO_DERIVACION.PROGRAMADA:
      return 'Esta derivación ya tiene una cita programada y no puede reutilizarse.';
    case ESTADO_DERIVACION.CANCELADA:
      return 'Esta derivación fue cancelada y no puede reutilizarse.';
    default:
      return 'Esta derivación no está disponible.';
  }
}

export function etiquetaEstadoDerivacion(estado: number): string {
  switch (estado) {
    case ESTADO_DERIVACION.PENDIENTE:
      return 'Pendiente';
    case ESTADO_DERIVACION.PROGRAMADA:
      return 'Programada';
    case ESTADO_DERIVACION.CANCELADA:
      return 'Cancelada';
    default:
      return 'Eliminada';
  }
}

export function clasesEstadoDerivacion(estado: number): string {
  switch (estado) {
    case ESTADO_DERIVACION.PENDIENTE:
      return 'border-[#58595B] bg-white text-[#58595B]';
    case ESTADO_DERIVACION.PROGRAMADA:
      return 'border-[#0d6b68] bg-[#0d6b68]/10 text-[#0d6b68]';
    case ESTADO_DERIVACION.CANCELADA:
      return 'border-[#D9182A] bg-[#D9182A]/10 text-[#D9182A]';
    default:
      return 'border-neutral-300 bg-neutral-100 text-neutral-500';
  }
}
