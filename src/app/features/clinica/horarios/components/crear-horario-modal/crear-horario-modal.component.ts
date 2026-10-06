import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CargoResumen, EmpleadoResumen, HorarioCrearDTO } from '../../interface/horario.interface';
import { DIAS_SEMANA, aHHmm, formatearDuracion } from '../../utils/calendario.util';
import { HorarioService } from '../../services/horario.service';
import { ToastService } from '../../../../../core/services/toast.service';

interface Tramo {
  entrada: string;
  salida: string;
}

interface DiaFormulario {
  numero: number;
  nombre: string;
  activo: boolean;
  entrada: string;
  salida: string;
  existentes: Tramo[];
}

@Component({
  selector: 'app-crear-horario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-horario-modal.component.html',
})
export class CrearHorarioModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onHorarioCreado = new EventEmitter<void>();

  cargos: CargoResumen[] = [];
  empleados: EmpleadoResumen[] = [];
  idCargo: number | null = null;
  idEmpleado: number | null = null;

  dias: DiaFormulario[] = DIAS_SEMANA.map((dia) => ({
    numero: dia.numero,
    nombre: dia.largo,
    activo: false,
    entrada: '08:00',
    salida: '14:00',
    existentes: [],
  }));

  cargandoCatalogos = false;
  cargandoEmpleados = false;
  cargandoExistentes = false;
  guardando = false;

  constructor(
    private readonly horarioService: HorarioService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargandoCatalogos = true;

    forkJoin({
      cargos: this.horarioService.listarCargosResumen(),
      empleados: this.horarioService.listarEmpleadosResumen(),
    }).subscribe({
      next: ({ cargos, empleados }) => {
        this.cargos = cargos.object || [];
        this.empleados = empleados.object || [];
        this.cargandoCatalogos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los cargos y empleados.');
        this.cargandoCatalogos = false;
        this.cdr.detectChanges();
      },
    });
  }

  get diasActivos(): DiaFormulario[] {
    return this.dias.filter((dia) => dia.activo);
  }

  get totalMinutos(): number {
    return this.diasActivos.reduce((total, dia) => {
      if (this.errorDia(dia)) {
        return total;
      }
      return total + this.aMinutos(dia.salida) - this.aMinutos(dia.entrada);
    }, 0);
  }

  get formularioValido(): boolean {
    return (
      !!this.idEmpleado &&
      !this.cargandoExistentes &&
      this.diasActivos.length > 0 &&
      this.diasActivos.every((dia) => !this.errorDia(dia))
    );
  }

  formatearDuracion(minutos: number): string {
    return formatearDuracion(minutos);
  }

  private aMinutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  errorDia(dia: DiaFormulario): string | null {
    if (!dia.activo) {
      return null;
    }

    if (!dia.entrada || !dia.salida) {
      return 'Completa la hora de entrada y de salida.';
    }

    if (dia.entrada >= dia.salida) {
      return 'La salida debe ser posterior a la entrada.';
    }

    const cruce = dia.existentes.find(
      (existente) => dia.entrada < existente.salida && dia.salida > existente.entrada,
    );

    return cruce
      ? `Se cruza con el horario ya registrado (${cruce.entrada} - ${cruce.salida}).`
      : null;
  }

  onCargoChange(): void {
    this.idEmpleado = null;
    this.limpiarExistentes();
    this.cargandoEmpleados = true;

    const idCargo = this.idCargo;
    const peticion =
      idCargo === null
        ? this.horarioService.listarEmpleadosResumen()
        : this.horarioService.listarEmpleadosPorCargo(idCargo);

    peticion.subscribe({
      next: (response) => {
        if (this.idCargo === idCargo) {
          this.empleados = response.object || [];
        }
        this.cargandoEmpleados = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los empleados del cargo.');
        this.empleados = [];
        this.cargandoEmpleados = false;
        this.cdr.detectChanges();
      },
    });
  }

  onEmpleadoChange(): void {
    this.limpiarExistentes();

    const idEmpleado = this.idEmpleado;
    if (!idEmpleado) {
      return;
    }

    this.cargandoExistentes = true;

    this.horarioService.obtenerPorEmpleado(idEmpleado).subscribe({
      next: (response) => {
        if (this.idEmpleado === idEmpleado) {
          for (const horario of response.object?.horarios ?? []) {
            const dia = this.dias.find((d) => d.numero === horario.diaSemana);
            dia?.existentes.push({
              entrada: aHHmm(horario.horaEntrada),
              salida: aHHmm(horario.horaSalida),
            });
          }
        }
        this.cargandoExistentes = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoExistentes = false;
        this.cdr.detectChanges();
      },
    });
  }

  private limpiarExistentes(): void {
    this.dias.forEach((dia) => (dia.existentes = []));
  }

  seleccionarDias(numeros: number[]): void {
    this.dias.forEach((dia) => (dia.activo = numeros.includes(dia.numero)));
  }

  igualarHoras(): void {
    const referencia = this.diasActivos[0];
    if (!referencia) {
      return;
    }
    this.diasActivos.forEach((dia) => {
      dia.entrada = referencia.entrada;
      dia.salida = referencia.salida;
    });
  }

  handleClose(): void {
    this.onClose.emit();
  }

  onSubmit(): void {
    if (this.guardando || !this.formularioValido) {
      this.toastService.warning('Revisa los datos del horario antes de guardar.');
      return;
    }

    const dto: HorarioCrearDTO = {
      idEmpleado: this.idEmpleado as number,
      horarios: this.diasActivos.map((dia) => ({
        diaSemana: dia.numero,
        horaEntrada: dia.entrada,
        horaSalida: dia.salida,
      })),
    };

    this.guardando = true;

    this.horarioService.crear(dto).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Horarios agregados con éxito');
        this.guardando = false;
        this.onHorarioCreado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudieron registrar los horarios.');
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
