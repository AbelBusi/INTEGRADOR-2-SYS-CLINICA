import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { TratamientoEditarComponent } from './tratamiento-editar.component';
import { TratamientoService } from '../../services/tratamiento.service';
import { VIAS_ADMINISTRACION } from '../../utils/atencion-clinica.util';
import { AtencionClinicaService } from '../../services/atencion-clinica.service';
import { Tratamiento, TratamientoCrearDTO } from '../../interface/tratamiento.interface';

@Component({
  selector: 'app-tratamiento-seccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TratamientoEditarComponent],
  templateUrl: './tratamiento-seccion.component.html',
})
export class TratamientoSeccionComponent {
  @Input({ required: true }) idDiagnostico!: number;
  @Input() tratamientos: Tratamiento[] = [];
  @Output() creado = new EventEmitter<void>();
  @Input() soloLectura = false;
  private readonly fb = inject(FormBuilder);
  private readonly atencionService = inject(AtencionClinicaService);
  private readonly toastService = inject(ToastService);
  @Output() editado = new EventEmitter<void>();
  @Output() eliminado = new EventEmitter<void>();

  private readonly tratamientoService = inject(TratamientoService); // reemplaza a atencionService

  readonly viasAdministracion = VIAS_ADMINISTRACION; // reemplaza el array local

  editandoId = signal<number | null>(null);
  confirmandoId = signal<number | null>(null);
  eliminandoId = signal<number | null>(null);

  mostrarFormulario = signal(false);
  guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    nombreMedicamento: ['', [Validators.required, Validators.maxLength(100)]],
    dosis: ['', [Validators.required, Validators.maxLength(40)]],
    viaAdministracion: ['', [Validators.required, Validators.maxLength(30)]],
    frecuencia: ['', [Validators.required, Validators.maxLength(40)]],
    duracionDias: [null as number | null, [Validators.required, Validators.min(1)]],
    totCantidad: [null as number | null, [Validators.required, Validators.min(1)]],
    descIndicacion: ['', [Validators.required, Validators.maxLength(300)]],
  });

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

  eliminar(tratamiento: Tratamiento): void {
    if (this.soloLectura || this.eliminandoId() !== null) return;

    this.eliminandoId.set(tratamiento.id);

    this.tratamientoService.eliminar(this.idDiagnostico, tratamiento.id).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Tratamiento eliminado con éxito');
        this.eliminandoId.set(null);
        this.confirmandoId.set(null);
        this.eliminado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo eliminar el tratamiento',
        );
        this.eliminandoId.set(null);
      },
    });
  }

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

    const dto = this.form.getRawValue() as TratamientoCrearDTO;

    this.tratamientoService.crear(this.idDiagnostico, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Tratamiento registrado con éxito');
        this.guardando.set(false);
        this.form.reset();
        this.mostrarFormulario.set(false);
        this.creado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo registrar el tratamiento',
        );
        this.guardando.set(false);
      },
    });
  }
}
