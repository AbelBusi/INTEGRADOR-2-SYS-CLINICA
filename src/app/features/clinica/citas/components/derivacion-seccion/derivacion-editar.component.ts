import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { Derivacion, DerivacionActualizarDTO } from '../../interface/atencion-clinica.interface';
import { EspecialidadResumen } from '../../interface/cita.interface';
import { DerivacionService } from '../../services/derivacion.service';
import { NIVELES_URGENCIA } from '../../utils/atencion-clinica.util';

@Component({
  selector: 'app-derivacion-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './derivacion-editar.component.html',
})
export class DerivacionEditarComponent implements OnInit {
  @Input({ required: true }) idDiagnostico!: number;
  @Input({ required: true }) derivacion!: Derivacion;
  @Input() especialidades: EspecialidadResumen[] = [];
  @Output() editado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly derivacionService = inject(DerivacionService);
  private readonly toastService = inject(ToastService);

  readonly niveles = NIVELES_URGENCIA;

  guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    idEspecialidad: [null as number | null, [Validators.required]],
    urgencia: [1, [Validators.required]],
    motivo: ['', [Validators.required, Validators.maxLength(200)]],
  });

  ngOnInit(): void {
    this.form.patchValue({
      idEspecialidad: this.derivacion.idEspecialidad,
      urgencia: this.derivacion.urgencia,
      motivo: this.derivacion.motivo,
    });
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const dto = this.form.getRawValue() as DerivacionActualizarDTO;

    this.derivacionService.actualizar(this.idDiagnostico, this.derivacion.id, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Derivación actualizada con éxito');
        this.guardando.set(false);
        this.editado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo actualizar la derivación',
        );
        this.guardando.set(false);
      },
    });
  }
}
