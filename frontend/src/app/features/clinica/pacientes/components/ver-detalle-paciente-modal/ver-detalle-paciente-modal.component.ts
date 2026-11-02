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
import { Paciente, PacienteDetalle } from '../../interface/paciente.interface';
import { PacienteService } from '../../services/paciente.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-ver-detalle-paciente-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-detalle-paciente-modal.component.html',
})
export class VerDetallePacienteModalComponent implements OnChanges {
  @Input() paciente: Paciente | null = null;
  @Output() close = new EventEmitter<void>();

  detalle: PacienteDetalle | null = null;
  cargando = false;

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paciente'] && this.paciente) {
      this.cargarDetalle(this.paciente.id);
    }
  }

  private cargarDetalle(id: number): void {
    this.cargando = true;
    this.detalle = null;

    this.pacienteService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.detalle = response.object;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudo cargar el detalle del paciente.');
        this.cargando = false;
        this.onClose();
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
