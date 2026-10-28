import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { Indicacion, IndicacionCrearDTO } from '../../interface/atencion-clinica.interface';
import { AtencionClinicaService } from '../../services/atencion-clinica.service';

@Component({
  selector: 'app-indicacion-seccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './indicacion-seccion.component.html',
})
export class IndicacionSeccionComponent {
  @Input({ required: true }) idDiagnostico!: number;
  @Input() indicaciones: Indicacion[] = [];
  @Output() creado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly atencionService = inject(AtencionClinicaService);
  private readonly toastService = inject(ToastService);

  mostrarFormulario = signal(false);
  guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    tipoIndicacion: ['', [Validators.required, Validators.maxLength(30)]],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    diasReposo: [0 as number | null, [Validators.required, Validators.min(0)]],
    frecuencia: ['', [Validators.required, Validators.maxLength(40)]],
  });

  alternarFormulario(): void {
    this.mostrarFormulario.set(!this.mostrarFormulario());
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    const dto = this.form.getRawValue() as IndicacionCrearDTO;

    this.atencionService.crearIndicacion(this.idDiagnostico, dto).subscribe({
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
