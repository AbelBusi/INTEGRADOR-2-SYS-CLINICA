import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';

import { HorarioDia } from '../../../horarios/interface/horario.interface';
import {
  DIAS_SEMANA,
  MESES,
  aFechaISO,
  aHHmm,
  aISO,
  aMinutos,
  fechaDesdeISO,
  formatearDiaLargo,
  inicioSemana,
  sumarDias,
} from '../../../horarios/utils/calendario.util';
import {
  Cita,
  CitaDTO,
  CitaFila,
  DURACIONES,
  EspecialidadResumen,
  MedicoResumen,
  PacienteBusqueda,
} from '../../interface/cita.interface';
import {
  huecosDisponibles,
  minutosAHHmm,
  minutosAhora,
  normalizarCita,
  ocupadosDelDia,
  rotuloRango,
  seCruzan,
  tramosDelDia,
} from '../../utils/disponibilidad.util';
import { CitaService } from '../../services/cita.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { CrearPacienteModalComponent } from '../../../pacientes/components/crear-paciente-modal/crear-paciente-modal.component';
import { PacienteRespuesta } from '../../../pacientes/interface/paciente.interface';

type EstadoDia = 'pasado' | 'cerrado' | 'completo' | 'disponible';

interface DiaAgenda {
  iso: string;
  numero: number;
  etiquetaMes: string | null;
  estado: EstadoDia;
  libres: number;
  esHoy: boolean;
}

const DIAS_POR_PAGINA = 28;
const MAXIMO_PAGINAS = 12;

@Component({
  selector: 'app-cita-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CrearPacienteModalComponent],
  templateUrl: './cita-form-modal.component.html',
})
export class CitaFormModalComponent implements OnInit {
  @Input() cita: CitaFila | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<Cita>();

  readonly duraciones = DURACIONES;
  readonly dias = DIAS_SEMANA;
  readonly hoy = new Date();
  readonly hoyISO = aISO(this.hoy);
  readonly MIN_BUSQUEDA = 3;

  private readonly destroyRef = inject(DestroyRef);
  private readonly busqueda$ = new Subject<string>();

  especialidades = signal<EspecialidadResumen[]>([]);
  medicos = signal<MedicoResumen[]>([]);
  horarios = signal<HorarioDia[]>([]);
  programadas = signal<CitaFila[]>([]);

  paciente = signal<PacienteBusqueda | null>(null);
  textoBusqueda = signal('');
  resultados = signal<PacienteBusqueda[]>([]);
  buscando = signal(false);
  busquedaCompleta = signal(false);
  errorBusqueda = signal(false);

  crearPacienteAbierto = signal(false);
  documentoPrefill = signal('');
  cargandoNuevoPaciente = signal(false);

  idEspecialidad = signal<number | null>(null);
  idMedico = signal<number | null>(null);
  fecha = signal('');
  duracion = signal(30);
  horaInicio = signal('');
  horaSalida = signal('');
  motivo = signal('');
  idUsuario = signal<number | null>(null);
  paginaAgenda = signal(0);

  cargandoInicial = signal(false);
  cargandoMedicos = signal(false);
  cargandoHorario = signal(false);
  guardando = signal(false);

  inicioAgenda = computed(() =>
    sumarDias(inicioSemana(this.hoy), this.paginaAgenda() * DIAS_POR_PAGINA),
  );

  rotuloAgenda = computed(() =>
    rotuloRango(this.inicioAgenda(), sumarDias(this.inicioAgenda(), DIAS_POR_PAGINA - 1)),
  );

  patronSemanal = computed(() =>
    DIAS_SEMANA.map((dia) => {
      const tramos = this.horarios()
        .filter((h) => h.diaSemana === dia.numero && aFechaISO(h.fechaFin) >= this.hoyISO)
        .map((h) => `${aHHmm(h.horaEntrada)}-${aHHmm(h.horaSalida)}`);

      return { corto: dia.corto, largo: dia.largo, tramos: [...new Set(tramos)].sort() };
    }),
  );

  diasAgenda = computed<DiaAgenda[]>(() => {
    const idMedico = this.idMedico();
    const horarios = this.horarios();
    const programadas = this.programadas();
    const excluirId = this.cita?.id ?? null;
    const duracion = this.duracion();
    const inicio = this.inicioAgenda();

    return Array.from({ length: DIAS_POR_PAGINA }, (_, i) => {
      const fecha = sumarDias(inicio, i);
      const iso = aISO(fecha);

      let estado: EstadoDia = 'pasado';
      let libres = 0;

      if (iso >= this.hoyISO && idMedico !== null) {
        const tramos = tramosDelDia(horarios, iso);

        if (tramos.length === 0) {
          estado = 'cerrado';
        } else {
          const ocupados = ocupadosDelDia(programadas, idMedico, iso, excluirId);
          const minimo = iso === this.hoyISO ? minutosAhora() : 0;

          libres = huecosDisponibles(tramos, ocupados, duracion, minimo).length;
          estado = libres > 0 ? 'disponible' : 'completo';
        }
      }

      return {
        iso,
        numero: fecha.getDate(),
        etiquetaMes:
          i === 0 || fecha.getDate() === 1 ? MESES[fecha.getMonth()].substring(0, 3) : null,
        estado,
        libres,
        esHoy: iso === this.hoyISO,
      };
    });
  });

  fechaTexto = computed(() => {
    const fecha = this.fecha();
    return fecha ? formatearDiaLargo(fechaDesdeISO(fecha)) : '';
  });

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
    if (!this.fecha() || this.errorFecha()) {
      return null;
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
      this.paciente() !== null &&
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

    this.busqueda$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termino) =>
          termino.length < this.MIN_BUSQUEDA
            ? of(null)
            : this.citaService.buscarPacientes(termino).pipe(
                map((response) => ({ ok: true, lista: response.object || [] })),
                catchError(() => of({ ok: false, lista: [] as PacienteBusqueda[] })),
              ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((resultado) => {
        if (resultado === null) {
          this.resultados.set([]);
          this.buscando.set(false);
          return;
        }

        this.resultados.set(resultado.lista);
        this.errorBusqueda.set(!resultado.ok);
        this.busquedaCompleta.set(true);
        this.buscando.set(false);
      });

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

  claseDia(dia: DiaAgenda): string {
    if (dia.iso === this.fecha()) {
      return 'border-[#D9182A] bg-[#D9182A] text-white';
    }

    const marcaHoy = dia.esHoy ? ' ring-1 ring-[#58595B]' : '';

    switch (dia.estado) {
      case 'disponible':
        return `border-[#0d6b68]/40 bg-[#0d6b68]/10 text-[#0d6b68] hover:bg-[#0d6b68]/20${marcaHoy}`;
      case 'completo':
        return `cursor-not-allowed border-[#D9182A]/30 bg-[#D9182A]/5 text-[#D9182A]${marcaHoy}`;
      case 'cerrado':
        return `cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400${marcaHoy}`;
      default:
        return 'cursor-not-allowed border-transparent bg-transparent text-neutral-300';
    }
  }

  textoDia(dia: DiaAgenda): string {
    switch (dia.estado) {
      case 'disponible':
        return `${dia.libres} libres`;
      case 'completo':
        return 'Completo';
      case 'cerrado':
        return 'No atiende';
      default:
        return '';
    }
  }

  onBusquedaInput(valor: string): void {
    const termino = valor.trim();

    this.textoBusqueda.set(valor);
    this.busquedaCompleta.set(false);
    this.errorBusqueda.set(false);

    if (termino.length < this.MIN_BUSQUEDA) {
      this.resultados.set([]);
      this.buscando.set(false);
    } else {
      this.buscando.set(true);
    }

    this.busqueda$.next(termino);
  }

  seleccionarPaciente(paciente: PacienteBusqueda): void {
    this.paciente.set(paciente);
    this.textoBusqueda.set('');
    this.resultados.set([]);
    this.busquedaCompleta.set(false);
    this.buscando.set(false);
  }

  quitarPaciente(): void {
    this.paciente.set(null);
    this.textoBusqueda.set('');
    this.resultados.set([]);
    this.busquedaCompleta.set(false);
  }

  abrirCrearPaciente(): void {
    const texto = this.textoBusqueda().trim();
    this.documentoPrefill.set(/^\d{8}$/.test(texto) ? texto : '');
    this.crearPacienteAbierto.set(true);
  }

  onPacienteCreado(creado: PacienteRespuesta): void {
    this.cargandoNuevoPaciente.set(true);

    this.citaService.obtenerPaciente(creado.id).subscribe({
      next: (response) => {
        const p = response.object;

        this.seleccionarPaciente({
          idPaciente: p.id,
          nombre: `${p.nombre} ${p.apellidos}`.trim(),
          tipoDocumento: p.codigoTipoDocumento,
          numeroDocumento: p.numeroDocumento,
          genero: p.genero,
        });
        this.cargandoNuevoPaciente.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastService.warning(
          'El paciente fue creado, pero no se pudo cargar. Búscalo por su documento.',
        );
        this.cargandoNuevoPaciente.set(false);
      },
    });
  }

  private cargarInicial(): void {
    this.cargandoInicial.set(true);

    forkJoin({
      especialidades: this.citaService.listarEspecialidadesResumen(),
      programadas: this.citaService.listar(1),
    }).subscribe({
      next: ({ especialidades, programadas }) => {
        this.especialidades.set(especialidades.object || []);
        this.programadas.set((programadas.object || []).map(normalizarCita));
        this.cargandoInicial.set(false);

        if (this.cita) {
          this.prepararEdicion(this.cita);
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
    this.paciente.set({
      idPaciente: cita.idPaciente,
      nombre: cita.paciente,
      tipoDocumento: '',
      numeroDocumento: '',
      genero: '',
    });
    this.fecha.set(cita.fecha);
    this.horaInicio.set(cita.inicio);
    this.horaSalida.set(cita.salida);
    this.motivo.set(cita.motivo);

    const duracion = aMinutos(cita.salida) - aMinutos(cita.inicio);
    if (DURACIONES.includes(duracion)) {
      this.duracion.set(duracion);
    }

    const diferencia = Math.floor(
      (fechaDesdeISO(cita.fecha).getTime() - inicioSemana(this.hoy).getTime()) /
        86400000 /
        DIAS_POR_PAGINA,
    );
    this.paginaAgenda.set(Math.min(Math.max(diferencia, 0), MAXIMO_PAGINAS));

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
    this.fecha.set('');
    this.limpiarHoras();

    if (id !== null) {
      this.cargarMedicos(id);
    }
  }

  onMedicoChange(id: number | null): void {
    this.idMedico.set(id);
    this.horarios.set([]);
    this.fecha.set('');
    this.paginaAgenda.set(0);
    this.limpiarHoras();

    if (id !== null) {
      this.cargarHorarios(id);
    }
  }

  paginaAnterior(): void {
    this.paginaAgenda.update((pagina) => Math.max(pagina - 1, 0));
  }

  paginaSiguiente(): void {
    this.paginaAgenda.update((pagina) => Math.min(pagina + 1, MAXIMO_PAGINAS));
  }

  seleccionarDia(dia: DiaAgenda): void {
    if (dia.estado !== 'disponible') {
      return;
    }

    this.fecha.set(dia.iso);
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
    const paciente = this.paciente();
    const idMedico = this.idMedico();

    if (
      !this.formularioValido() ||
      this.guardando() ||
      idUsuario === null ||
      paciente === null ||
      idMedico === null
    ) {
      return;
    }

    const dto: CitaDTO = {
      idPaciente: paciente.idPaciente,
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
        this.guardado.emit(response.object);
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
