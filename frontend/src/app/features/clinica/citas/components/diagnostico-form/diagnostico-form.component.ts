import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { DiagnosticoCrearDTO } from '../../interface/atencion-clinica.interface';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { TIPOS_DIAGNOSTICO } from '../../utils/atencion-clinica.util';

@Component({
  selector: 'app-diagnostico-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './diagnostico-form.component.html',
})
export class DiagnosticoFormComponent {
  @Input({ required: true }) idCita!: number;
  @Output() creado = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly diagnosticoService = inject(DiagnosticoService);
  private readonly toastService = inject(ToastService);

  readonly tipos = TIPOS_DIAGNOSTICO;
  guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    tipoDiagnostico: [null as number | null, [Validators.required]],
    observaciones: ['', [Validators.required, Validators.maxLength(300)]],
  });

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    const dto = this.form.getRawValue() as DiagnosticoCrearDTO;

    this.diagnosticoService.crear(this.idCita, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Diagnóstico registrado con éxito');
        this.guardando.set(false);
        this.form.reset();
        this.creado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo registrar el diagnóstico',
        );
        this.guardando.set(false);
      },
    });
  }
}
