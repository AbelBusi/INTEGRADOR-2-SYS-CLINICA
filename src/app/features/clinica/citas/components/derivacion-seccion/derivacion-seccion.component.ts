import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { Derivacion, DerivacionCrearDTO } from '../../interface/atencion-clinica.interface';
import { EspecialidadResumen } from '../../interface/cita.interface';
import { CitaService } from '../../services/cita.service';
import { DerivacionService } from '../../services/derivacion.service';
import {
  NIVELES_URGENCIA,
  clasesUrgencia,
  etiquetaUrgencia,
} from '../../utils/atencion-clinica.util';
import {
  ESTADO_DERIVACION,
  clasesEstadoDerivacion,
  etiquetaEstadoDerivacion,
} from '../../utils/derivacion.util';
import { DerivacionEditarComponent } from './derivacion-editar.component';

@Component({
  selector: 'app-derivacion-seccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DerivacionEditarComponent],
  templateUrl: './derivacion-seccion.component.html',
})
export class DerivacionSeccionComponent {
  @Input({ required: true }) idDiagnostico!: number;
  @Input() derivaciones: Derivacion[] = [];
  @Input() soloLectura = false;
  @Output() creado = new EventEmitter<void>();
  @Output() editado = new EventEmitter<void>();
  @Output() eliminado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly derivacionService = inject(DerivacionService);
  private readonly citaService = inject(CitaService);
  private readonly toastService = inject(ToastService);

  readonly ESTADO = ESTADO_DERIVACION;
  readonly niveles = NIVELES_URGENCIA;
  readonly etiquetaUrgencia = etiquetaUrgencia;
  readonly clasesUrgencia = clasesUrgencia;
  readonly etiquetaEstado = etiquetaEstadoDerivacion;
  readonly clasesEstado = clasesEstadoDerivacion;

  especialidades = signal<EspecialidadResumen[]>([]);
  mostrarFormulario = signal(false);
  guardando = signal(false);
  editandoId = signal<number | null>(null);
  confirmandoId = signal<number | null>(null);
  eliminandoId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    idEspecialidad: [null as number | null, [Validators.required]],
    urgencia: [1, [Validators.required]],
    motivo: ['', [Validators.required, Validators.maxLength(200)]],
  });

  especialidadesDisponibles(): EspecialidadResumen[] {
    const derivadas = new Set(this.derivaciones.map((d) => d.idEspecialidad));
    return this.especialidades().filter((e) => !derivadas.has(e.idEspecialidad));
  }

  especialidadesParaEdicion(derivacion: Derivacion): EspecialidadResumen[] {
    const otras = new Set(
      this.derivaciones.filter((d) => d.id !== derivacion.id).map((d) => d.idEspecialidad),
    );
    return this.especialidades().filter((e) => !otras.has(e.idEspecialidad));
  }

  alternarFormulario(): void {
    if (this.soloLectura) {
      return;
    }

    const abrir = !this.mostrarFormulario();
    this.editandoId.set(null);
    this.mostrarFormulario.set(abrir);

    if (abrir) {
      this.cargarEspecialidades();
    }
  }

  private cargarEspecialidades(): void {
    if (this.especialidades().length > 0) {
      return;
    }

    this.citaService.listarEspecialidadesResumen().subscribe({
      next: (response) => this.especialidades.set(response.object || []),
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar las especialidades');
      },
    });
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    const dto = this.form.getRawValue() as DerivacionCrearDTO;

    this.derivacionService.crear(this.idDiagnostico, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Derivación registrada con éxito');
        this.guardando.set(false);
        this.form.reset({ idEspecialidad: null, urgencia: 1, motivo: '' });
        this.mostrarFormulario.set(false);
        this.creado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo registrar la derivación',
        );
        this.guardando.set(false);
      },
    });
  }

  iniciarEdicion(id: number): void {
    if (this.soloLectura) {
      return;
    }

    this.mostrarFormulario.set(false);
    this.confirmandoId.set(null);
    this.cargarEspecialidades();
    this.editandoId.set(id);
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
  }

  alEditado(): void {
    this.editandoId.set(null);
    this.editado.emit();
  }

  pedirConfirmacion(id: number): void {
    if (this.soloLectura) {
      return;
    }

    this.editandoId.set(null);
    this.confirmandoId.set(id);
  }

  cancelarConfirmacion(): void {
    this.confirmandoId.set(null);
  }

  eliminar(derivacion: Derivacion): void {
    if (this.soloLectura || this.eliminandoId() !== null) {
      return;
    }

    this.eliminandoId.set(derivacion.id);

    this.derivacionService.eliminar(this.idDiagnostico, derivacion.id).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Derivación eliminada con éxito');
        this.eliminandoId.set(null);
        this.confirmandoId.set(null);
        this.eliminado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo eliminar la derivación',
        );
        this.eliminandoId.set(null);
      },
    });
  }
}
