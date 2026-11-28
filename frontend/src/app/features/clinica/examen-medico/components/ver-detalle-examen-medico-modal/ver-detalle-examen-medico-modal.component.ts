import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamenMedico } from '../../interface/examen-medico.interface';

@Component({
  selector: 'app-ver-detalle-examen-medico-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-detalle-examen-medico-modal.component.html',
})
export class VerDetalleExamenMedicoModalComponent {
  @Input({ required: true }) examen!: ExamenMedico;
  @Output() close = new EventEmitter<void>();
}
