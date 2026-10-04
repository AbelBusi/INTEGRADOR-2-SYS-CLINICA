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
import { Especialidad, EspecialidadActualizar } from '../../interface/especialidad.interface';
import { EspecialidadService } from '../../services/especialidad.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-especialidad-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-especialidad-modal.component.html',
})
export class EditarEspecialidadModalComponent implements OnChanges {
  @Input() especialidad: Especialidad | null = null;
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEspecialidadEditada = new EventEmitter<Especialidad>();

  especialidadForm: EspecialidadActualizar = {
    nombre: '',
    descripcion: '',
    estado: 1,
  };
  cargando = false;

  constructor(
    private readonly especialidadService: EspecialidadService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['especialidad'] && this.especialidad) {
      this.especialidadForm = {
        nombre: this.especialidad.nombre || '',
        descripcion: this.especialidad.descripcion || '',
        estado: this.especialidad.estado !== undefined ? this.especialidad.estado : 1,
      };
    }
  }

  handleClose() {
    this.onClose.emit();
  }

  onSubmit() {
    if (!this.especialidad?.id || this.cargando) return;

    this.cargando = true;
    this.especialidadService.actualizar(this.especialidad.id, this.especialidadForm).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje || 'Especialidad actualizada con éxito');
        this.onEspecialidadEditada.emit(response.object);
        this.handleClose();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('Hubo un error al actualizar la especialidad');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
