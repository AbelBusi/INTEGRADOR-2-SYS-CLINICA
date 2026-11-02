import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolAdminService } from '../../services/rol-admin.service';
import { Rol, RolActualizarDTO } from '../../models/rol.model';

@Component({
  selector: 'app-editar-rol-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-rol-modal.component.html',
})
export class EditarRolModalComponent implements OnChanges {
  private rolService = inject(RolAdminService);

  @Input({ required: true }) rol!: Rol;
  @Output() onClose = new EventEmitter<void>();
  @Output() onRolActualizado = new EventEmitter<void>();

  guardando = false;
  error = '';
  form: RolActualizarDTO = { nombre: '', descripcion: '', estado: 1 };

  ngOnChanges(): void {
    if (this.rol) {
      this.form = {
        nombre: this.rol.nombre,
        descripcion: this.rol.descripcion,
        estado: this.rol.estado,
      };
    }
  }

  handleClose(): void {
    this.onClose.emit();
  }

  onSubmit(): void {
    this.guardando = true;
    this.error = '';
    this.rolService.actualizar(this.rol.id, this.form).subscribe({
      next: () => {
        this.guardando = false;
        this.onRolActualizado.emit();
      },
      error: () => {
        this.guardando = false;
        this.error = 'No se pudo actualizar el rol.';
      },
    });
  }
}
