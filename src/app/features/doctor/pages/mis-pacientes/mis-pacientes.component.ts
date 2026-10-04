import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorPortalService } from '../../services/doctor-portal.service';
import { PacienteDoctor } from '../../models/doctor-portal.model';
import { ToastService } from '../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../shared/components/custom-table/table-column.interface';
import { HistoriaClinicaModalComponent } from '../../components/historia-clinica-modal/historia-clinica-modal.component';

@Component({
  selector: 'app-mis-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, HistoriaClinicaModalComponent],
  templateUrl: './mis-pacientes.component.html',
})
export class MisPacientesComponent implements OnInit {
  private doctorPortalService = inject(DoctorPortalService);
  private toastService = inject(ToastService);

  tab = signal<'atendidos' | 'pendientes'>('atendidos');
  pacientes = signal<PacienteDoctor[]>([]);
  cargando = signal(true);
  search = signal('');
  sortField = signal<string>('apellidos');
  sortAsc = signal<boolean>(true);

  pacienteHistoria = signal<{ id: number; nombre: string } | null>(null);

  columnas: TableColumn<PacienteDoctor>[] = [
    { header: 'Paciente', field: 'apellidos', sortable: true, type: 'custom' },
    { header: 'DNI', field: 'dni', sortable: false, type: 'custom' },
    { header: 'Acciones', field: 'acciones', sortable: false, type: 'custom' },
  ];

  ngOnInit(): void {
    this.cargar();
  }

  cambiarTab(tab: 'atendidos' | 'pendientes'): void {
    this.tab.set(tab);
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    const estado = this.tab() === 'atendidos' ? 2 : 1;
    this.doctorPortalService.misPacientes(estado).subscribe({
      next: (data) => {
        this.pacientes.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.toastService.error('No se pudieron cargar los pacientes.');
        this.cargando.set(false);
      },
    });
  }

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const campo = this.sortField() as keyof PacienteDoctor;
    const asc = this.sortAsc();
    return this.pacientes()
      .filter((p) => `${p.nombre} ${p.apellidos} ${p.dni}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const av = String(a[campo] ?? '').toLowerCase();
        const bv = String(b[campo] ?? '').toLowerCase();
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
  });

  handleSort(field: string): void {
    if (this.sortField() === field) {
      this.sortAsc.update((v) => !v);
    } else {
      this.sortField.set(field);
      this.sortAsc.set(true);
    }
  }

  verHistoria(paciente: PacienteDoctor): void {
    this.pacienteHistoria.set({ id: paciente.id, nombre: `${paciente.nombre} ${paciente.apellidos}` });
  }
}
