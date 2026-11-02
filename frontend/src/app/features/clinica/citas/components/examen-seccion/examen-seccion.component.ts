import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  ExamenSolicitado,
  ExamenSolicitadoCrearDTO,
} from '../../interface/examen-solicitado.interface';
import { ExamenSolicitadoService } from '../../services/examen-solicitado.service';
import {
  PRIORIDADES_EXAMEN,
  TIPOS_EXAMEN,
  clasePrioridadExamen,
  etiquetaPrioridadExamen,
} from '../../utils/atencion-clinica.util';
import { ExamenEditarComponent } from './examen-editar.component';

@Component({
  selector: 'app-examen-seccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ExamenEditarComponent],
  templateUrl: './examen-seccion.component.html',
})
export class ExamenSeccionComponent {
  @Input({ required: true }) idDiagnostico!: number;
  @Input() examenes: ExamenSolicitado[] = [];
  @Input() soloLectura = false;
  @Output() creado = new EventEmitter<void>();
  @Output() editado = new EventEmitter<void>();
  @Output() eliminado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly examenService = inject(ExamenSolicitadoService);
  private readonly toastService = inject(ToastService);

  readonly tipos = TIPOS_EXAMEN;
  readonly prioridades = PRIORIDADES_EXAMEN;
  readonly etiquetaPrioridad = etiquetaPrioridadExamen;
  readonly clasePrioridad = clasePrioridadExamen;

  mostrarFormulario = signal(false);
  guardando = signal(false);
  editandoId = signal<number | null>(null);
  confirmandoId = signal<number | null>(null);
  eliminandoId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombreExamen: ['', [Validators.required, Validators.maxLength(150)]],
    tipoExamen: ['', [Validators.required, Validators.maxLength(50)]],
    prioridad: ['NORMAL', [Validators.required]],
    requiereAyuno: [false],
    motivo: ['', [Validators.required, Validators.maxLength(200)]],
    indicaciones: ['', [Validators.maxLength(300)]],
    observacion: ['', [Validators.maxLength(300)]],
  });

  alternarFormulario(): void {
    if (this.soloLectura) return;
    this.editandoId.set(null);
    this.mostrarFormulario.set(!this.mostrarFormulario());
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const dto = this.form.getRawValue() as ExamenSolicitadoCrearDTO;

    this.examenService.crear(this.idDiagnostico, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Examen registrado con éxito');
        this.guardando.set(false);
        this.form.reset({ prioridad: 'NORMAL', requiereAyuno: false });
        this.mostrarFormulario.set(false);
        this.creado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo registrar el examen',
        );
        this.guardando.set(false);
      },
    });
  }

  iniciarEdicion(id: number): void {
    if (this.soloLectura) return;
    this.mostrarFormulario.set(false);
    this.confirmandoId.set(null);
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
    if (this.soloLectura) return;
    this.editandoId.set(null);
    this.confirmandoId.set(id);
  }

  cancelarConfirmacion(): void {
    this.confirmandoId.set(null);
  }

  eliminar(examen: ExamenSolicitado): void {
    if (this.soloLectura || this.eliminandoId() !== null) return;

    this.eliminandoId.set(examen.id);

    this.examenService.eliminar(this.idDiagnostico, examen.id).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Examen eliminado con éxito');
        this.eliminandoId.set(null);
        this.confirmandoId.set(null);
        this.eliminado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo eliminar el examen',
        );
        this.eliminandoId.set(null);
      },
    });
  }
}
