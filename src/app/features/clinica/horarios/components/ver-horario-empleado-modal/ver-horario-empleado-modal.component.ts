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
import { EmpleadoAgenda } from '../../interface/horario.interface';
import {
  DIAS_SEMANA,
  aHHmm,
  aMinutos,
  formatearDuracion,
  iniciales,
} from '../../utils/calendario.util';
import { HorarioService } from '../../services/horario.service';
import { ToastService } from '../../../../../core/services/toast.service';

interface Tramo {
  entrada: string;
  salida: string;
  minutos: number;
}

interface DiaDetalle {
  corto: string;
  largo: string;
  tramos: Tramo[];
}

@Component({
  selector: 'app-ver-horario-empleado-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-horario-empleado-modal.component.html',
})
export class VerHorarioEmpleadoModalComponent implements OnChanges {
  @Input() empleado: EmpleadoAgenda | null = null;
  @Output() close = new EventEmitter<void>();

  cargando = signal(false);
  dias = signal<DiaDetalle[]>(
    DIAS_SEMANA.map((dia) => ({ corto: dia.corto, largo: dia.largo, tramos: [] })),
  );

  totalMinutos = computed(() =>
    this.dias().reduce(
      (total, dia) => total + dia.tramos.reduce((suma, tramo) => suma + tramo.minutos, 0),
      0,
    ),
  );

  diasConHorario = computed(() => this.dias().filter((dia) => dia.tramos.length > 0).length);

  constructor(
    private readonly horarioService: HorarioService,
    private readonly toastService: ToastService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleado'] && this.empleado) {
      this.cargarHorario(this.empleado.id);
    }
  }

  get fotoUrl(): string | null {
    return this.horarioService.obtenerUrlFoto(this.empleado?.foto);
  }

  get iniciales(): string {
    return iniciales(this.empleado?.nombre ?? '');
  }

  formatearDuracion(minutos: number): string {
    return formatearDuracion(minutos);
  }

  private cargarHorario(idEmpleado: number): void {
    this.cargando.set(true);

    this.horarioService.obtenerPorEmpleado(idEmpleado).subscribe({
      next: (response) => {
        const base: DiaDetalle[] = DIAS_SEMANA.map((dia) => ({
          corto: dia.corto,
          largo: dia.largo,
          tramos: [],
        }));

        for (const horario of response.object?.horarios ?? []) {
          const dia = base[horario.diaSemana - 1];
          if (dia) {
            dia.tramos.push({
              entrada: aHHmm(horario.horaEntrada),
              salida: aHHmm(horario.horaSalida),
              minutos: aMinutos(horario.horaSalida) - aMinutos(horario.horaEntrada),
            });
          }
        }

        base.forEach((dia) => dia.tramos.sort((a, b) => a.entrada.localeCompare(b.entrada)));

        this.dias.set(base);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudo cargar el horario del empleado.');
        this.cargando.set(false);
        this.onClose();
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
