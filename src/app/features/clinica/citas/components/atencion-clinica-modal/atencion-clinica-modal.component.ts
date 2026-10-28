import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { formatearFechaCorta } from '../../../horarios/utils/calendario.util';
import { ToastService } from '../../../../../core/services/toast.service';
import { CitaFila } from '../../interface/cita.interface';
import { DiagnosticoDetalle } from '../../interface/atencion-clinica.interface';
import { AtencionClinicaService } from '../../services/atencion-clinica.service';
import { CitaService } from '../../services/cita.service';
import { DiagnosticoFormComponent } from '../diagnostico-form/diagnostico-form.component';
import { DiagnosticoPanelComponent } from '../diagnostico-panel/diagnostico-panel.component';

@Component({
  selector: 'app-atencion-clinica-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DiagnosticoFormComponent, DiagnosticoPanelComponent],
  templateUrl: './atencion-clinica-modal.component.html',
})
export class AtencionClinicaModalComponent implements OnInit {
  @Input({ required: true }) cita!: CitaFila;
  @Input() permiteFinalizar = true;
  @Output() close = new EventEmitter<void>();
  @Output() finalizada = new EventEmitter<void>();

  private readonly atencionService = inject(AtencionClinicaService);
  private readonly citaService = inject(CitaService);
  private readonly toastService = inject(ToastService);

  readonly limiteObservacion = 300;

  diagnosticos = signal<DiagnosticoDetalle[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);
  mostrarFormulario = signal(false);
  expandidoId = signal<number | null>(null);
  observacion = signal('');
  confirmando = signal(false);
  finalizando = signal(false);

  get soloLectura(): boolean {
    return this.cita.estado === 3;
  }

  get puedeFinalizar(): boolean {
    return !this.soloLectura && this.permiteFinalizar;
  }

  ngOnInit(): void {
    this.cargar(false, false);
  }

  cargar(silencioso: boolean, expandirUltimo: boolean): void {
    if (!silencioso) {
      this.cargando.set(true);
    }
    this.error.set(null);

    this.atencionService.obtenerAtencion(this.cita.id).subscribe({
      next: (response) => {
        const lista = response.object?.diagnosticos || [];
        this.diagnosticos.set(lista);

        if (expandirUltimo && lista.length > 0) {
          this.expandidoId.set(lista[lista.length - 1].diagnostico.id);
        }

        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar la atención clínica:', error);
        this.error.set(
          error.error?.mensaje || 'No se pudo cargar la información clínica. Inténtalo de nuevo.',
        );
        this.cargando.set(false);
      },
    });
  }

  fechaCorta(iso: string): string {
    return formatearFechaCorta(iso);
  }

  cerrar(): void {
    if (!this.finalizando()) {
      this.close.emit();
    }
  }

  alternarFormulario(): void {
    this.mostrarFormulario.set(!this.mostrarFormulario());
  }

  alternarPanel(idDiagnostico: number): void {
    this.expandidoId.set(this.expandidoId() === idDiagnostico ? null : idDiagnostico);
  }

  alCrearDiagnostico(): void {
    this.mostrarFormulario.set(false);
    this.cargar(true, true);
  }

  alCambiarRegistros(): void {
    this.cargar(true, false);
  }

  solicitarFinalizacion(): void {
    if (this.puedeFinalizar) {
      this.confirmando.set(true);
    }
  }

  cancelarFinalizacion(): void {
    if (!this.finalizando()) {
      this.confirmando.set(false);
    }
  }

  finalizar(): void {
    if (!this.puedeFinalizar || this.finalizando()) {
      return;
    }

    this.finalizando.set(true);

    this.citaService.atender(this.cita.id, this.observacion()).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Atención finalizada con éxito');
        this.finalizando.set(false);
        this.finalizada.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo finalizar la atención');
        this.finalizando.set(false);
        this.confirmando.set(false);
      },
    });
  }
}
