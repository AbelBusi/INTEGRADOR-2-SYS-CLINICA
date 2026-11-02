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
import { Empleado, EmpleadoDetalle } from '../../interface/empleado.interface';
import { EmpleadoService } from '../../services/empleado.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-ver-detalle-empleado-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-detalle-empleado-modal.component.html',
})
export class VerDetalleEmpleadoModalComponent implements OnChanges {
  @Input() empleado: Empleado | null = null;
  @Output() close = new EventEmitter<void>();

  detalle: EmpleadoDetalle | null = null;
  cargando = false;

  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleado'] && this.empleado) {
      this.cargarDetalle(this.empleado.id);
    }
  }

  get fotoUrl(): string | null {
    return this.empleadoService.obtenerUrlFoto(this.detalle?.foto);
  }

  private cargarDetalle(id: number): void {
    this.cargando = true;
    this.detalle = null;

    this.empleadoService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.detalle = response.object;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudo cargar el detalle del empleado.');
        this.cargando = false;
        this.onClose();
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
