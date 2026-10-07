import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import {
  CargoResumen,
  EmpleadoAgenda,
  EmpleadoLista,
  EmpleadoResumen,
  HorarioResumen,
  VistaCalendario,
} from '../../interface/horario.interface';
import {
  ALTURA_HORA,
  COLORES_CARGO,
  COLOR_SIN_CARGO,
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
  ],
  templateUrl: './agenda-horarios.component.html',
})
export class AgendaHorariosComponent implements OnInit {
  readonly ALTURA = ALTURA_HORA;
  readonly dias = DIAS_SEMANA;
  readonly hoy = new Date();
  readonly hoyISO = aISO(this.hoy);
  readonly opcionesVista: { valor: VistaCalendario; etiqueta: string }[] = [
    { valor: 'mes', etiqueta: 'Mes' },
    { valor: 'semana', etiqueta: 'Semana' },
    { valor: 'dia', etiqueta: 'Día' },
  ];

  cargando = signal(false);
  errorCarga = signal(false);
  horarios = signal<HorarioResumen[]>([]);
  empleados = signal<EmpleadoLista[]>([]);
  cargos = signal<CargoResumen[]>([]);
  opcionesEmpleado = signal<EmpleadoResumen[]>([]);

  busqueda = signal('');
  filtroCargo = signal<number | null>(null);
  filtroEmpleado = signal<number | null>(null);

  vista = signal<VistaCalendario>('semana');
  fechaRef = signal(new Date());

  modalCrear = signal(false);
  empleadoVer = signal<EmpleadoAgenda | null>(null);

  cargoPorEmpleado = computed(() => new Map(this.empleados().map((e) => [e.id, e.cargo])));

  nombresCargo = computed(() =>
    [...new Set(this.empleados().map((e) => e.cargo))].sort((a, b) => a.localeCompare(b)),
  );

  horariosActivos = computed(() => this.horarios().filter((h) => h.estado === 1));

  personalActivo = computed(() => this.empleados().filter((e) => e.estado === 1).length);

  vigentesHoy = computed(() =>
    this.horariosActivos().filter((h) => {
      const vista = this.aVista(h);
      return vista.inicio <= this.hoyISO && vista.fin >= this.hoyISO;
    }),
  );

  empleadosConHorario = computed(() => {
    const ids = new Set(this.vigentesHoy().map((h) => h.idEmpleado));
    return this.empleados().filter((e) => e.estado === 1 && ids.has(e.id)).length;
  });

  sinHorario = computed(() => Math.max(this.personalActivo() - this.empleadosConHorario(), 0));

  cobertura = computed(() => {
    const total = this.personalActivo();
    return total ? Math.round((this.empleadosConHorario() / total) * 100) : 0;
  });

  hayFiltros = computed(
    () =>
      this.busqueda().trim() !== '' ||
      this.filtroCargo() !== null ||
      this.filtroEmpleado() !== null,
  );

  horariosFiltrados = computed(() => {
    const termino = normalizar(this.busqueda().trim());
    const idEmpleado = this.filtroEmpleado();
    const idsCargo =
      this.filtroCargo() === null
        ? null
        : new Set(this.opcionesEmpleado().map((e) => e.idEmpleado));

    return this.horariosActivos().filter((h) => {
      if (idEmpleado !== null && h.idEmpleado !== idEmpleado) {
        return false;
      }
      if (idsCargo && !idsCargo.has(h.idEmpleado)) {
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

  horaInicio = computed(() => {
    const minimo = this.horariosEnRango().reduce(
      (acumulado, v) => Math.min(acumulado, Math.floor(v.entradaMin / 60)),
      7,
    );
    return Math.max(minimo, 0);
  });

  horaFin = computed(() => {
    const maximo = this.horariosEnRango().reduce(
      (acumulado, v) => Math.max(acumulado, Math.ceil(v.salidaMin / 60)),
      19,
    );
    return Math.min(maximo, 24);
  });

  horas = computed(() =>
    Array.from({ length: this.horaFin() - this.horaInicio() }, (_, i) => this.horaInicio() + i),
  );

  alturaTotal = computed(() => this.horas().length * ALTURA_HORA);

  lineaAhora = computed(() => {
    const ahora = new Date();
    const minutos = ahora.getHours() * 60 + ahora.getMinutes();
    const desde = this.horaInicio() * 60;
    const hasta = this.horaFin() * 60;
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
    const inicioMinutos = this.horaInicio() * 60;
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
          alto: Math.max(((b.fin - b.inicio) * ALTURA_HORA) / 60 - 2, 22),
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
  ) {}

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
      empleados: this.horarioService.listarEmpleados(),
      cargos: this.horarioService.listarCargosResumen(),
      opciones: this.horarioService.listarEmpleadosResumen(),
    }).subscribe({
      next: ({ horarios, empleados, cargos, opciones }) => {
        this.horarios.set(horarios.object || []);
        this.empleados.set(empleados.object || []);
        this.cargos.set(cargos.object || []);
        this.opcionesEmpleado.set(opciones.object || []);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar la agenda de horarios:', error);
        this.toastService.error('No se pudo cargar la agenda del personal.');
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
    return this.cargoPorEmpleado().get(idEmpleado) ?? '';
  }

  colorDeCargo(cargo: string): string {
    const indice = this.nombresCargo().indexOf(cargo);
    return indice < 0 ? COLOR_SIN_CARGO : COLORES_CARGO[indice % COLORES_CARGO.length];
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
    this.filtroEmpleado.set(null);
    this.cargarOpcionesEmpleado(idCargo);
  }

  onEmpleadoChange(idEmpleado: number | null): void {
    this.filtroEmpleado.set(idEmpleado);
  }

  limpiarFiltros(): void {
    const recargarOpciones = this.filtroCargo() !== null;
    this.busqueda.set('');
    this.filtroCargo.set(null);
    this.filtroEmpleado.set(null);
    if (recargarOpciones) {
      this.cargarOpcionesEmpleado(null);
    }
  }

  private cargarOpcionesEmpleado(idCargo: number | null): void {
    this.opcionesEmpleado.set([]);

    const peticion =
      idCargo === null
        ? this.horarioService.listarEmpleadosResumen()
        : this.horarioService.listarEmpleadosPorCargo(idCargo);

    peticion.subscribe({
      next: (response) => {
        if (this.filtroCargo() === idCargo) {
          this.opcionesEmpleado.set(response.object || []);
        }
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los empleados del cargo.');
      },
    });
  }

  cambiarVista(vista: VistaCalendario): void {
    this.vista.set(vista);
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
  }

  irAHoy(): void {
    this.fechaRef.set(new Date());
  }

  irADia(fecha: Date): void {
    this.fechaRef.set(fecha);
    this.vista.set('dia');
  }

  verEmpleado(horario: HorarioResumen): void {
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
}
