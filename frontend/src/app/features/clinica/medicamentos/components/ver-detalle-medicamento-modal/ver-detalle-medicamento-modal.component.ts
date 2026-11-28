import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Medicamento } from '../../interface/medicamento.interface';
import {
  formatearFechaHora,
  textoGrupo,
  textoIndicacion,
  urlImagen,
} from '../../utils/medicamento.util';

/** Detalle de un medicamento (solo lectura). */
@Component({
  selector: 'app-ver-detalle-medicamento-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-detalle-medicamento-modal.component.html',
})
export class VerDetalleMedicamentoModalComponent {
  @Input({ required: true }) medicamento!: Medicamento;
  @Output() cerrar = new EventEmitter<void>();

  readonly fechaHora = formatearFechaHora;
  readonly grupo = textoGrupo;
  readonly indicacion = textoIndicacion;

  get imagen(): string | null {
    return urlImagen(this.medicamento.foto);
  }
}
