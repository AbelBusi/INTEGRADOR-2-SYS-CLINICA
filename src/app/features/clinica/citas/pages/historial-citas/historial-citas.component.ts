import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../services/cita.service';
import { CitaMedicaLeer } from '../../interface/cita.interface';
import { ToastService } from '../../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

@Component({
  selector: 'app-historial-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent],
  templateUrl: './historial-citas.component.html',
})
export class HistorialCitasComponent implements OnInit {
  private citaService = inject(CitaService);
  private toast = inject(ToastService);

  citas = signal<CitaMedicaLeer[]>([]);
  cargando = signal(true);
  search = signal('');
  filtroEstado = signal<string>('');
  filtroFecha = signal<string>('');
  sortField = signal<string>('diaConsulta');
  sortAsc = signal<boolean>(false);

  columnas: TableColumn<CitaMedicaLeer>[] = [
    { header: 'Paciente', field: 'nombrePaciente', sortable: true, type: 'custom' },
    { header: 'Doctor', field: 'nombreDoctor', sortable: true, type: 'custom' },
    { header: 'Especialidad', field: 'especialidad', sortable: false, type: 'custom' },
    { header: 'Fecha', field: 'diaConsulta', sortable: true, type: 'custom' },
    { header: 'Hora', field: 'horaInicio', sortable: false, type: 'custom' },
    { header: 'Estado', field: 'estado', sortable: false, type: 'custom' },
  ];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.citaService.mias().subscribe({
      next: (res) => {
        const data = res.object;
        this.citas.set(
          Array.isArray(data) ? (data as CitaMedicaLeer[]) : data ? [data as CitaMedicaLeer] : [],
        );
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar el historial de citas.');
        this.cargando.set(false);
      },
    });
  }

  stats = computed(() => [
    { title: 'Citas registradas', value: this.citas().length, icon: 'event', bg: 'bg-teal-600' },
    { title: 'Activas', value: this.citas().filter((c) => c.estado === 1).length, icon: 'schedule', bg: 'bg-emerald-600' },
    { title: 'Atendidas', value: this.citas().filter((c) => c.estado === 2).length, icon: 'check_circle', bg: 'bg-sky-600' },
  ]);

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const estado = this.filtroEstado();
    const fecha = this.filtroFecha();
    const campo = this.sortField() as keyof CitaMedicaLeer;
    const asc = this.sortAsc();
    return this.citas()
      .filter((c) => {
        const matchSearch = `${c.nombrePaciente} ${c.apellidosPaciente} ${c.nombreDoctor}`
          .toLowerCase()
          .includes(q);
        const matchEstado = estado ? String(c.estado) === estado : true;
        const matchFecha = fecha ? c.diaConsulta === fecha : true;
        return matchSearch && matchEstado && matchFecha;
      })
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

  estadoLabel(estado: number): string {
    if (estado === 1) return 'Activa';
    if (estado === 2) return 'Atendida';
    if (estado === 0) return 'Cancelada';
    return 'Otro';
  }

  estadoClase(estado: number): string {
    if (estado === 1) return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (estado === 2) return 'bg-sky-100 text-sky-700 border border-sky-200';
    if (estado === 0) return 'bg-rose-100 text-rose-700 border border-rose-200';
    return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
}
