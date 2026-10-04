import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacientePortalService } from '../../services/paciente-portal.service';
import { PacienteCita } from '../../models/paciente-portal.model';
import { ToastService } from '../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../shared/components/custom-table/table-column.interface';

@Component({
  selector: 'app-paciente-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent],
  templateUrl: './mis-citas.component.html',
})
export class MisCitasPacienteComponent implements OnInit {
  private pacientePortalService = inject(PacientePortalService);
  private toastService = inject(ToastService);

  citas = signal<PacienteCita[]>([]);
  cargando = signal(true);
  tab = signal<'proximas' | 'atendidas' | 'canceladas'>('proximas');
  search = signal('');
  sortField = signal<string>('fecha');
  sortAsc = signal<boolean>(false);

  columnas: TableColumn<PacienteCita>[] = [
    { header: 'Doctor', field: 'doctor', sortable: true, type: 'custom' },
    { header: 'Especialidad', field: 'especialidad', sortable: false, type: 'custom' },
    { header: 'Fecha', field: 'fecha', sortable: true, type: 'custom' },
    { header: 'Hora', field: 'horaInicio', sortable: false, type: 'custom' },
    { header: 'Recepcionista', field: 'recepcionista', sortable: false, type: 'custom' },
    { header: 'Estado', field: 'estado', sortable: false, type: 'custom' },
  ];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.pacientePortalService.misCitas().subscribe({
      next: (data) => {
        this.citas.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.toastService.error('No se pudieron cargar tus citas.');
        this.cargando.set(false);
      },
    });
  }

  private estadoDeTab(): number {
    if (this.tab() === 'atendidas') return 2;
    if (this.tab() === 'canceladas') return 0;
    return 1;
  }

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const estado = this.estadoDeTab();
    const campo = this.sortField() as keyof PacienteCita;
    const asc = this.sortAsc();
    return this.citas()
      .filter((c) => c.estado === estado)
      .filter((c) => `${c.doctor} ${c.especialidad}`.toLowerCase().includes(q))
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
    if (estado === 1) return 'Próxima';
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
