import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { formatearFechaCorta } from '../../../horarios/utils/calendario.util';
import { CitaFila } from '../../interface/cita.interface';

@Component({
  selector: 'app-observacion-cita-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './observacion-cita-modal.component.html',
})
export class ObservacionCitaModalComponent {
  @Input({ required: true }) cita!: CitaFila;
  @Input() titulo = 'Confirmar acción';
  @Input() descripcion = '';
  @Input() etiquetaCampo = 'Observación (opcional)';
  @Input() placeholder = 'Escribe una observación...';
  @Input() textoConfirmar = 'Confirmar';
  @Input() icono = 'event';
  @Input() variante: 'peligro' | 'exito' = 'peligro';
  @Input() procesando = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<string>();

  readonly MAX = 300;
  observacion = signal('');

  fechaCorta(iso: string): string {
    return formatearFechaCorta(iso);
  }

  onClose(): void {
    if (!this.procesando) {
      this.close.emit();
    }
  }

  onConfirmar(): void {
    if (!this.procesando) {
      this.confirmar.emit(this.observacion().trim());
    }
  }
}
