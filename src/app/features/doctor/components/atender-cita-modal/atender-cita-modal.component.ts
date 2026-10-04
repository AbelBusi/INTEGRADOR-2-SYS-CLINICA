import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorPortalService } from '../../services/doctor-portal.service';
import { DoctorCita, AtencionCrear } from '../../models/doctor-portal.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-atender-cita-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atender-cita-modal.component.html',
})
export class AtenderCitaModalComponent {
  private readonly doctorPortalService = inject(DoctorPortalService);
  private readonly toastService = inject(ToastService);

  cita = input.required<DoctorCita>();
  close = output<void>();
  save = output<void>();

  guardando = signal<boolean>(false);

  form: AtencionCrear = {
    diagnostico: '',
    observaciones: '',
    tratamiento: '',
    recomendaciones: '',
  };

  hora(valor: string): string {
    return (valor || '').slice(0, 5);
  }

  onSubmit(): void {
    if (this.guardando()) return;
    if (!this.form.diagnostico.trim()) {
      this.toastService.warning('El diagnóstico es obligatorio para cerrar la cita.');
      return;
    }

    this.guardando.set(true);
    this.doctorPortalService.atender(this.cita().citaId, this.form).subscribe({
      next: (res) => {
        this.guardando.set(false);
        this.toastService.success(res?.mensaje || 'Cita atendida y registrada en la historia clínica.');
        this.save.emit();
        this.close.emit();
      },
      error: (err) => {
        this.guardando.set(false);
        this.toastService.error(err.error?.mensaje || 'No se pudo cerrar la cita.');
      },
    });
  }
}
