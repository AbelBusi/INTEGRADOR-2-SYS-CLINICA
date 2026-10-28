import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { formatearFechaCorta } from '../../../horarios/utils/calendario.util';
import { CitaFila } from '../../interface/cita.interface';
import { DiagnosticoDetalle } from '../../interface/atencion-clinica.interface';
import { AtencionClinicaService } from '../../services/atencion-clinica.service';
import { DiagnosticoFormComponent } from '../diagnostico-form/diagnostico-form.component';
import { DiagnosticoPanelComponent } from '../diagnostico-panel/diagnostico-panel.component';

@Component({
  selector: 'app-atencion-clinica-modal',
  standalone: true,
  imports: [CommonModule, DiagnosticoFormComponent, DiagnosticoPanelComponent],
  templateUrl: './atencion-clinica-modal.component.html',
})
export class AtencionClinicaModalComponent implements OnInit {
  @Input({ required: true }) cita!: CitaFila;
  @Output() close = new EventEmitter<void>();

  private readonly atencionService = inject(AtencionClinicaService);

  diagnosticos = signal<DiagnosticoDetalle[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);
  mostrarFormulario = signal(false);
  expandidoId = signal<number | null>(null);

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
}
