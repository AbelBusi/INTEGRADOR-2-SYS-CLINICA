import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../services/horario.service';
import {
  HorarioTrabajoLeer,
  HorarioActualizarDTO,
  DIAS_SEMANA,
} from '../../models/horario.model';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-horario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-horario-modal.component.html',
})
export class EditarHorarioModalComponent implements OnInit {
  private readonly horarioService = inject(HorarioService);
  private readonly toastService = inject(ToastService);

  horario = input.required<HorarioTrabajoLeer>();
  close = output<void>();
  save = output<void>();

  dias = DIAS_SEMANA;
  guardando = signal<boolean>(false);

  form = signal<HorarioActualizarDTO>({
    diaSemana: 1,
    horaInicio: '',
    horaFin: '',
    estado: 1,
  });

  encabezado = computed(() => {
    const h = this.horario();
    return h ? `${h.nombreCompleto} · ${h.tipo}` : '';
  });

  ngOnInit(): void {
    const h = this.horario();
    if (h) {
      this.form.set({
        diaSemana: h.diaSemana,
        horaInicio: (h.horaInicio || '').slice(0, 5),
        horaFin: (h.horaFin || '').slice(0, 5),
        estado: 1,
      });
    }
  }

  onSubmit(): void {
    if (this.guardando()) return;
    const payload = this.form();
    if (!payload.horaInicio || !payload.horaFin) {
      this.toastService.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }
    if (payload.horaInicio >= payload.horaFin) {
      this.toastService.warning('La hora de inicio debe ser menor a la hora de fin.');
      return;
    }

    this.guardando.set(true);
    payload.estado = 1;
    this.horarioService.actualizar(this.horario().id, payload).subscribe({
      next: (res) => {
        this.guardando.set(false);
        this.toastService.success(res?.mensaje || 'Horario actualizado con éxito.');
        this.save.emit();
        this.close.emit();
      },
      error: (err) => {
        this.guardando.set(false);
        this.toastService.error(err.error?.mensaje || 'No se pudieron guardar los cambios.');
      },
    });
  }
}
