import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { VerHistoriaClinicaModalComponent } from '../../components/ver-historia-clinica-modal/ver-historia-clinica-modal.component';

/** Entrada del paciente a su propia historia clínica (solo lectura; identidad por JWT). */
@Component({
  selector: 'app-mi-historia-clinica',
  standalone: true,
  imports: [CommonModule, VerHistoriaClinicaModalComponent],
  templateUrl: './mi-historia-clinica.component.html',
})
export class MiHistoriaClinicaComponent {
  abierto = signal(false);
}
