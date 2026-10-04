import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorPortalService } from '../../services/doctor-portal.service';
import { Atencion } from '../../models/doctor-portal.model';

@Component({
  selector: 'app-historia-clinica-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia-clinica-modal.component.html',
})
export class HistoriaClinicaModalComponent {
  private readonly doctorPortalService = inject(DoctorPortalService);

  pacienteId = input.required<number>();
  pacienteNombre = input<string>('');
  close = output<void>();

  atenciones = signal<Atencion[]>([]);
  cargando = signal<boolean>(false);

  constructor() {
    effect(() => {
      const id = this.pacienteId();
      if (id) {
        this.cargando.set(true);
        this.doctorPortalService.historia(id).subscribe({
          next: (data) => {
            this.atenciones.set(data);
            this.cargando.set(false);
          },
          error: () => this.cargando.set(false),
        });
      }
    });
  }

  hora(valor: string): string {
    return (valor || '').slice(0, 5);
  }
}
