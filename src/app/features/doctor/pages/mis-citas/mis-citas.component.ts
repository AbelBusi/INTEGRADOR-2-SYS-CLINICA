import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorPortalService } from '../../services/doctor-portal.service';
import { DoctorCita } from '../../models/doctor-portal.model';
import { ToastService } from '../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../shared/components/custom-table/table-column.interface';
import { AtenderCitaModalComponent } from '../../components/atender-cita-modal/atender-cita-modal.component';
import { HistoriaClinicaModalComponent } from '../../components/historia-clinica-modal/historia-clinica-modal.component';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    AtenderCitaModalComponent,
    HistoriaClinicaModalComponent,
  ],
  templateUrl: './mis-citas.component.html',
})
export class MisCitasComponent implements OnInit {
  private doctorPortalService = inject(DoctorPortalService);
  private toastService = inject(ToastService);

  tab = signal<'pendientes' | 'atendidas'>('pendientes');
  citas = signal<DoctorCita[]>([]);
  cargando = signal(true);
  search = signal('');
  sortField = signal<string>('fecha');
  sortAsc = signal<boolean>(false);

  citaAtender = signal<DoctorCita | null>(null);
  pacienteHistoria = signal<{ id: number; nombre: string } | null>(null);

  columnas: TableColumn<DoctorCita>[] = [
    { header: 'Paciente', field: 'nombrePaciente', sortable: true, type: 'custom' },
    { header: 'DNI', field: 'dni', sortable: false, type: 'custom' },
    { header: 'Especialidad', field: 'especialidad', sortable: false, type: 'custom' },
    { header: 'Fecha', field: 'fecha', sortable: true, type: 'custom' },
    { header: 'Hora', field: 'horaInicio', sortable: false, type: 'custom' },
    { header: 'Estado', field: 'estado', sortable: false, type: 'custom' },
    { header: 'Acciones', field: 'acciones', sortable: false, type: 'custom' },
  ];

  ngOnInit(): void {
    this.cargar();
  }

  cambiarTab(tab: 'pendientes' | 'atendidas'): void {
    this.tab.set(tab);
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    const estado = this.tab() === 'pendientes' ? 1 : 2;
    this.doctorPortalService.misCitas(estado).subscribe({
      next: (data) => {
        this.citas.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.toastService.error('No se pudieron cargar las citas.');
        this.cargando.set(false);
      },
    });
  }

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const campo = this.sortField() as keyof DoctorCita;
    const asc = this.sortAsc();
    return this.citas()
      .filter((c) => `${c.nombrePaciente} ${c.dni}`.toLowerCase().includes(q))
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

  hora(valor: string): string {
    return (valor || '').slice(0, 5);
  }

  atender(cita: DoctorCita): void {
    this.citaAtender.set(cita);
  }

  onAtendida(): void {
    this.citaAtender.set(null);
    this.cargar();
  }

  verHistoria(cita: DoctorCita): void {
    this.pacienteHistoria.set({ id: cita.pacienteId, nombre: cita.nombrePaciente });
  }
}
