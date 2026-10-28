import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { Tratamiento, TratamientoCrearDTO } from '../../interface/atencion-clinica.interface';
import { AtencionClinicaService } from '../../services/atencion-clinica.service';

@Component({
  selector: 'app-tratamiento-seccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tratamiento-seccion.component.html',
})
export class TratamientoSeccionComponent {
  @Input({ required: true }) idDiagnostico!: number;
  @Input() tratamientos: Tratamiento[] = [];
  @Output() creado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly atencionService = inject(AtencionClinicaService);
  private readonly toastService = inject(ToastService);

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

  alternarFormulario(): void {
    this.mostrarFormulario.set(!this.mostrarFormulario());
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    const dto = this.form.getRawValue() as TratamientoCrearDTO;

    this.atencionService.crearTratamiento(this.idDiagnostico, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Tratamiento registrado con éxito');
        this.guardando.set(false);
        this.form.reset();
        this.mostrarFormulario.set(false);
        this.creado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo registrar el tratamiento');
        this.guardando.set(false);
      },
    });
  }
}
