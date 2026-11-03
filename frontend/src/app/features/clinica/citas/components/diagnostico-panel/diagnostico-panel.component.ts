import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastService } from '../../../../../core/services/toast.service';
import { DiagnosticoDetalle } from '../../interface/atencion-clinica.interface';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { etiquetaTipoDiagnostico } from '../../utils/atencion-clinica.util';
import { DiagnosticoEditarComponent } from '../diagnostico-form/diagnostico-editar.component';
import { RegistroClinicoModalComponent } from '../registro-clinico-modal/registro-clinico-modal.component';
import { TratamientoSeccionComponent } from '../tratamiento-seccion/tratamiento-seccion.component';
import { IndicacionSeccionComponent } from '../indicacion-seccion/indicacion-seccion.component';
import { ExamenSeccionComponent } from '../examen-seccion/examen-seccion.component';
import { DerivacionSeccionComponent } from '../derivacion-seccion/derivacion-seccion.component';

type SeccionClinica = 'tratamientos' | 'indicaciones' | 'examenes' | 'derivaciones';

interface ResumenSeccion {
  clave: SeccionClinica;
  titulo: string;
  icono: string;
  total: number;
}

@Component({
  selector: 'app-diagnostico-panel',
  standalone: true,
  imports: [
    CommonModule,
    DiagnosticoEditarComponent,
    RegistroClinicoModalComponent,
    TratamientoSeccionComponent,
    IndicacionSeccionComponent,
    ExamenSeccionComponent,
    DerivacionSeccionComponent,
  ],
  templateUrl: './diagnostico-panel.component.html',
})
export class DiagnosticoPanelComponent {
  @Input({ required: true }) detalle!: DiagnosticoDetalle;
  @Input() expandido = false;
  @Input() soloLectura = false;
  @Output() alternar = new EventEmitter<void>();
  @Output() cambio = new EventEmitter<void>();

  private readonly diagnosticoService = inject(DiagnosticoService);
  private readonly toastService = inject(ToastService);

  readonly etiquetaTipo = etiquetaTipoDiagnostico;

  seccionAbierta = signal<SeccionClinica | null>(null);
  editando = signal(false);
  confirmandoEliminar = signal(false);
  eliminando = signal(false);

  get secciones(): ResumenSeccion[] {
    return [
      {
        clave: 'tratamientos',
        titulo: 'Tratamientos',
        icono: 'medication',
        total: this.detalle.tratamientos.length,
      },
      {
        clave: 'indicaciones',
        titulo: 'Indicaciones',
        icono: 'fact_check',
        total: this.detalle.indicaciones.length,
      },
      {
        clave: 'examenes',
        titulo: 'Exámenes solicitados',
        icono: 'science',
        total: this.detalle.examenesSolicitados.length,
      },
      {
        clave: 'derivaciones',
        titulo: 'Derivaciones',
        icono: 'call_split',
        total: this.detalle.derivaciones.length,
      },
    ];
  }

  get subtituloModal(): string {
    return `${this.detalle.diagnostico.codigo} · ${this.detalle.diagnostico.descripcion}`;
  }

  abrirSeccion(clave: SeccionClinica): void {
    this.seccionAbierta.set(clave);
  }

  cerrarSeccion(): void {
    this.seccionAbierta.set(null);
  }

  iniciarEdicion(): void {
    if (this.soloLectura) {
      return;
    }

    this.confirmandoEliminar.set(false);
    this.editando.set(true);
  }

  cancelarEdicion(): void {
    this.editando.set(false);
  }

  alEditado(): void {
    this.editando.set(false);
    this.cambio.emit();
  }

  pedirConfirmacion(): void {
    if (this.soloLectura) {
      return;
    }

    this.editando.set(false);
    this.confirmandoEliminar.set(true);
  }

  cancelarConfirmacion(): void {
    this.confirmandoEliminar.set(false);
  }

  eliminar(): void {
    if (this.soloLectura || this.eliminando()) {
      return;
    }

    this.eliminando.set(true);

    this.diagnosticoService.eliminar(this.detalle.diagnostico.id).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Diagnóstico eliminado con éxito');
        this.eliminando.set(false);
        this.confirmandoEliminar.set(false);
        this.cambio.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo eliminar el diagnóstico',
        );
        this.eliminando.set(false);
      },
    });
  }
}
