import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CitaService } from '../../services/cita.service';
import { PacienteService } from '../../../pacientes/services/paciente.service';
import { DoctorService } from '../../../doctores/services/doctor.service';
import { EspecialidadService } from '../../../especialidad/services/especialidad.service';
import { HorarioService } from '../../../horarios/services/horario.service';
import { Disponibilidad } from '../../../horarios/models/horario.model';
import { RecepcionistaService } from '../../../recepcionistas/services/recepcionista.service';
import { RecepcionistaLeer } from '../../../recepcionistas/models/recepcionista.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PacienteResumenDTO } from '../../../pacientes/interface/paciente.interface';
import { DoctorEspecialidadResumen } from '../../../doctores/interface/doctor.interface';
import { NombreEspecialidadDTO } from '../../../especialidad/interface/especialidad.interface';
import { CitaMedicaCrearDTO } from '../../interface/cita.interface';
import { PagoModalComponent } from '../../components/pago-modal/pago-modal.component';
import { CitaCalendarioModalComponent } from '../../components/cita-calendario-modal/cita-calendario-modal.component';

@Component({
  selector: 'app-crear-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PagoModalComponent, CitaCalendarioModalComponent],
  templateUrl: './crear-cita.component.html',
})
export class CrearCitaComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly citaService = inject(CitaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly horarioService = inject(HorarioService);
  private readonly recepcionistaService = inject(RecepcionistaService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  isSaving = false;
  esRecepcionista = false;
  recepcionistaActual: RecepcionistaLeer | null = null;

  showModalPago = signal<boolean>(false);
  showCalendario = signal<boolean>(false);
  metodoSeleccionado = signal<string>('efectivo');

  pacientes: PacienteResumenDTO[] = [];
  recepcionistas: Disponibilidad[] = [];
  especialidades: NombreEspecialidadDTO[] = [];
  doctores: DoctorEspecialidadResumen[] = [];

  ngOnInit(): void {
    this.initForm();
    this.cargarDatosIniciales();

    this.esRecepcionista = this.authService.getRole() === 'RECEPCIONISTA';
    if (this.esRecepcionista) {
      this.recepcionistaService
        .actual()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (r) => {
            this.recepcionistaActual = r;
            this.form.get('recepcionistaId')!.setValue(r.id, { emitEvent: false });
            this.cdr.markForCheck();
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.form = this.fb.group({
      recepcionistaId: ['', Validators.required],
      pacienteId: ['', Validators.required],
      especialidadId: ['', Validators.required],
      doctorId: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.maxLength(500)]],
      fecha: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaSalida: ['', Validators.required],
      costo: ['', [Validators.required, Validators.min(0.01)]],
      estado: [1, Validators.required],
    });
    this.form.get('doctorId')!.disable({ emitEvent: false });
  }

  private cargarDatosIniciales(): void {
    this.pacienteService
      .resumen()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.pacientes = [...(Array.isArray(res) ? res : res?.object || [])];
          this.cdr.markForCheck();
        },
        error: () => this.toast.error('Error al cargar la lista de pacientes'),
      });

    this.especialidadService
      .listarResumen()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.especialidades = [...(Array.isArray(res) ? res : res?.object || [])];
          this.cdr.markForCheck();
        },
        error: () => this.toast.error('Error al cargar las especialidades'),
      });
  }

  onEspecialidadChange(event: Event): void {
    const especialidadId = (event.target as HTMLSelectElement).value;
    this.doctores = [];
    this.form.get('doctorId')!.patchValue('', { emitEvent: false });
    this.limpiarFechaHora();

    if (especialidadId) {
      this.form.get('doctorId')!.enable({ emitEvent: false });
      this.doctorService
        .listarPorEspecialidad(Number(especialidadId))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.doctores = [...(Array.isArray(res) ? res : res?.object || [])];
            this.cdr.markForCheck();
            if (this.doctores.length === 0) {
              this.toast.info('No hay doctores registrados para esta especialidad');
            }
          },
          error: () => this.toast.error('Error al cargar los doctores de la especialidad'),
        });
    } else {
      this.form.get('doctorId')!.disable({ emitEvent: false });
    }
  }

  onDoctorChange(): void {
    this.limpiarFechaHora();
  }

  private limpiarFechaHora(): void {
    this.form.patchValue({ fecha: '', horaInicio: '', horaSalida: '' }, { emitEvent: false });
    if (!this.esRecepcionista) {
      this.recepcionistas = [];
      this.form.get('recepcionistaId')!.patchValue('', { emitEvent: false });
    }
  }

  get doctorSeleccionadoNombre(): string {
    const id = Number(this.form?.get('doctorId')?.value);
    return this.doctores.find((d) => d.id === id)?.nombres ?? '';
  }

  get especialidadSeleccionadaNombre(): string {
    const id = Number(this.form?.get('especialidadId')?.value);
    return this.especialidades.find((e) => e.idEspecialidad === id)?.nombreEspecialidad ?? '';
  }

  get doctorIdActual(): number {
    return Number(this.form?.get('doctorId')?.value) || 0;
  }

  get fechaSeleccionada(): string {
    return this.form?.get('fecha')?.value || '';
  }

  get horaInicioSeleccionada(): string {
    return this.form?.get('horaInicio')?.value || '';
  }

  get horaSalidaSeleccionada(): string {
    return this.form?.get('horaSalida')?.value || '';
  }

  abrirCalendario(): void {
    if (!this.doctorIdActual) {
      this.toast.warning('Seleccione primero una especialidad y un doctor.');
      return;
    }
    this.showCalendario.set(true);
  }

  onFechaHoraSeleccionada(sel: { fecha: string; horaInicio: string; horaFin: string }): void {
    this.form.patchValue(
      { fecha: sel.fecha, horaInicio: sel.horaInicio, horaSalida: sel.horaFin },
      { emitEvent: false },
    );
    this.actualizarRecepcionistas();
  }

  private actualizarRecepcionistas(): void {
    if (this.esRecepcionista) return;
    const { fecha, horaInicio, horaSalida } = this.form.getRawValue();
    if (!fecha || !horaInicio || !horaSalida) return;
    this.horarioService
      .recepcionistasDisponibles(fecha, horaInicio, horaSalida)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.recepcionistas = res;
          if (!res.some((r) => r.id === Number(this.form.get('recepcionistaId')!.value))) {
            this.form.get('recepcionistaId')!.patchValue('', { emitEvent: false });
          }
          this.cdr.markForCheck();
        },
        error: () => this.toast.error('Error al cargar los recepcionistas disponibles'),
      });
  }

  isInvalid(campo: string): boolean {
    const ctrl = this.form.get(campo);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  setMetodoPago(metodo: string): void {
    this.metodoSeleccionado.set(metodo);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Por favor, complete todos los campos obligatorios correctamente.');
      return;
    }
    if (this.metodoSeleccionado() === 'paypal') {
      this.showModalPago.set(true);
    } else {
      this.procesarGuardadoBackend();
    }
  }

  ejecutarGuardadoPostPago(): void {
    this.showModalPago.set(false);
    this.procesarGuardadoBackend();
  }

  private procesarGuardadoBackend(): void {
    this.isSaving = true;
    const value = this.form.getRawValue();

    const dto: CitaMedicaCrearDTO = {
      recepcionista: { id: Number(value.recepcionistaId) },
      paciente: { id: Number(value.pacienteId) },
      doctor: { id: Number(value.doctorId) },
      especialidad: { id: Number(value.especialidadId) },
      motivo: value.motivo,
      fecha: value.fecha,
      horaInicio: value.horaInicio,
      horaSalida: value.horaSalida,
      costo: Number(value.costo),
      estado: Number(value.estado),
    };

    this.citaService
      .crear(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isSaving = false;
          this.form.reset({ estado: 1 });
          this.form.get('doctorId')!.disable({ emitEvent: false });
          this.doctores = [];
          this.recepcionistas = [];
          if (this.esRecepcionista && this.recepcionistaActual) {
            this.form.get('recepcionistaId')!.setValue(this.recepcionistaActual.id, { emitEvent: false });
          }
          this.metodoSeleccionado.set('efectivo');
          this.toast.success(res?.mensaje || 'Cita médica registrada exitosamente');
        },
        error: (err) => {
          this.isSaving = false;
          this.toast.error(err.error?.mensaje || 'Ocurrió un error al registrar la cita médica');
        },
      });
  }
}
