import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  aMinutos,
  formatearDuracion,
  formatearFechaCorta,
} from '../../../horarios/utils/calendario.util';
import { CitaFila, infoEstado } from '../../interface/cita.interface';

@Component({
  selector: 'app-ver-detalle-cita-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-detalle-cita-modal.component.html',
})
export class VerDetalleCitaModalComponent {
  @Input() cita: CitaFila | null = null;
  @Output() close = new EventEmitter<void>();

  get estado() {
    return infoEstado(this.cita?.estado ?? 0);
  }

  get fecha(): string {
    return this.cita ? formatearFechaCorta(this.cita.fecha) : '';
  }

  get duracion(): string {
    return this.cita
      ? formatearDuracion(aMinutos(this.cita.salida) - aMinutos(this.cita.inicio))
      : '';
  }

  onClose(): void {
    this.close.emit();
  }
}
