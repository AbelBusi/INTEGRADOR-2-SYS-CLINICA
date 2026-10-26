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
  host: { class: 'block' },
})
export class CitaFormularioComponent {
  @Input({ required: true }) form!: CitaFormularioBase;
  @Input() textoGuardar = 'Guardar';
}
