import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TIPOS_EXAMEN } from '../../../citas/utils/atencion-clinica.util';
import { ExamenMedicoService } from '../../services/examen-medico.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-crear-examen-medico-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-examen-medico-modal.component.html',
})
export class CrearExamenMedicoModalComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onExamenCreado = new EventEmitter<void>();

  readonly tiposExamen = TIPOS_EXAMEN;
  guardando = false;

  examenForm = {
    nombre: '',
    tipoExamen: '',
    descripcion: '',
  };

  constructor(
    private readonly examenService: ExamenMedicoService,
    private readonly toastService: ToastService,
  ) {}

  handleClose(): void {
    this.onClose.emit();
  }

  onSubmit(): void {
    if (this.guardando) {
      return;
    }

    const nombre = this.examenForm.nombre.trim();
    const tipoExamen = this.examenForm.tipoExamen.trim();
    const descripcion = this.examenForm.descripcion.trim();

    if (!nombre || !tipoExamen) {
      return;
    }

    this.guardando = true;

    this.examenService
      .crear({ nombre, tipoExamen, descripcion: descripcion || null })
      .subscribe({
        next: (response) => {
          this.toastService.success(response?.mensaje || 'Examen médico registrado con éxito');
          this.guardando = false;
          this.onExamenCreado.emit();
          this.onClose.emit();
        },
        error: (error) => {
          console.error(error);
          this.toastService.error(
            error?.error?.mensaje || 'Hubo un error al registrar el examen médico',
          );
          this.guardando = false;
        },
      });
  }
}
