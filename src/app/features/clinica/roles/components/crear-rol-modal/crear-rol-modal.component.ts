import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../services/rol.service';
import { RolCrearDTO } from '../../interface/rol.interface';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-crear-rol-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-rol-modal.component.html',
})
export class CrearRolModalComponent {
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onRolCreado = new EventEmitter<void>();

  rolForm: RolCrearDTO = {
    nombre: '',
    descripcion: ''
  };

  constructor(
    private readonly rolService: RolService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  handleClose() {
    this.resetForm();
    this.onClose.emit();
    this.cdr.detectChanges();
  }

  private resetForm() {
    this.rolForm = {
      nombre: '',
      descripcion: ''
    };
  }

  onSubmit() {
    if (!this.rolForm.nombre.trim() || !this.rolForm.descripcion.trim()) {
      this.toastService.warning('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.rolService.crear(this.rolForm).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.onRolCreado.emit();
        this.handleClose();
      },
      error: (err) => {
        console.error('Error al guardar el rol:', err);
        const mensajeError = err.error?.mensaje || 'No se pudo registrar el rol.';
        this.toastService.error(mensajeError);
      },
    });
  }
}
