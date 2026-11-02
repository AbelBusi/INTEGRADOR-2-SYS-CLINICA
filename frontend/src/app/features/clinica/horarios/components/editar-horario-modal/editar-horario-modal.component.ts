import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoAgenda, TramoDetalle } from '../../interface/horario.interface';
import { DIAS_SEMANA, formatearFechaCorta } from '../../utils/calendario.util';
import { HorarioService } from '../../services/horario.service';
import { ToastService } from '../../../../../core/services/toast.service';

interface FormularioHorario {
  diaSemana: number;
  entrada: string;
  salida: string;
  inicio: string;
  fin: string;
}

@Component({
  selector: 'app-editar-horario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-horario-modal.component.html',
})
export class EditarHorarioModalComponent implements OnInit {
  @Input() empleado: EmpleadoAgenda | null = null;
  @Input() tramo: TramoDetalle | null = null;
  @Input() otros: TramoDetalle[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onHorarioEditado = new EventEmitter<void>();

  readonly dias = DIAS_SEMANA;

  form: FormularioHorario = { diaSemana: 1, entrada: '', salida: '', inicio: '', fin: '' };
  guardando = false;

  constructor(
    private readonly horarioService: HorarioService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.tramo) {
      this.form = {
        diaSemana: this.tramo.diaSemana,
        entrada: this.tramo.entrada,
        salida: this.tramo.salida,
        inicio: this.tramo.inicio,
        fin: this.tramo.fin,
      };
    }
  }

  get errorHoras(): string | null {
    if (!this.form.entrada || !this.form.salida) {
      return 'Completa la hora de entrada y de salida.';
    }
    if (this.form.entrada >= this.form.salida) {
      return 'La salida debe ser posterior a la entrada.';
    }
    return null;
  }

  get errorVigencia(): string | null {
    if (!this.form.inicio || !this.form.fin) {
      return 'Indica la fecha de inicio y la de fin.';
    }
    if (this.form.fin < this.form.inicio) {
      return 'La fecha de fin no puede ser anterior a la de inicio.';
    }
    return null;
  }

  get errorCruce(): string | null {
    if (this.errorHoras || this.errorVigencia) {
      return null;
    }

    const cruce = this.otros.find(
      (otro) =>
        otro.diaSemana === this.form.diaSemana &&
        this.form.entrada < otro.salida &&
        this.form.salida > otro.entrada &&
        this.form.inicio <= otro.fin &&
        this.form.fin >= otro.inicio,
    );

    return cruce
      ? `Se cruza con ${cruce.entrada} - ${cruce.salida}, vigente del ${formatearFechaCorta(cruce.inicio)} al ${formatearFechaCorta(cruce.fin)}.`
      : null;
  }

  get formularioValido(): boolean {
    return !this.errorHoras && !this.errorVigencia && !this.errorCruce;
  }

  handleClose(): void {
    this.onClose.emit();
  }

  onSubmit(): void {
    if (!this.tramo || this.guardando || !this.formularioValido) {
      return;
    }

    this.guardando = true;

    this.horarioService
      .actualizar(this.tramo.id, {
        diaSemana: this.form.diaSemana,
        horaEntrada: this.form.entrada,
        horaSalida: this.form.salida,
        fechaInicio: this.form.inicio,
        fechaFin: this.form.fin,
      })
      .subscribe({
        next: (response) => {
          this.toastService.success(response?.mensaje || 'Horario actualizado con éxito');
          this.guardando = false;
          this.onHorarioEditado.emit();
        },
        error: (error) => {
          console.error(error);
          this.toastService.error(error.error?.mensaje || 'Hubo un error al actualizar el horario');
          this.guardando = false;
          this.cdr.detectChanges();
        },
      });
  }
}
