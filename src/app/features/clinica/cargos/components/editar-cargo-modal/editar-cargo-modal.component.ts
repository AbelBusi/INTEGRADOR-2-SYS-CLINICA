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
import { cargo, CargoActualizarDTO } from '../../interface/cargo.interface';
import { CargoService } from '../../services/cargo.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-cargo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-cargo-modal.component.html',
})
export class EditarCargoModalComponent implements OnChanges {
  @Input() cargo: cargo | null = null;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onCargoEditado = new EventEmitter<cargo>();

  cargoForm: CargoActualizarDTO = {
    nombre: '',
    descripcion: '',
  };
  cargando = false;

  constructor(
    private readonly cargoService: CargoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cargo'] && this.cargo) {
      this.cargoForm = {
        nombre: this.cargo.nombre || '',
        descripcion: this.cargo.descripcion || '',
      };
    }
  }

  handleClose(): void {
    this.onClose.emit();
  }

  onSubmit(): void {
    if (!this.cargo?.id || this.cargando) return;

    this.cargando = true;
    this.cargoService.actualizar(this.cargo.id, this.cargoForm).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje || 'Cargo actualizado con éxito');
        this.onCargoEditado.emit(response.object);
        this.handleClose();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('Hubo un error al actualizar el cargo');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
