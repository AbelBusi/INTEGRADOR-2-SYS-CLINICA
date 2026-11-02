import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rol, RolActualizar } from '../../interface/rol.interface';
import { RolService } from '../../services/rol.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-rol-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-rol-modal.component.html',
})
export class EditarRolModalComponent implements OnChanges {
  @Input() rol: Rol | null = null;
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onRolEditado = new EventEmitter<Rol>();

  rolForm: RolActualizar = {
    nombre: '',
    descripcion: '',
  };
  cargando = false;

  constructor(
    private readonly rolService: RolService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rol'] && this.rol) {
      this.rolForm = {
        nombre: this.rol.nombre || '',
        descripcion: this.rol.descripcion || '',
      };
    }
  }

  handleClose() {
    this.onClose.emit();
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
    this.rolForm.nombre = this.rolForm.nombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
  }

  onSubmit() {
    if (!this.rol?.id || this.cargando) return;

    this.cargando = true;
    this.rolService.actualizar(this.rol.id, this.rolForm).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje || 'Rol actualizado con éxito');
        this.onRolEditado.emit(response.object);
        this.handleClose();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('Hubo un error al actualizar el rol');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
