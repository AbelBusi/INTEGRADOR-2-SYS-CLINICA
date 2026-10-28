import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { Derivacion, DerivacionCrearDTO } from '../../interface/atencion-clinica.interface';
import { EspecialidadResumen } from '../../interface/cita.interface';
import { AtencionClinicaService } from '../../services/atencion-clinica.service';
import { CitaService } from '../../services/cita.service';
import {
  NIVELES_URGENCIA,
  clasesUrgencia,
  etiquetaUrgencia,
} from '../../utils/atencion-clinica.util';

@Component({
  selector: 'app-derivacion-seccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './derivacion-seccion.component.html',
})
export class DerivacionSeccionComponent {
  @Input({ required: true }) idDiagnostico!: number;
  @Input() derivaciones: Derivacion[] = [];
  @Output() creado = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly atencionService = inject(AtencionClinicaService);
  private readonly citaService = inject(CitaService);
  private readonly toastService = inject(ToastService);

  readonly niveles = NIVELES_URGENCIA;
  readonly etiquetaUrgencia = etiquetaUrgencia;
  readonly clasesUrgencia = clasesUrgencia;

  especialidades = signal<EspecialidadResumen[]>([]);
  mostrarFormulario = signal(false);
  guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    idEspecialidad: [null as number | null, [Validators.required]],
    urgencia: [1, [Validators.required]],
    motivo: ['', [Validators.required, Validators.maxLength(200)]],
  });

  especialidadesDisponibles(): EspecialidadResumen[] {
    const derivadas = new Set(this.derivaciones.map((d) => d.idEspecialidad));
    return this.especialidades().filter((e) => !derivadas.has(e.idEspecialidad));
  }

  alternarFormulario(): void {
    const abrir = !this.mostrarFormulario();
    this.mostrarFormulario.set(abrir);

    if (abrir && this.especialidades().length === 0) {
      this.cargarEspecialidades();
    }
  }

  private cargarEspecialidades(): void {
    this.citaService.listarEspecialidadesResumen().subscribe({
      next: (response) => this.especialidades.set(response.object || []),
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar las especialidades');
      },
    });
  }

  guardar(): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    const dto = this.form.getRawValue() as DerivacionCrearDTO;

    this.atencionService.crearDerivacion(this.idDiagnostico, dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Derivación registrada con éxito');
        this.guardando.set(false);
        this.form.reset();
        this.mostrarFormulario.set(false);
        this.creado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo registrar la derivación');
        this.guardando.set(false);
      },
    });
  }
}
