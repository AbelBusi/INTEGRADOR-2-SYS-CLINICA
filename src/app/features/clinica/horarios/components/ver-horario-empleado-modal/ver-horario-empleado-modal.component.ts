import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadoAgenda, TramoDetalle } from '../../interface/horario.interface';
import {
  DIAS_SEMANA,
  aFechaISO,
  aHHmm,
  aISO,
  aMinutos,
  estadoVigencia,
  formatearDuracion,
  formatearFechaCorta,
  iniciales,
} from '../../utils/calendario.util';
import { HorarioService } from '../../services/horario.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { EditarHorarioModalComponent } from '../editar-horario-modal/editar-horario-modal.component';

interface DiaDetalle {
  numero: number;
  corto: string;
  largo: string;
  tramos: TramoDetalle[];
}

@Component({
  selector: 'app-ver-horario-empleado-modal',
  standalone: true,
  imports: [CommonModule, EditarHorarioModalComponent],
  templateUrl: './ver-horario-empleado-modal.component.html',
})
export class VerHorarioEmpleadoModalComponent implements OnChanges {
  @Input() empleado: EmpleadoAgenda | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() cambio = new EventEmitter<void>();

  readonly hoyISO = aISO(new Date());

  cargando = signal(false);
  eliminandoId = signal<number | null>(null);
  editando = signal<TramoDetalle | null>(null);
  dias = signal<DiaDetalle[]>(this.diasVacios());

  todosLosTramos = computed(() => this.dias().flatMap((dia) => dia.tramos));

  tramosVigentes = computed(() => this.todosLosTramos().filter((t) => t.vigencia === 'vigente'));

  totalMinutos = computed(() => this.tramosVigentes().reduce((total, t) => total + t.minutos, 0));

  diasConHorario = computed(() => new Set(this.tramosVigentes().map((t) => t.diaSemana)).size);

  constructor(
    private readonly horarioService: HorarioService,
    private readonly toastService: ToastService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleado'] && this.empleado) {
      this.cargarHorario(this.empleado.id, false);
    }
  }

  get fotoUrl(): string | null {
    return this.horarioService.obtenerUrlFoto(this.empleado?.foto);
  }

  get iniciales(): string {
    return iniciales(this.empleado?.nombre ?? '');
  }

  private diasVacios(): DiaDetalle[] {
    return DIAS_SEMANA.map((dia) => ({
      numero: dia.numero,
      corto: dia.corto,
      largo: dia.largo,
      tramos: [],
    }));
  }

  formatearDuracion(minutos: number): string {
    return formatearDuracion(minutos);
  }

  formatearFecha(iso: string): string {
    return formatearFechaCorta(iso);
  }

  otrosTramos(tramo: TramoDetalle): TramoDetalle[] {
    return this.todosLosTramos().filter((t) => t.id !== tramo.id);
  }

  private cargarHorario(idEmpleado: number, silencioso: boolean): void {
    if (!silencioso) {
      this.cargando.set(true);
    }

    this.horarioService.obtenerPorEmpleado(idEmpleado).subscribe({
      next: (response) => {
        const base = this.diasVacios();

        for (const horario of response.object?.horarios ?? []) {
          const dia = base[horario.diaSemana - 1];
          if (!dia) {
            continue;
          }

          const inicio = aFechaISO(horario.fechaInicio);
          const fin = aFechaISO(horario.fechaFin);

          dia.tramos.push({
            id: horario.idHorario,
            diaSemana: horario.diaSemana,
            entrada: aHHmm(horario.horaEntrada),
            salida: aHHmm(horario.horaSalida),
            minutos: aMinutos(horario.horaSalida) - aMinutos(horario.horaEntrada),
            inicio,
            fin,
            vigencia: estadoVigencia(inicio, fin, this.hoyISO),
          });
        }

        base.forEach((dia) =>
          dia.tramos.sort(
            (a, b) => a.entrada.localeCompare(b.entrada) || a.inicio.localeCompare(b.inicio),
          ),
        );

        this.dias.set(base);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error(error);
        this.cargando.set(false);

        if (silencioso) {
          this.toastService.error('No se pudo actualizar el horario del empleado.');
          return;
        }

        this.toastService.error('No se pudo cargar el horario del empleado.');
        this.onClose();
      },
    });
  }

  editar(tramo: TramoDetalle): void {
    this.editando.set(tramo);
  }

  handleEditado(): void {
    this.editando.set(null);
    if (this.empleado) {
      this.cargarHorario(this.empleado.id, true);
    }
    this.cambio.emit();
  }

  async eliminar(tramo: TramoDetalle): Promise<void> {
    if (this.eliminandoId() !== null) {
      return;
    }

    const dia = DIAS_SEMANA[tramo.diaSemana - 1].largo.toLowerCase();

    const confirmar = await this.toastService.confirmar(
      'Eliminar horario',
      `¿Estás seguro de que deseas eliminar el horario del ${dia} de ${tramo.entrada} a ${tramo.salida}?`,
    );

    if (!confirmar) {
      return;
    }

    this.eliminandoId.set(tramo.id);

    this.horarioService.eliminar(tramo.id).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Horario eliminado con éxito');
        this.eliminandoId.set(null);
        if (this.empleado) {
          this.cargarHorario(this.empleado.id, true);
        }
        this.cambio.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'Hubo un error al eliminar el horario');
        this.eliminandoId.set(null);
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
