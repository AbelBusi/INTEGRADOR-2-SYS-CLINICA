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
