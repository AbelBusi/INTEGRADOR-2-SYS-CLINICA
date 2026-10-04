import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Especialidad } from '../../interface/especialidad.interface';

@Component({
  selector: 'app-ver-detalle-especialidad-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-detalle-especialidad-modal.component.html',
})
export class VerDetalleEspecialidadModalComponent {
  @Input() especialidad: Especialidad | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
