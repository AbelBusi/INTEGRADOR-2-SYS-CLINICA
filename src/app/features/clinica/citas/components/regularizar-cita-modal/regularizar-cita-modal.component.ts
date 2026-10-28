import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { formatearFechaCorta } from '../../../horarios/utils/calendario.util';
import { CitaFila, ResolucionRegularizacion } from '../../interface/cita.interface';
import { limiteRegularizacion } from '../../utils/ventana-cita.util';

@Component({
  selector: 'app-regularizar-cita-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regularizar-cita-modal.component.html',
})
export class RegularizarCitaModalComponent {
  @Input({ required: true }) cita!: CitaFila;
  @Input() procesando = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<{
    resolucion: ResolucionRegularizacion;
    observacion: string;
  }>();

  readonly MAX = 300;

  resolucion = signal<ResolucionRegularizacion | null>(null);
  observacion = signal('');

  valido = computed(() => this.resolucion() !== null && this.observacion().trim().length > 0);

  fechaCorta(iso: string): string {
    return formatearFechaCorta(iso);
  }

  get textoLimite(): string {
    const limite = limiteRegularizacion(this.cita);
    const fecha = limite.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const hora = limite.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    return `${fecha} ${hora}`;
  }

  onClose(): void {
    if (!this.procesando) {
      this.close.emit();
    }
  }

  onConfirmar(): void {
    const resolucion = this.resolucion();

    if (!this.valido() || this.procesando || resolucion === null) {
      return;
    }

    this.confirmar.emit({ resolucion, observacion: this.observacion().trim() });
  }
}
