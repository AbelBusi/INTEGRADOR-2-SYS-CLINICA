import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CargoService } from '../../services/cargo.service';
import { CargoCrearDTO } from '../../interface/cargo.interface';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-crear-cargo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-cargo-modal.component.html',
})
export class CrearCargoModalComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onCargoCreado = new EventEmitter<void>();

  cargoForm: CargoCrearDTO = {
    nombre: '',
    descripcion: '',
    esPersonalMedico: false,
  };

  constructor(
    private readonly cargoService: CargoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  handleClose(): void {
    this.resetForm();
    this.onClose.emit();
    this.cdr.detectChanges();
  }

  soloLetras(event: KeyboardEvent): void {
    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  limpiarNombre(): void {
    this.cargoForm.nombre = this.cargoForm.nombre.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g,
      '',
    );
  }

  private resetForm(): void {
    this.cargoForm = {
      nombre: '',
      descripcion: '',
      esPersonalMedico: false,
    };
  }

  onSubmit(): void {
    if (!this.cargoForm.nombre.trim() || !this.cargoForm.descripcion.trim()) {
      this.toastService.warning('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.cargoService.crear(this.cargoForm).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.onCargoCreado.emit();
        this.handleClose();
      },
      error: (err) => {
        console.error('Error al guardar el cargo:', err);
        const mensajeError = err.error?.mensaje || 'No se pudo registrar el cargo.';
        this.toastService.error(mensajeError);
      },
    });
  }
}
