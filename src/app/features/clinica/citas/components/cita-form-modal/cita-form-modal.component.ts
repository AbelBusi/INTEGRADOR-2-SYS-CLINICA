import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, map, of, switchMap } from 'rxjs';

import { HorarioDia } from '../../../horarios/interface/horario.interface';
import { aISO, aMinutos } from '../../../horarios/utils/calendario.util';
import {
  CitaDTO,
  CitaFila,
  DURACIONES,
  EspecialidadResumen,
  MedicoResumen,
  PacienteResumen,
} from '../../interface/cita.interface';
import {
  huecosDisponibles,
  minutosAHHmm,
  minutosAhora,
  normalizarCita,
  ocupadosDelDia,
  seCruzan,
  tramosDelDia,
} from '../../utils/disponibilidad.util';
import { CitaService } from '../../services/cita.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-cita-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cita-form-modal.component.html',
})
export class CitaFormModalComponent implements OnInit {
  @Input() cita: CitaFila | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  readonly duraciones = DURACIONES;
  readonly hoyISO = aISO(new Date());

  pacientes = signal<PacienteResumen[]>([]);
  especialidades = signal<EspecialidadResumen[]>([]);
  medicos = signal<MedicoResumen[]>([]);
  horarios = signal<HorarioDia[]>([]);
  programadas = signal<CitaFila[]>([]);

  idPaciente = signal<number | null>(null);
  idEspecialidad = signal<number | null>(null);
  idMedico = signal<number | null>(null);
  fecha = signal('');
  duracion = signal(30);
  horaInicio = signal('');
  horaSalida = signal('');
  motivo = signal('');

  idUsuario = signal<number | null>(null);

  cargandoInicial = signal(false);
  cargandoMedicos = signal(false);
  cargandoHorario = signal(false);
  guardando = signal(false);

  tramos = computed(() =>
    this.idMedico() !== null ? tramosDelDia(this.horarios(), this.fecha()) : [],
  );

  ocupados = computed(() =>
    ocupadosDelDia(this.programadas(), this.idMedico(), this.fecha(), this.cita?.id ?? null),
  );

  slots = computed(() => {
    const minimo = this.fecha() === this.hoyISO ? minutosAhora() : 0;
    return huecosDisponibles(this.tramos(), this.ocupados(), this.duracion(), minimo);
  });

  errorFecha = computed(() => {
    const fecha = this.fecha();

    if (fecha && fecha < this.hoyISO) {
      return 'La fecha no puede ser anterior a hoy.';
    }

    return null;
  });

  mensajeDisponibilidad = computed(() => {
    if (this.idMedico() === null || !this.fecha() || this.errorFecha() || this.cargandoHorario()) {
      return null;
    }

    if (this.horarios().length === 0) {
      return 'El médico no tiene horarios de atención registrados.';
    }

    if (this.tramos().length === 0) {
      return 'El médico no atiende en la fecha seleccionada.';
    }

    return null;
  });

  errorHorario = computed(() => {
    const inicioTexto = this.horaInicio();
    const salidaTexto = this.horaSalida();

    if (!inicioTexto || !salidaTexto) {
      return null;
    }

    const inicio = aMinutos(inicioTexto);
    const salida = aMinutos(salidaTexto);

    if (inicio >= salida) {
      return 'La hora de salida debe ser posterior a la de inicio.';
    }

    if (this.fecha() === this.hoyISO && inicio < minutosAhora()) {
      return 'La hora de inicio de hoy ya pasó.';
    }

    if (
      this.tramos().length > 0 &&
      !this.tramos().some((t) => inicio >= t.inicio && salida <= t.fin)
    ) {
      return 'El horario elegido está fuera de la jornada del médico.';
    }

    const cruce = this.ocupados().find((o) => seCruzan({ inicio, fin: salida }, o));

    if (cruce) {
      return `Se cruza con otra cita programada (${minutosAHHmm(cruce.inicio)} - ${minutosAHHmm(cruce.fin)}).`;
    }

    return null;
  });

  formularioValido = computed(
    () =>
      this.idUsuario() !== null &&
      this.idPaciente() !== null &&
      this.idMedico() !== null &&
      this.fecha() !== '' &&
      this.errorFecha() === null &&
      !this.cargandoHorario() &&
      this.tramos().length > 0 &&
      this.horaInicio() !== '' &&
      this.horaSalida() !== '' &&
      this.errorHorario() === null &&
      this.motivo().trim().length > 0 &&
      this.motivo().length <= 200,
  );

  constructor(
    private readonly citaService: CitaService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    const idUsuario = Number(this.authService.getUserId());

    if (Number.isFinite(idUsuario) && idUsuario > 0) {
      this.idUsuario.set(idUsuario);
    } else {
      this.toastService.error(
        'No se pudo identificar al usuario de la sesión. Inicia sesión de nuevo.',
      );
    }

    this.cargarInicial();
  }

  hora(minutos: number): string {
    return minutosAHHmm(minutos);
  }

  slotSeleccionado(minutos: number): boolean {
    return (
      this.horaInicio() === minutosAHHmm(minutos) &&
      this.horaSalida() === minutosAHHmm(minutos + this.duracion())
    );
  }

  private cargarInicial(): void {
    this.cargandoInicial.set(true);

    forkJoin({
      pacientes: this.citaService.listarPacientesResumen(),
      especialidades: this.citaService.listarEspecialidadesResumen(),
      programadas: this.citaService.listar(1),
    }).subscribe({
      next: ({ pacientes, especialidades, programadas }) => {
        const cita = this.cita;
        const lista = pacientes.object || [];

        this.pacientes.set(
          cita && !lista.some((p) => p.idPaciente === cita.idPaciente)
            ? [{ idPaciente: cita.idPaciente, nombre: cita.paciente }, ...lista]
            : lista,
        );
        this.especialidades.set(especialidades.object || []);
        this.programadas.set((programadas.object || []).map(normalizarCita));
        this.cargandoInicial.set(false);

        if (cita) {
          this.prepararEdicion(cita);
        }
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los datos del formulario.');
        this.cargandoInicial.set(false);
        this.onClose();
      },
    });
  }

  private prepararEdicion(cita: CitaFila): void {
    this.idPaciente.set(cita.idPaciente);
    this.fecha.set(cita.fecha);
    this.horaInicio.set(cita.inicio);
    this.horaSalida.set(cita.salida);
    this.motivo.set(cita.motivo);

    const duracion = aMinutos(cita.salida) - aMinutos(cita.inicio);
    if (DURACIONES.includes(duracion)) {
      this.duracion.set(duracion);
    }

    this.idMedico.set(cita.idMedico);
    this.cargandoMedicos.set(true);
    this.cargandoHorario.set(true);

    this.citaService.obtenerMedico(cita.idMedico).subscribe({
      next: (response) => {
        const info = response.object;

        this.idEspecialidad.set(info.idEspecialidad);
        this.cargarMedicos(info.idEspecialidad, { idMedico: cita.idMedico, nombre: cita.medico });
        this.cargarHorarios(cita.idMedico, info.idEmpleado);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los datos del médico de la cita.');
        this.cargandoMedicos.set(false);
        this.cargandoHorario.set(false);
      },
    });
  }

  private cargarMedicos(idEspecialidad: number, respaldo?: MedicoResumen): void {
    this.cargandoMedicos.set(true);

    this.citaService.listarMedicosPorEspecialidad(idEspecialidad).subscribe({
      next: (response) => {
        if (this.idEspecialidad() !== idEspecialidad) {
          return;
        }

        const lista = response.object || [];

        this.medicos.set(
          respaldo && !lista.some((m) => m.idMedico === respaldo.idMedico)
            ? [respaldo, ...lista]
            : lista,
        );
        this.cargandoMedicos.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los médicos de la especialidad.');
        this.cargandoMedicos.set(false);
      },
    });
  }

  private cargarHorarios(idMedico: number, idEmpleadoConocido?: number): void {
    this.cargandoHorario.set(true);

    const idEmpleado$ =
      idEmpleadoConocido !== undefined
        ? of(idEmpleadoConocido)
        : this.citaService.obtenerMedico(idMedico).pipe(map((r) => r.object.idEmpleado));

    idEmpleado$.pipe(switchMap((id) => this.citaService.obtenerHorarios(id))).subscribe({
      next: (response) => {
        if (this.idMedico() === idMedico) {
          this.horarios.set(response.object?.horarios ?? []);
          this.cargandoHorario.set(false);
        }
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudo cargar el horario del médico.');
        this.cargandoHorario.set(false);
      },
    });
  }

  private recargarProgramadas(): void {
    this.citaService.listar(1).subscribe({
      next: (response) => this.programadas.set((response.object || []).map(normalizarCita)),
      error: (error) => console.error(error),
    });
  }

  private limpiarHoras(): void {
    this.horaInicio.set('');
    this.horaSalida.set('');
  }

  onEspecialidadChange(id: number | null): void {
    this.idEspecialidad.set(id);
    this.idMedico.set(null);
    this.medicos.set([]);
    this.horarios.set([]);
    this.limpiarHoras();

    if (id !== null) {
      this.cargarMedicos(id);
    }
  }

  onMedicoChange(id: number | null): void {
    this.idMedico.set(id);
    this.horarios.set([]);
    this.limpiarHoras();

    if (id !== null) {
      this.cargarHorarios(id);
    }
  }

  onFechaChange(valor: string): void {
    this.fecha.set(valor);
    this.limpiarHoras();
  }

  onDuracionChange(valor: number): void {
    this.duracion.set(valor);

    const inicio = this.horaInicio();
    if (inicio) {
      this.horaSalida.set(minutosAHHmm(aMinutos(inicio) + valor));
    }
  }

  seleccionarSlot(minutos: number): void {
    this.horaInicio.set(minutosAHHmm(minutos));
    this.horaSalida.set(minutosAHHmm(minutos + this.duracion()));
  }

  guardar(): void {
    const idUsuario = this.idUsuario();
    const idPaciente = this.idPaciente();
    const idMedico = this.idMedico();

    if (
      !this.formularioValido() ||
      this.guardando() ||
      idUsuario === null ||
      idPaciente === null ||
      idMedico === null
    ) {
      return;
    }

    const dto: CitaDTO = {
      idPaciente,
      idMedico,
      idUsuario,
      fechaCita: this.fecha(),
      horaInicio: this.horaInicio(),
      horaSalida: this.horaSalida(),
      motivo: this.motivo().trim(),
    };

    this.guardando.set(true);

    const peticion = this.cita
      ? this.citaService.actualizar(this.cita.id, dto)
      : this.citaService.crear(dto);

    peticion.subscribe({
      next: (response) => {
        this.toastService.success(
          response?.mensaje ||
            (this.cita ? 'Cita actualizada con éxito' : 'Cita registrada con éxito'),
        );
        this.guardando.set(false);
        this.guardado.emit();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo guardar la cita.');
        this.guardando.set(false);

        if (error.status === 409) {
          this.recargarProgramadas();
        }
      },
    });
  }

  onClose(): void {
    if (!this.guardando()) {
      this.close.emit();
    }
  }
}
