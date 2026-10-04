import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../services/horario.service';
import { HorarioCrearDTO, DIAS_SEMANA, TipoTrabajador } from '../../models/horario.model';
import { CatalogoService, ResumenItem } from '../../../../../core/services/catalogo.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-crear-horario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-horario-modal.component.html',
})
export class CrearHorarioModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreado = new EventEmitter<void>();

  private readonly horarioService = inject(HorarioService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly toastService = inject(ToastService);

  dias = DIAS_SEMANA;
  doctores: ResumenItem[] = [];
  recepcionistas: ResumenItem[] = [];
  guardando = false;

  form: HorarioCrearDTO = {
    tipo: 'DOCTOR',
    referenciaId: 0,
    diaSemana: 1,
    horaInicio: '',
    horaFin: '',
    estado: 1,
  };

  ngOnInit(): void {
    this.catalogoService.doctoresResumen().subscribe({ next: (d) => (this.doctores = d) });
    this.catalogoService.recepcionistasResumen().subscribe({ next: (r) => (this.recepcionistas = r) });
  }

  get personas(): ResumenItem[] {
    return this.form.tipo === 'DOCTOR' ? this.doctores : this.recepcionistas;
  }

  onTipoChange(tipo: TipoTrabajador): void {
    this.form.tipo = tipo;
    this.form.referenciaId = 0;
  }

  handleClose(): void {
    this.resetForm();
    this.onClose.emit();
  }

  private resetForm(): void {
    this.form = {
      tipo: 'DOCTOR',
      referenciaId: 0,
      diaSemana: 1,
      horaInicio: '',
      horaFin: '',
      estado: 1,
    };
  }

  onSubmit(): void {
    if (!this.form.referenciaId || !this.form.horaInicio || !this.form.horaFin) {
      this.toastService.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }
    if (this.form.horaInicio >= this.form.horaFin) {
      this.toastService.warning('La hora de inicio debe ser menor a la hora de fin.');
      return;
    }

    this.guardando = true;
    this.horarioService.crear(this.form).subscribe({
      next: (res) => {
        this.guardando = false;
        this.toastService.success(res?.mensaje || 'Horario registrado con éxito.');
        this.onCreado.emit();
        this.handleClose();
      },
      error: (err) => {
        this.guardando = false;
        this.toastService.error(err.error?.mensaje || 'No se pudo registrar el horario.');
      },
    });
  }
}
