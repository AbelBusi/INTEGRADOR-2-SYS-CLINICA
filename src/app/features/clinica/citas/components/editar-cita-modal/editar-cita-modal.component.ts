import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  ChangeDetectorRef,
  OnDestroy,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { CitaService } from '../../services/cita.service';
import { PacienteService } from '../../../pacientes/services/paciente.service';
import { DoctorService } from '../../../doctores/services/doctor.service';
import { RecepcionistaService } from '../../../recepcionistas/services/recepcionista.service';
import { EspecialidadService } from '../../../especialidad/services/especialidad.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { CitaMedicaActualizarDTO, CitaMedicaResumenDTO } from '../../interface/cita.interface';
import { PacienteResumenDTO } from '../../../pacientes/interface/paciente.interface';
import { DoctorEspecialidadResumen } from '../../../doctores/interface/doctor.interface';
import { NombreRecepcionistaDTO } from '../../../recepcionistas/interface/recepcionista.interface';
import { NombreEspecialidadDTO } from '../../../especialidad/interface/especialidad.interface';

@Component({
  selector: 'app-editar-cita-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-cita-modal.component.html',
})
export class EditarCitaModalComponent implements OnDestroy {
  private readonly citaService = inject(CitaService);
  private readonly pacienteService = inject(PacienteService);
  private readonly doctorService = inject(DoctorService);
  private readonly recepcionistaService = inject(RecepcionistaService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  cita = input.required<CitaMedicaResumenDTO>();
  close = output<void>();
  save = output<any>();
  guardadoExitoso = output<void>();

  guardando = signal(false);
  pacientes: PacienteResumenDTO[] = [];
  recepcionistas: NombreRecepcionistaDTO[] = [];
  especialidades: NombreEspecialidadDTO[] = [];
  doctores: DoctorEspecialidadResumen[] = [];

  form = signal<{
    recepcionistaId: number | null;
    pacienteId: number | null;
    especialidadId: number | null;
    doctorId: number | null;
    motivo: string;
    fecha: string;
    horaInicio: string;
    horaSalida: string;
    costo: number | null;
    estado: number;
  }>({
    recepcionistaId: null,
    pacienteId: null,
    especialidadId: null,
    doctorId: null,
    motivo: '',
    fecha: '',
    horaInicio: '',
    horaSalida: '',
    costo: null,
    estado: 1,
  });

  readonly today = new Date().toISOString().split('T')[0];

  iniciales = computed(() => {
    const c = this.cita();
    if (!c) return 'CI';
    return `${c.nombrePaciente?.[0] || ''}${c.apellidosPaciente?.[0] || ''}`.toUpperCase();
  });

  constructor() {
    // El EFFECT es la clave: reacciona únicamente cuando el "input" de la cita ya tiene los datos reales del padre
    effect(() => {
      const c = this.cita();
      if (c && c.id) {
        this.cargarCatalogosYPreseleccionar(c);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarCatalogosYPreseleccionar(c: CitaMedicaResumenDTO): void {
    // Forzamos la descarga en paralelo de todos los catálogos
    forkJoin({
      recepcionistas: this.recepcionistaService.resumen(),
      pacientes: this.pacienteService.resumen(),
      especialidades: this.especialidadService.listarResumen(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          // 1. Guardar listas maestras procesadas
          this.recepcionistas = [
            ...(Array.isArray(res.recepcionistas)
              ? res.recepcionistas
              : res.recepcionistas?.object || []),
          ];

          const dataPacientes = Array.isArray(res.pacientes)
            ? res.pacientes
            : res.pacientes?.object || [];
          this.pacientes = dataPacientes.map((pac: any) => ({
            ...pac,
            idPaciente: pac.idPaciente ? Number(pac.idPaciente) : Number(pac.id),
          }));

          this.especialidades = [
            ...(Array.isArray(res.especialidades)
              ? res.especialidades
              : res.especialidades?.object || []),
          ];

          // 2. Procesar las horas
          const hInicio = c.horaInicio ? c.horaInicio.slice(0, 5) : '';
          const hSalida = c.horaSalida ? c.horaSalida.slice(0, 5) : '';

          // Mapeo ultra seguro del ID del paciente por si difieren las propiedades del backend
          const pacienteIdFinal = c.pacienteId || c.pacienteId || (c.pacienteId as any)?.id || null;

          // 3. Llenamos el formulario (Aquí Angular ya tiene los catálogos renderizados, por lo que hará MATCH inmediato)
          this.form.set({
            recepcionistaId: c.recepcionistaId ? Number(c.recepcionistaId) : null,
            pacienteId: pacienteIdFinal ? Number(pacienteIdFinal) : null,
            especialidadId: c.especialidadId ? Number(c.especialidadId) : null,
            doctorId: c.doctorId ? Number(c.doctorId) : null,
            motivo: c.motivoConsulta || '',
            fecha: c.diaConsulta || '',
            horaInicio: hInicio,
            horaSalida: hSalida,
            costo: c.costo !== undefined && c.costo !== null ? Number(c.costo) : null,
            estado: c.estado !== undefined && c.estado !== null ? Number(c.estado) : 1,
          });

          // 4. Si la cita tiene una especialidad guardada, traemos de inmediato sus doctores para que se preseleccione solo
          if (c.especialidadId) {
            this.cargarDoctoresPorEspecialidadYSeleccionar(
              Number(c.especialidadId),
              c.doctorId ? Number(c.doctorId) : null,
            );
          } else {
            this.cdr.detectChanges(); // Forzamos el refresco visual en Angular
          }
        },
        error: () => this.toast.error('Error al inicializar los catálogos maestros'),
      });
  }

  private cargarDoctoresPorEspecialidadYSeleccionar(
    especialidadId: number,
    doctorIdSeleccionar: number | null,
  ): void {
    this.doctorService
      .listarPorEspecialidad(especialidadId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const data = Array.isArray(res) ? res : res?.object || [];
          this.doctores = data.map((doc: any) => ({
            ...doc,
            id: doc.id ? Number(doc.id) : Number(doc.idDoctor),
          }));

          if (doctorIdSeleccionar) {
            this.form.update((f) => ({ ...f, doctorId: Number(doctorIdSeleccionar) }));
          }

          this.cdr.detectChanges(); // Forzamos el refresco visual en Angular
        },
        error: () => this.toast.error('Error al cargar la lista de doctores'),
      });
  }

  onEspecialidadChange(nuevoId: any): void {
    const specialtyId = nuevoId === 'null' || !nuevoId ? null : Number(nuevoId);

    this.doctores = [];
    this.form.update((f) => ({ ...f, doctorId: null, especialidadId: specialtyId }));

    if (specialtyId) {
      this.cargarDoctoresPorEspecialidadYSeleccionar(specialtyId, null);
    }
  }

  updateField(field: string, value: any): void {
    let processedValue = value;
    if (field.endsWith('Id') || field === 'estado' || field === 'costo') {
      processedValue =
        value === 'null' || value === null || value === undefined || value === ''
          ? null
          : Number(value);
    }
    this.form.update((f) => ({ ...f, [field]: processedValue }));
  }

  get motivoLength(): number {
    return this.form().motivo?.length || 0;
  }

  guardar(): void {
    if (this.guardando()) return;
    const f = this.form();

    if (
      !f.recepcionistaId ||
      !f.pacienteId ||
      !f.especialidadId ||
      !f.doctorId ||
      !f.motivo ||
      !f.fecha ||
      !f.horaInicio ||
      !f.horaSalida ||
      f.costo === null
    ) {
      this.toast.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const dto: CitaMedicaActualizarDTO = {
      recepcionista: { id: f.recepcionistaId! },
      paciente: { id: f.pacienteId! },
      doctor: { id: f.doctorId! },
      especialidad: { id: f.especialidadId! },
      motivo: f.motivo,
      fecha: f.fecha,
      horaInicio: f.horaInicio,
      horaSalida: f.horaSalida,
      costo: Number(f.costo),
      estado: f.estado,
    };

    this.guardando.set(true);
    this.citaService
      .actualizar(this.cita().id, dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.guardando.set(false);
          this.toast.success(res?.mensaje || 'Cita médica actualizada exitosamente');
          this.save.emit(res?.object ?? res);
          this.guardadoExitoso.emit();
          this.close.emit();
        },
        error: (err: any) => {
          this.guardando.set(false);
          this.toast.error(err.error?.mensaje || 'Error al actualizar la cita médica');
        },
      });
  }
}
