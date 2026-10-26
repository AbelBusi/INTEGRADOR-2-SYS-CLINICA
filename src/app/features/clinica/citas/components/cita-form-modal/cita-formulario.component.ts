import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CrearPacienteModalComponent } from '../../../pacientes/components/crear-paciente-modal/crear-paciente-modal.component';
import { CitaFormularioBase } from './cita-formulario.base';

@Component({
  selector: 'app-cita-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, CrearPacienteModalComponent],
  templateUrl: './cita-formulario.component.html',
  host: { class: 'flex min-h-0 flex-1 flex-col' },
})
export class CitaFormularioComponent {
  @Input({ required: true }) form!: CitaFormularioBase;
  @Input() textoGuardar = 'Guardar';

  get paso1Completo(): boolean {
    const f = this.form;
    return (
      f.paciente() !== null &&
      f.idMedico() !== null &&
      !f.mismaPersona() &&
      f.motivo().trim().length > 0
    );
  }

  get paso2Completo(): boolean {
    const f = this.form;
    return (
      f.fecha() !== '' &&
      f.horaInicio() !== '' &&
      f.horaSalida() !== '' &&
      f.errorFecha() === null &&
      f.errorHorario() === null
    );
  }

  get mensajeFaltante(): string {
    const f = this.form;
    const faltan: string[] = [];

    if (f.paciente() === null) {
      faltan.push('paciente');
    }
    if (f.idMedico() === null) {
      faltan.push('médico');
    }
    if (f.mismaPersona()) {
      faltan.push('un paciente distinto del médico');
    }
    if (f.motivo().trim().length === 0) {
      faltan.push('motivo');
    }
    if (f.fecha() === '') {
      faltan.push('día');
    } else if (f.horaInicio() === '' || f.horaSalida() === '') {
      faltan.push('horario');
    }
    if (f.errorFecha() !== null || f.errorHorario() !== null) {
      faltan.push('corregir la fecha u hora indicada');
    }

    return faltan.length > 0
      ? `Falta completar: ${faltan.join(', ')}.`
      : 'Revisa los datos ingresados.';
  }
}
