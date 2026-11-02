import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { IndicacionEditarComponent } from './indicacion-editar.component';
import { IndicacionService } from '../../services/indicacion.service';
import { AtencionClinicaService } from '../../services/atencion-clinica.service';
import { Indicacion, IndicacionCrearDTO } from '../../interface/indicacion.interface';

@Component({
  selector: 'app-indicacion-seccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IndicacionEditarComponent],
  templateUrl: './indicacion-seccion.component.html',
})
export class IndicacionSeccionComponent {
  @Input({ required: true }) idDiagnostico!: number;
  @Input() indicaciones: Indicacion[] = [];
  @Output() creado = new EventEmitter<void>();
  @Input() soloLectura = false;
  @Output() editado = new EventEmitter<void>();
  @Output() eliminado = new EventEmitter<void>();
  private readonly indicacionService = inject(IndicacionService); // reemplaza a atencionService
  private readonly fb = inject(FormBuilder);
  private readonly atencionService = inject(AtencionClinicaService);
  private readonly toastService = inject(ToastService);

  mostrarFormulario = signal(false);
  guardando = signal(false);
  editandoId = signal<number | null>(null);
  confirmandoId = signal<number | null>(null);
  eliminandoId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    tipoIndicacion: ['', [Validators.required, Validators.maxLength(30)]],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    diasReposo: [0 as number | null, [Validators.required, Validators.min(0)]],
    frecuencia: ['', [Validators.required, Validators.maxLength(40)]],
  });

  alternarFormulario(): void {
    if (this.soloLectura) return;
    this.editandoId.set(null);
    this.mostrarFormulario.set(!this.mostrarFormulario());
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

  eliminar(indicacion: Indicacion): void {
    if (this.soloLectura || this.eliminandoId() !== null) return;

    this.eliminandoId.set(indicacion.id);

    this.indicacionService.eliminar(this.idDiagnostico, indicacion.id).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Indicación eliminada con éxito');
        this.eliminandoId.set(null);
        this.confirmandoId.set(null);
        this.eliminado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo eliminar la indicación');
        this.eliminandoId.set(null);
      },
    });
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    const dto = this.form.getRawValue() as IndicacionCrearDTO;

    this.indicacionService.crear(this.idDiagnostico, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Indicación registrada con éxito');
        this.guardando.set(false);
        this.form.reset();
        this.mostrarFormulario.set(false);
        this.creado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo registrar la indicación');
        this.guardando.set(false);
      },
    });
  }
}
