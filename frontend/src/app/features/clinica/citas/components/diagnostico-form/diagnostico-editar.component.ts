import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { Diagnostico, DiagnosticoActualizarDTO } from '../../interface/atencion-clinica.interface';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { TIPOS_DIAGNOSTICO } from '../../utils/atencion-clinica.util';

@Component({
  selector: 'app-diagnostico-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './diagnostico-editar.component.html',
})
export class DiagnosticoEditarComponent implements OnInit {
  @Input({ required: true }) diagnostico!: Diagnostico;
  @Output() editado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

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

  ngOnInit(): void {
    this.form.patchValue({
      descripcion: this.diagnostico.descripcion,
      tipoDiagnostico: this.diagnostico.tipoDiagnostico,
      observaciones: this.diagnostico.observaciones,
    });
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const dto = this.form.getRawValue() as DiagnosticoActualizarDTO;

    this.diagnosticoService.actualizar(this.diagnostico.id, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Diagnóstico actualizado con éxito');
        this.guardando.set(false);
        this.editado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo actualizar el diagnóstico',
        );
        this.guardando.set(false);
      },
    });
  }
}
