import { Component, computed, inject, OnInit, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecepcionistaService } from '../../services/recepcionista.service';
import { RecepcionistaDetalle, RecepcionistaActualizarDTO } from '../../models/recepcionista.model';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-recepcionista-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-recepcionista-modal.component.html',
})
export class EditarRecepcionistaModalComponent implements OnInit {
  private readonly recepcionistaService = inject(RecepcionistaService);
  private readonly toastService = inject(ToastService);

  recepcionista = input.required<RecepcionistaDetalle>();
  close = output<void>();
  save = output<void>();

  form = signal<RecepcionistaActualizarDTO>({
    codigoEmpleado: '',
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
  generos = ['Masculino', 'Femenino', 'Otro'];

  fechaMaxima = computed(() => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  });

  ngOnInit(): void {
    const r = this.recepcionista();
    if (r) {
      this.form.set({
        codigoEmpleado: r.codigoEmpleado || '',
        estado: 1,
        persona: {
          dni: r.persona?.dni || '',
          nombre: r.persona?.nombre || '',
          apellidos: r.persona?.apellidos || '',
          fechaNacimiento: r.persona?.fechaNacimiento || '',
          genero: r.persona?.genero || '',
          telefono: r.persona?.telefono || '',
          nacionalidad: r.persona?.nacionalidad || '',
          correo: r.persona?.correo || '',
          estado: 1,
        },
      });
    }
  }

  iniciales = computed(() => {
    const f = this.form();
    if (!f || !f.persona || !f.persona.nombre) return 'R';
    return f.persona.nombre[0].toUpperCase();
  });

  handleSubmit(): void {
    if (this.guardando()) return;

    const payload = this.form();

    if (
      !payload.codigoEmpleado ||
      !payload.persona.dni ||
      !payload.persona.nombre ||
      !payload.persona.apellidos ||
      !payload.persona.genero ||
      !payload.persona.fechaNacimiento ||
      !payload.persona.nacionalidad
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
    payload.estado = 1;
    payload.persona.estado = 1;

    this.recepcionistaService.actualizar(this.recepcionista().id, payload).subscribe({
      next: (res) => {
        this.guardando.set(false);
        this.toastService.success(
          res?.mensaje || 'Los datos del recepcionista fueron actualizados correctamente.',
        );
        this.save.emit();
        this.close.emit();
      },
      error: (err) => {
        this.guardando.set(false);
        const mensajeError =
          err.error?.mensaje || 'No se pudieron guardar los cambios del recepcionista.';
        this.toastService.error(mensajeError);
      },
    });
  }
}
