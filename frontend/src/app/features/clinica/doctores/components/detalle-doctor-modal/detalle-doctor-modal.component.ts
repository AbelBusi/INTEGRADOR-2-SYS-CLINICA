import { Component, computed, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { DoctorDetalle } from '../../interface/doctor.interface';
import { EditarDoctorModalComponent } from '../editar-doctor-modal/editar-doctor-modal.component';

@Component({
  selector: 'app-detalle-doctor-modal',
  standalone: true,
  imports: [CommonModule, EditarDoctorModalComponent],
  templateUrl: './detalle-doctor-modal.component.html',
})
export class DetalleDoctorModalComponent {
  private readonly doctorService = inject(DoctorService);

  doctorId = input.required<number>();
  close = output<void>();
  updateDoctor = output<DoctorDetalle>();

  datos = signal<DoctorDetalle | null>(null);
  cargando = signal<boolean>(false);
  editando = signal<boolean>(false);

  constructor() {
    effect(() => {
      const id = this.doctorId();
      if (id) {
        this.cargarDetalleDoctor(id);
      }
    });
  }

  private cargarDetalleDoctor(id: number): void {
    this.cargando.set(true);
    this.doctorService.obtenerPorId(id).subscribe({
      next: (res) => {
        this.datos.set(res);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  iniciales = computed(() => {
    const d = this.datos();
    if (!d || !d.persona) return '';
    const nombre = d.persona.nombre || '';
    const apellidos = d.persona.apellidos || '';
    return `${nombre[0] || ''}${apellidos[0] || ''}`.toUpperCase();
  });

  quickStats = computed(() => {
    const d = this.datos();
    if (!d) return [];
    return [
      { label: 'Especialidad', value: d.especialidad?.nombre, icon: 'local_hospital' },
      { label: 'CMP', value: d.cpm, icon: 'badge' },
      { label: 'RNE', value: d.rne || 'N/A', icon: 'assignment' },
    ];
  });

  contactoInfo = computed(() => {
    const d = this.datos();
    if (!d || !d.persona) return [];
    return [
      { icon: 'mail', value: d.persona.correo },
      { icon: 'phone', value: d.persona.telefono },
    ];
  });

  handleClose(): void {
    this.close.emit();
  }

  handleSave(doctorActualizado: DoctorDetalle): void {
    this.updateDoctor.emit(doctorActualizado);
    this.editando.set(false);
  }
}
