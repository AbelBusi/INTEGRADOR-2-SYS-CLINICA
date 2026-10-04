import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolAdminService } from '../../services/rol-admin.service';
import { RolCrearDTO } from '../../models/rol.model';

@Component({
  selector: 'app-crear-rol-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-rol-modal.component.html',
})
export class CrearRolModalComponent {
  private rolService = inject(RolAdminService);

  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onRolCreado = new EventEmitter<void>();

  guardando = false;
  error = '';

  form: RolCrearDTO = { nombre: '', descripcion: '', estado: 1 };

  handleClose(): void {
    this.form = { nombre: '', descripcion: '', estado: 1 };
    this.error = '';
    this.onClose.emit();
  }

  onSubmit(): void {
    if (!this.form.nombre.trim() || !this.form.descripcion.trim()) {
      this.error = 'Complete nombre y descripción.';
      return;
    }
    this.guardando = true;
    this.error = '';
    this.rolService.crear(this.form).subscribe({
      next: () => {
        this.guardando = false;
        this.onRolCreado.emit();
        this.handleClose();
      },
      error: () => {
        this.guardando = false;
        this.error = 'No se pudo guardar el rol. Verifique que el nombre sea único.';
      },
    });
  }
}
