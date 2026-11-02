import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { Indicacion, IndicacionActualizarDTO } from '../../interface/indicacion.interface';
import { IndicacionService } from '../../services/indicacion.service';

@Component({
  selector: 'app-indicacion-editar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './indicacion-editar.component.html',
})
export class IndicacionEditarComponent implements OnInit {
  @Input({ required: true }) idDiagnostico!: number;
  @Input({ required: true }) indicacion!: Indicacion;
  @Output() editado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly indicacionService = inject(IndicacionService);
  private readonly toastService = inject(ToastService);

  guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    tipoIndicacion: ['', [Validators.required, Validators.maxLength(30)]],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    diasReposo: [0 as number | null, [Validators.required, Validators.min(0)]],
    frecuencia: ['', [Validators.required, Validators.maxLength(40)]],
  });

  ngOnInit(): void {
    this.form.patchValue({
      tipoIndicacion: this.indicacion.tipoIndicacion,
      descripcion: this.indicacion.descripcion,
      diasReposo: this.indicacion.diasReposo,
      frecuencia: this.indicacion.frecuencia,
    });
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const dto = this.form.getRawValue() as IndicacionActualizarDTO;

    this.indicacionService.actualizar(this.idDiagnostico, this.indicacion.id, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Indicación actualizada con éxito');
        this.guardando.set(false);
        this.editado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo actualizar la indicación');
        this.guardando.set(false);
      },
    });
  }
}
