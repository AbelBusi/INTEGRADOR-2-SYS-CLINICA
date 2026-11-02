/*import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PacienteDetalleLeerDTO,
  PacienteActualizarDTO,
  PacienteMensajeResponse,
} from '../../interface/paciente.interface';
import { PacienteService } from '../../services/paciente.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-paciente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-paciente-modal.component.html',
})
export class EditarPacienteModalComponent implements OnInit {
  private readonly pacienteService = inject(PacienteService);
  private readonly toastService = inject(ToastService);

  paciente = input.required<PacienteDetalleLeerDTO>();
  close = output<void>();
  save = output<PacienteDetalleLeerDTO>();

  form = signal<PacienteActualizarDTO>({
    entidadAseguradora: '',
    codigoAseguradora: '',
    estado: 1,
    persona: {
      dni: '',
      nombre: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      telefono: '',
      nacionalidad: '',
      correo: '',
      estado: 1,
    },
  });

  guardando = signal<boolean>(false);

  seguros = ['SIS', 'ESSALUD', 'RIMAC', 'PACÍFICO', 'MAPFRE', 'PARTICULAR'];
  generos = ['MASCULINO', 'FEMENINO', 'OTRO'];

  fechaMaxima = computed(() => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  });

  ngOnInit(): void {
    const p = this.paciente();
    if (p) {
      this.form.set({
        entidadAseguradora: p.entidadAseguradora || '',
        codigoAseguradora: p.codigoAseguradora || '',
        estado: 1,
        persona: {
          dni: p.persona?.dni || '',
          nombre: p.persona?.nombre || '',
          apellidos: p.persona?.apellidos || '',
          fechaNacimiento: p.persona?.fechaNacimiento || '',
          genero: p.persona?.genero || '',
          telefono: p.persona?.telefono || '',
          nacionalidad: p.persona?.nacionalidad || '',
          correo: p.persona?.correo || '',
          estado: 1,
        },
      });
    }
  }

  iniciales = computed(() => {
    const f = this.form();
    if (!f || !f.persona || !f.persona.nombre) return 'P';
    return f.persona.nombre[0].toUpperCase();
  });

  handleSubmit(): void {
    if (this.guardando()) return;

    const payload = this.form();

    if (
      !payload.entidadAseguradora ||
      !payload.codigoAseguradora ||
      !payload.persona.dni ||
      !payload.persona.nombre ||
      !payload.persona.apellidos
    ) {
      this.toastService.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (payload.persona.dni.length !== 8 || !/^\d+$/.test(payload.persona.dni)) {
      this.toastService.warning('El DNI debe contener exactamente 8 números.');
      return;
    }

    if (
      payload.persona.telefono &&
      (payload.persona.telefono.length !== 9 || !/^\d+$/.test(payload.persona.telefono))
    ) {
      this.toastService.warning('El teléfono debe contener exactamente 9 números.');
      return;
    }

    this.guardando.set(true);
    const idPaciente = this.paciente().id;

    payload.estado = 1;
    payload.persona.estado = 1;

    this.pacienteService.actualizarPaciente(idPaciente, payload).subscribe({
      next: (pacienteActualizado: PacienteDetalleLeerDTO) => {
        this.guardando.set(false);

        this.toastService.success('Los datos del paciente fueron actualizados correctamente.');

        this.save.emit(pacienteActualizado);
        this.close.emit();
      },
      error: (err) => {
        this.guardando.set(false);
        console.error('Error al actualizar el paciente:', err);

        const mensajeError = err.error?.mensaje || 'No se pudieron guardar los cambios del paciente.';
        this.toastService.error(mensajeError);
      },
    });

  }
}*/
