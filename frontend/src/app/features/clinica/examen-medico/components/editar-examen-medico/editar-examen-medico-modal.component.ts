import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExamenMedico } from '../../interface/examen-medico.interface';
import { TIPOS_EXAMEN } from '../../../citas/utils/atencion-clinica.util';
import { ExamenMedicoService } from '../../services/examen-medico.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-examen-medico-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-examen-medico-modal.component.html',
})
export class EditarExamenMedicoModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() examen!: ExamenMedico;
  @Output() onClose = new EventEmitter<void>();
  @Output() onExamenEditado = new EventEmitter<ExamenMedico>();

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

  ngOnInit(): void {
    this.examenForm = {
      nombre: this.examen.nombre ?? '',
      tipoExamen: this.examen.tipoExamen ?? '',
      descripcion: this.examen.descripcion ?? '',
    };
  }

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
      .actualizar(this.examen.id, { nombre, tipoExamen, descripcion: descripcion || null })
      .subscribe({
        next: (response) => {
          this.toastService.success(response?.mensaje || 'Examen médico actualizado con éxito');
          this.guardando = false;
          this.onExamenEditado.emit(response.object);
        },
        error: (error) => {
          console.error(error);
          this.toastService.error(
            error?.error?.mensaje || 'Hubo un error al actualizar el examen médico',
          );
          this.guardando = false;
        },
      });
  }
}
