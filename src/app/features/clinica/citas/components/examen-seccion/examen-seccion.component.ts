import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  ExamenSolicitado,
  ExamenSolicitadoCrearDTO,
} from '../../interface/atencion-clinica.interface';
import { AtencionClinicaService } from '../../services/atencion-clinica.service';

@Component({
  selector: 'app-examen-seccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './examen-seccion.component.html',
})
export class ExamenSeccionComponent {
  @Input({ required: true }) idDiagnostico!: number;
  @Input() examenes: ExamenSolicitado[] = [];
  @Output() creado = new EventEmitter<void>();
  @Input() soloLectura = false;
  private readonly fb = inject(FormBuilder);
  private readonly atencionService = inject(AtencionClinicaService);
  private readonly toastService = inject(ToastService);

  mostrarFormulario = signal(false);
  guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    motivo: ['', [Validators.required, Validators.maxLength(200)]],
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

    const dto = this.form.getRawValue() as ExamenSolicitadoCrearDTO;

    this.atencionService.crearExamenSolicitado(this.idDiagnostico, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Examen registrado con éxito');
        this.guardando.set(false);
        this.form.reset();
        this.mostrarFormulario.set(false);
        this.creado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo registrar el examen');
        this.guardando.set(false);
      },
    });
  }
}
