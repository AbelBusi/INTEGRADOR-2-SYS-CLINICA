import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditarPacienteModalComponent } from '../editar-paciente-modal/editar-paciente-modal.component';
import { PacienteDetalleLeerDTO } from '../../interface/paciente.interface';

@Component({
  selector: 'app-detalle-paciente-modal',
  standalone: true,
  imports: [CommonModule, EditarPacienteModalComponent],
  templateUrl: './detalle-paciente-modal.component.html',
})
export class DetallePacienteModalComponent {
  paciente = input.required<PacienteDetalleLeerDTO>();
  close = output<void>();
  updatePaciente = output<PacienteDetalleLeerDTO>();

  editando = signal<boolean>(false);

  iniciales = computed(() => {
    const p = this.paciente();
    if (!p || !p.persona || !p.persona.nombre) return '';
    return p.persona.nombre[0].toUpperCase();
  });

  quickStats = computed(() => {
    const p = this.paciente();
    return [
      { label: 'DNI', value: p.persona?.dni, icon: 'badge' },
      { label: 'Género', value: p.persona?.genero, icon: 'person' },
      { label: 'Seguro', value: p.entidadAseguradora, icon: 'assignment' },
    ];
  });

  contactoInfo = computed(() => {
    const p = this.paciente();
    return [
      { icon: 'phone', value: p.persona?.telefono },
      { icon: 'mail', value: p.persona?.correo || 'Sin correo asignado' },
    ];
  });

  handleSave(updated: PacienteDetalleLeerDTO): void {
    this.updatePaciente.emit(updated);
    this.editando.set(false);
  }
}
