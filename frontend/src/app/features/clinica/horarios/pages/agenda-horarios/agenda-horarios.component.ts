import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import {
  CargoResumen,
  EmpleadoAgenda,
  HorarioResumen,
  MedicoAgenda,
  VistaCalendario,
} from '../../interface/horario.interface';
import {
  ALTURA_HORA,
  DIAS_SEMANA,
  aFechaISO,
  aHHmm,
  aISO,
  aMinutos,
  diaSemanaDeFecha,
  distribuirBloques,
  formatearDiaLargo,
  formatearFechaCorta,
  formatearMes,
  formatearRangoSemana,
  iniciales,
  inicioSemana,
  mismoDia,
  normalizar,
  sumarDias,
} from '../../utils/calendario.util';
import { HorarioService } from '../../services/horario.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { CrearHorarioModalComponent } from '../../components/crear-horario-modal/crear-horario-modal.component';
import { VerHorarioEmpleadoModalComponent } from '../../components/ver-horario-empleado-modal/ver-horario-empleado-modal.component';
import { TienePermisoDirective } from '../../../../../core/directives/tiene-permiso.directive';

// Paleta sobria (verdes y grises). El rojo queda reservado para "hoy" y acciones.
const PALETA_CARGO = [
  '#0d6b68',
  '#58595B',
  '#3f8f8c',
  '#8a8b8e',
  '#0a4f4d',
  '#6f7072',
  '#2f7f7c',
  '#a3a4a6',
];
const COLOR_SIN_CARGO = '#8a8b8e';
const ANCHO_COLUMNA_SEMANA = 108;
const ANCHO_GUTTER = 56;

interface HorarioVista {
  horario: HorarioResumen;
  inicio: string;
  fin: string;
  entradaMin: number;
  salidaMin: number;
}

interface BloqueVista {
  horario: HorarioResumen;
  entrada: string;
  salida: string;
  cargo: string;
  color: string;
  vigencia: string;
  top: number;
  alto: number;
  izquierda: number;
  ancho: number;
}

interface ColumnaVista {
  fecha: Date;
  dia: { numero: number; corto: string; largo: string };
  esHoy: boolean;
  bloques: BloqueVista[];
}

interface ChipMes {
  id: number;
  entrada: string;
  nombre: string;
  color: string;
}

interface CeldaMes {
  fecha: Date;
  delMes: boolean;
  esHoy: boolean;
  total: number;
  chips: ChipMes[];
  extra: number;
}

@Component({
  selector: 'app-agenda-horarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CrearHorarioModalComponent,
    VerHorarioEmpleadoModalComponent,
    TienePermisoDirective,
  ],
  templateUrl: './agenda-horarios.component.html',
})
export class AgendaHorariosComponent implements OnInit {
  readonly ALTURA = ALTURA_HORA;
  readonly dias = DIAS_SEMANA;
  readonly hoy = new Date();
  readonly hoyISO = aISO(this.hoy);

  private readonly destroyRef = inject(DestroyRef);
  private grilla: HTMLElement | null = null;

  @ViewChild('grilla')
  set grillaRef(ref: ElementRef<HTMLElement> | undefined) {
    this.grilla = ref?.nativeElement ?? null;
    if (this.grilla) {
      this.programarScroll();
    }
  }

  cargando = signal(false);
  errorCarga = signal(false);
  horarios = signal<HorarioResumen[]>([]);
  medicos = signal<MedicoAgenda[]>([]);

  busqueda = signal('');
  filtroCargo = signal<number | null>(null);
  filtroMedico = signal<number | null>(null);

  esMovil = signal(false);
  vista = signal<VistaCalendario>('semana');
  fechaRef = signal(new Date());

  modalCrear = signal(false);
  empleadoVer = signal<EmpleadoAgenda | null>(null);

  opcionesVista = computed<{ valor: VistaCalendario; etiqueta: string }[]>(() =>
    this.esMovil()
      ? [
          { valor: 'mes', etiqueta: 'Mes' },
          { valor: 'dia', etiqueta: 'Día' },
        ]
      : [
          { valor: 'mes', etiqueta: 'Mes' },
          { valor: 'semana', etiqueta: 'Semana' },
          { valor: 'dia', etiqueta: 'Día' },
        ],
  );

  // Cargos que realmente tienen médicos activos
  cargos = computed<CargoResumen[]>(() => {
    const mapa = new Map<number, string>();
    this.medicos().forEach((m) => mapa.set(m.idCargo, m.cargo));

    return [...mapa]
      .map(([idCargo, nombre]) => ({ idCargo, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  nombresCargo = computed(() => this.cargos().map((c) => c.nombre));

  cargoPorMedico = computed(() => new Map(this.medicos().map((m) => [m.idEmpleado, m.cargo])));

  idsMedico = computed(() => new Set(this.medicos().map((m) => m.idEmpleado)));

  cargoSeleccionado = computed(() => {
    const id = this.filtroCargo();
    return id === null ? null : (this.cargos().find((c) => c.idCargo === id)?.nombre ?? null);
  });

  // Médicos del cargo elegido (o todos)
  opcionesMedico = computed(() => {
    const idCargo = this.filtroCargo();

    return this.medicos()
      .filter((m) => idCargo === null || m.idCargo === idCargo)
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  // Solo horarios vigentes de médicos activos
  horariosActivos = computed(() => {
    const ids = this.idsMedico();
    return this.horarios().filter((h) => h.estado === 1 && ids.has(h.idEmpleado));
  });

  totalMedicos = computed(() => this.medicos().length);

  vigentesHoy = computed(() =>
    this.horariosActivos().filter((h) => {
      const vista = this.aVista(h);
      return vista.inicio <= this.hoyISO && vista.fin >= this.hoyISO;
    }),
  );

  medicosConHorario = computed(() => {
    const conHorario = new Set(this.vigentesHoy().map((h) => h.idEmpleado));
    return this.medicos().filter((m) => conHorario.has(m.idEmpleado)).length;
  });

  sinHorario = computed(() => Math.max(this.totalMedicos() - this.medicosConHorario(), 0));

  cobertura = computed(() => {
    const total = this.totalMedicos();
    return total ? Math.round((this.medicosConHorario() / total) * 100) : 0;
  });

  hayFiltros = computed(
    () =>
      this.busqueda().trim() !== '' || this.filtroCargo() !== null || this.filtroMedico() !== null,
  );

  horariosFiltrados = computed(() => {
    const termino = normalizar(this.busqueda().trim());
    const idMedico = this.filtroMedico();
    const cargo = this.cargoSeleccionado();

    return this.horariosActivos().filter((h) => {
      if (idMedico !== null && h.idEmpleado !== idMedico) {
        return false;
      }
      if (cargo && this.cargoDe(h.idEmpleado) !== cargo) {
        return false;
      }
      if (termino && !normalizar(h.empleado).includes(termino)) {
        return false;
      }
      return true;
    });
  });

  rangoVisible = computed(() => {
    const referencia = this.fechaRef();

    switch (this.vista()) {
      case 'mes': {
        const primero = new Date(referencia.getFullYear(), referencia.getMonth(), 1);
        const ultimo = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0);
        return {
          desde: aISO(inicioSemana(primero)),
          hasta: aISO(sumarDias(inicioSemana(ultimo), 6)),
        };
      }
      case 'semana': {
        const inicio = inicioSemana(referencia);
        return { desde: aISO(inicio), hasta: aISO(sumarDias(inicio, 6)) };
      }
      default:
        return { desde: aISO(referencia), hasta: aISO(referencia) };
    }
  });

  horariosEnRango = computed(() => {
    const { desde, hasta } = this.rangoVisible();
    return this.horariosFiltrados()
      .map((h) => this.aVista(h))
      .filter((v) => v.inicio <= hasta && v.fin >= desde);
  });

  horaDesde = computed(() => {
    const minimo = this.horariosEnRango().reduce(
      (acumulado, v) => Math.min(acumulado, Math.floor(v.entradaMin / 60)),
      7,
    );
    return Math.max(minimo, 0);
  });

  horaHasta = computed(() => {
    const maximo = this.horariosEnRango().reduce(
      (acumulado, v) => Math.max(acumulado, Math.ceil(v.salidaMin / 60)),
      19,
    );
    return Math.min(maximo, 24);
  });

  horas = computed(() =>
    Array.from({ length: this.horaHasta() - this.horaDesde() }, (_, i) => this.horaDesde() + i),
  );

  alturaTotal = computed(() => this.horas().length * ALTURA_HORA);

  lineaAhora = computed(() => {
    const ahora = new Date();
    const minutos = ahora.getHours() * 60 + ahora.getMinutes();
    const desde = this.horaDesde() * 60;
    const hasta = this.horaHasta() * 60;
    return minutos >= desde && minutos <= hasta ? ((minutos - desde) * ALTURA_HORA) / 60 : null;
  });

  titulo = computed(() => {
    const fecha = this.fechaRef();
    switch (this.vista()) {
      case 'mes':
        return formatearMes(fecha);
      case 'semana':
        return formatearRangoSemana(inicioSemana(fecha));
      default:
        return formatearDiaLargo(fecha);
    }
  });

  leyenda = computed(() => {
    const cargos = new Set(
      this.horariosEnRango()
        .map((v) => this.cargoDe(v.horario.idEmpleado))
        .filter((cargo) => cargo !== ''),
    );
    return [...cargos]
      .sort((a, b) => a.localeCompare(b))
      .map((nombre) => ({ nombre, color: this.colorDeCargo(nombre) }));
  });

  columnasVista = computed<ColumnaVista[]>(() => {
    const referencia = this.fechaRef();
    const fechas =
      this.vista() === 'dia'
        ? [referencia]
        : Array.from({ length: 7 }, (_, i) => sumarDias(inicioSemana(referencia), i));
    const inicioMinutos = this.horaDesde() * 60;
    const visibles = this.horariosEnRango();

    return fechas.map((fecha) => {
      const numeroDia = diaSemanaDeFecha(fecha);
      const iso = aISO(fecha);

      const items = visibles
        .filter((v) => v.horario.diaSemana === numeroDia && v.inicio <= iso && v.fin >= iso)
        .map((v) => ({ item: v, inicio: v.entradaMin, fin: v.salidaMin }))
        .filter((i) => i.fin > i.inicio);

      const bloques = distribuirBloques(items).map((b) => {
        const cargo = this.cargoDe(b.item.horario.idEmpleado);
        return {
          horario: b.item.horario,
          entrada: aHHmm(b.item.horario.horaEntrada),
          salida: aHHmm(b.item.horario.horaSalida),
          cargo,
          color: this.colorDeCargo(cargo),
          vigencia: `${formatearFechaCorta(b.item.inicio)} - ${formatearFechaCorta(b.item.fin)}`,
          top: ((b.inicio - inicioMinutos) * ALTURA_HORA) / 60,
          alto: Math.max(((b.fin - b.inicio) * ALTURA_HORA) / 60 - 2, 24),
          izquierda: (b.carril / b.carriles) * 100,
          ancho: 100 / b.carriles,
        };
      });

      return {
        fecha,
        dia: DIAS_SEMANA[numeroDia - 1],
        esHoy: mismoDia(fecha, this.hoy),
        bloques,
      };
    });
  });

  plantillaColumnas = computed(() => {
    const minimo = this.vista() === 'semana' ? `${ANCHO_COLUMNA_SEMANA}px` : '0px';
    return `${ANCHO_GUTTER}px repeat(${this.columnasVista().length}, minmax(${minimo}, 1fr))`;
  });

  anchoMinimo = computed(() =>
    this.vista() === 'semana' ? ANCHO_GUTTER + 7 * ANCHO_COLUMNA_SEMANA : null,
  );

  celdasMes = computed<CeldaMes[]>(() => {
    const referencia = this.fechaRef();
    const primero = new Date(referencia.getFullYear(), referencia.getMonth(), 1);
    const ultimo = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0);
    const inicio = inicioSemana(primero);
    const fin = sumarDias(inicioSemana(ultimo), 6);
    const total = Math.round((fin.getTime() - inicio.getTime()) / 86400000) + 1;
    const visibles = this.horariosEnRango();

    return Array.from({ length: total }, (_, i) => {
      const fecha = sumarDias(inicio, i);
      const iso = aISO(fecha);
      const numeroDia = diaSemanaDeFecha(fecha);

      const lista = visibles
        .filter((v) => v.horario.diaSemana === numeroDia && v.inicio <= iso && v.fin >= iso)
        .sort((a, b) => a.entradaMin - b.entradaMin);

      return {
        fecha,
        delMes: fecha.getMonth() === referencia.getMonth(),
        esHoy: mismoDia(fecha, this.hoy),
        total: lista.length,
        chips: lista.slice(0, 3).map((v) => ({
          id: v.horario.id,
          entrada: aHHmm(v.horario.horaEntrada),
          nombre: v.horario.empleado,
          color: this.colorDeCargo(this.cargoDe(v.horario.idEmpleado)),
        })),
        extra: Math.max(lista.length - 3, 0),
      };
    });
  });

  constructor(
    private readonly horarioService: HorarioService,
    private readonly toastService: ToastService,
  ) {
    const consulta = window.matchMedia('(max-width: 767px)');
    const aplicar = (movil: boolean): void => {
      this.esMovil.set(movil);
      if (movil && this.vista() === 'semana') {
        this.vista.set('dia');
      }
    };

    aplicar(consulta.matches);

    const escuchar = (evento: MediaQueryListEvent): void => aplicar(evento.matches);
    consulta.addEventListener('change', escuchar);
    this.destroyRef.onDestroy(() => consulta.removeEventListener('change', escuchar));
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private aVista(horario: HorarioResumen): HorarioVista {
    return {
      horario,
      inicio: aFechaISO(horario.fechaInicio),
      fin: aFechaISO(horario.fechaFin),
      entradaMin: aMinutos(horario.horaEntrada),
      salidaMin: aMinutos(horario.horaSalida),
    };
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.errorCarga.set(false);

    forkJoin({
      horarios: this.horarioService.listar(),
      medicos: this.horarioService.listarMedicosAgenda(),
    }).subscribe({
      next: ({ horarios, medicos }) => {
        this.horarios.set(horarios.object || []);
        this.medicos.set(medicos.object || []);
        this.cargando.set(false);
        this.programarScroll();
      },
      error: (error) => {
        console.error('Error al cargar la agenda de horarios:', error);
        this.toastService.error('No se pudo cargar la agenda de los médicos.');
        this.errorCarga.set(true);
        this.cargando.set(false);
      },
    });
  }

  recargarHorarios(): void {
    this.horarioService.listar().subscribe({
      next: (response) => this.horarios.set(response.object || []),
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron actualizar los horarios.');
      },
    });
  }

  cargoDe(idEmpleado: number): string {
    return this.cargoPorMedico().get(idEmpleado) ?? '';
  }

  colorDeCargo(cargo: string): string {
    const indice = this.nombresCargo().indexOf(cargo);
    return indice < 0 ? COLOR_SIN_CARGO : PALETA_CARGO[indice % PALETA_CARGO.length];
  }

  fotoUrl(foto: string | null): string | null {
    return this.horarioService.obtenerUrlFoto(foto);
  }

  iniciales(nombre: string): string {
    return iniciales(nombre);
  }

  etiquetaHora(hora: number): string {
    return `${String(hora).padStart(2, '0')}:00`;
  }

  onCargoChange(idCargo: number | null): void {
    this.filtroCargo.set(idCargo);
    this.filtroMedico.set(null);
  }

  onMedicoChange(idEmpleado: number | null): void {
    this.filtroMedico.set(idEmpleado);
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.filtroCargo.set(null);
    this.filtroMedico.set(null);
  }

  cambiarVista(vista: VistaCalendario): void {
    this.vista.set(vista);
    this.programarScroll();
  }

  mover(direccion: 1 | -1): void {
    const fecha = this.fechaRef();

    switch (this.vista()) {
      case 'mes':
        this.fechaRef.set(new Date(fecha.getFullYear(), fecha.getMonth() + direccion, 1));
        break;
      case 'semana':
        this.fechaRef.set(sumarDias(fecha, 7 * direccion));
        break;
      default:
        this.fechaRef.set(sumarDias(fecha, direccion));
    }

    this.programarScroll();
  }

  irAHoy(): void {
    this.fechaRef.set(new Date());
    this.programarScroll();
  }

  irADia(fecha: Date): void {
    this.fechaRef.set(fecha);
    this.vista.set('dia');
    this.programarScroll();
  }

  verMedico(horario: HorarioResumen): void {
    const cargo = this.cargoDe(horario.idEmpleado);

    this.empleadoVer.set({
      id: horario.idEmpleado,
      nombre: horario.empleado,
      cargo,
      foto: horario.foto,
      color: this.colorDeCargo(cargo),
    });
  }

  handleHorarioCreado(): void {
    this.modalCrear.set(false);
    this.recargarHorarios();
  }

  private programarScroll(): void {
    setTimeout(() => this.ajustarScroll());
  }

  private ajustarScroll(): void {
    const contenedor = this.grilla;

    if (!contenedor) {
      return;
    }

    const columnas = this.columnasVista();
    const linea = this.lineaAhora();
    let destino = 0;

    if (columnas.some((c) => c.esHoy) && linea !== null) {
      destino = linea - 140;
    } else {
      const tops = columnas.flatMap((c) => c.bloques.map((b) => b.top));
      destino = tops.length > 0 ? Math.min(...tops) - 24 : 0;
    }

    contenedor.scrollTop = Math.max(destino, 0);
  }
}
