import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  ExamenSolicitado,
  ExamenSolicitadoActualizarDTO,
} from '../../interface/examen-solicitado.interface';
import { ExamenSolicitadoService } from '../../services/examen-solicitado.service';
import { PRIORIDADES_EXAMEN, TIPOS_EXAMEN } from '../../utils/atencion-clinica.util';

@Component({
  selector: 'app-examen-editar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './examen-editar.component.html',
})
export class ExamenEditarComponent implements OnInit {
  @Input({ required: true }) idDiagnostico!: number;
  @Input({ required: true }) examen!: ExamenSolicitado;
  @Output() editado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly examenService = inject(ExamenSolicitadoService);
  private readonly toastService = inject(ToastService);

  guardando = signal(false);
  readonly tipos = TIPOS_EXAMEN;
  readonly prioridades = PRIORIDADES_EXAMEN;

  readonly form = this.fb.nonNullable.group({
    nombreExamen: ['', [Validators.required, Validators.maxLength(150)]],
    tipoExamen: ['', [Validators.required, Validators.maxLength(50)]],
    prioridad: ['NORMAL', [Validators.required]],
    requiereAyuno: [false],
    motivo: ['', [Validators.required, Validators.maxLength(200)]],
    indicaciones: ['', [Validators.maxLength(300)]],
    observacion: ['', [Validators.maxLength(300)]],
  });

  ngOnInit(): void {
    this.form.patchValue({
      nombreExamen: this.examen.nombreExamen,
      tipoExamen: this.examen.tipoExamen,
      prioridad: this.examen.prioridad,
      requiereAyuno: this.examen.requiereAyuno,
      motivo: this.examen.motivo,
      indicaciones: this.examen.indicaciones ?? '',
      observacion: this.examen.observacion ?? '',
    });
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const dto = this.form.getRawValue() as ExamenSolicitadoActualizarDTO;

    this.examenService.actualizar(this.idDiagnostico, this.examen.id, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Examen actualizado con éxito');
        this.guardando.set(false);
        this.editado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje || error.error?.message || 'No se pudo actualizar el examen',
        );
        this.guardando.set(false);
      },
    });
  }
}
