import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialidadService } from '../../services/especialidad.service';
import { EspecialidadCrearDTO } from '../../interface/especialidad.interface';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-crear-especialidad-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-especialidad-modal.component.html',
})
export class CrearEspecialidadModalComponent {
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEspecialidadCreada = new EventEmitter<void>();

  especialidadForm: EspecialidadCrearDTO = {
    nombre: '',
    descripcion: '',
    estado: 1,
  };

  constructor(
    private readonly especialidadService: EspecialidadService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  handleClose() {
    this.resetForm();
    this.onClose.emit();
    this.cdr.detectChanges();
  }

  private resetForm() {
    this.especialidadForm = {
      nombre: '',
      descripcion: '',
      estado: 1,
    };
  }

  onSubmit() {
    if (!this.especialidadForm.nombre.trim() || !this.especialidadForm.descripcion.trim()) {
      this.toastService.warning('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.especialidadService.crear(this.especialidadForm).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.onEspecialidadCreada.emit();
        this.handleClose();
      },
      error: (err) => {
        console.error('Error al guardar la especialidad:', err);
        const mensajeError = err.error?.mensaje || 'No se pudo registrar la especialidad.';
        this.toastService.error(mensajeError);
      },
    });
  }
}
