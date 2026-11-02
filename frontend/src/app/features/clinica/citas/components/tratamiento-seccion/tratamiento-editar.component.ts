import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { Tratamiento, TratamientoActualizarDTO } from '../../interface/tratamiento.interface';
import { TratamientoService } from '../../services/tratamiento.service';
import { VIAS_ADMINISTRACION } from '../../utils/atencion-clinica.util';

@Component({
  selector: 'app-tratamiento-editar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tratamiento-editar.component.html',
})
export class TratamientoEditarComponent implements OnInit {
  @Input({ required: true }) idDiagnostico!: number;
  @Input({ required: true }) tratamiento!: Tratamiento;
  @Output() editado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly tratamientoService = inject(TratamientoService);
  private readonly toastService = inject(ToastService);

  guardando = signal(false);
  readonly viasAdministracion = VIAS_ADMINISTRACION;

  readonly form = this.fb.nonNullable.group({
    nombreMedicamento: ['', [Validators.required, Validators.maxLength(100)]],
    dosis: ['', [Validators.required, Validators.maxLength(40)]],
    viaAdministracion: ['', [Validators.required, Validators.maxLength(30)]],
    frecuencia: ['', [Validators.required, Validators.maxLength(40)]],
    duracionDias: [null as number | null, [Validators.required, Validators.min(1)]],
    totCantidad: [null as number | null, [Validators.required, Validators.min(1)]],
    descIndicacion: ['', [Validators.required, Validators.maxLength(300)]],
  });

  ngOnInit(): void {
    this.form.patchValue({
      nombreMedicamento: this.tratamiento.nombreMedicamento,
      dosis: this.tratamiento.dosis,
      viaAdministracion: this.tratamiento.viaAdministracion,
      frecuencia: this.tratamiento.frecuencia,
      duracionDias: this.tratamiento.duracionDias,
      totCantidad: this.tratamiento.totCantidad,
      descIndicacion: this.tratamiento.descIndicacion,
    });
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const dto = this.form.getRawValue() as TratamientoActualizarDTO;

    this.tratamientoService.actualizar(this.idDiagnostico, this.tratamiento.id, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Tratamiento actualizado con éxito');
        this.guardando.set(false);
        this.editado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo actualizar el tratamiento',
        );
        this.guardando.set(false);
      },
    });
  }
}
