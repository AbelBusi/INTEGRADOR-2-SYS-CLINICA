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
import { Medico, MedicoDetalle } from '../../interface/medico.interface';
import { MedicoService } from '../../services/medico.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-ver-detalle-medico-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-detalle-medico-modal.component.html',
})
export class VerDetalleMedicoModalComponent implements OnChanges {
  @Input() medico: Medico | null = null;
  @Output() close = new EventEmitter<void>();

  detalle: MedicoDetalle | null = null;
  cargando = false;

  constructor(
    private readonly medicoService: MedicoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['medico'] && this.medico) {
      this.cargarDetalle(this.medico.id);
    }
  }

  get fotoUrl(): string | null {
    return this.medicoService.obtenerUrlFoto(this.detalle?.foto);
  }

  private cargarDetalle(id: number): void {
    this.cargando = true;
    this.detalle = null;

    this.medicoService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.detalle = response.object;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudo cargar el detalle del médico.');
        this.cargando = false;
        this.onClose();
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
