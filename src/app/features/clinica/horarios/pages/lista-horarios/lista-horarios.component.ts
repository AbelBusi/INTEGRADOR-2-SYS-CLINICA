import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../services/horario.service';
import { HorarioTrabajoLeer, nombreDia, DIAS_SEMANA } from '../../models/horario.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { CrearHorarioModalComponent } from '../../components/crear-horario-modal/crear-horario-modal.component';
import { EditarHorarioModalComponent } from '../../components/editar-horario-modal/editar-horario-modal.component';

@Component({
  selector: 'app-lista-horarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    CrearHorarioModalComponent,
    EditarHorarioModalComponent,
  ],
  templateUrl: './lista-horarios.component.html',
})
export class ListaHorariosComponent implements OnInit {
  private horarioService = inject(HorarioService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  horarios = signal<HorarioTrabajoLeer[]>([]);
  cargando = signal(true);
  search = signal('');
  filtroTipo = signal<string>('');
  filtroDia = signal<string>('');
  sortField = signal<string>('nombreCompleto');
  sortAsc = signal<boolean>(true);

  crearOpen = signal(false);
  horarioEditar = signal<HorarioTrabajoLeer | null>(null);

  dias = DIAS_SEMANA;
  nombreDia = nombreDia;

  columnas: TableColumn<HorarioTrabajoLeer>[] = [
    { header: 'Trabajador', field: 'nombreCompleto', sortable: true, type: 'custom' },
    { header: 'Tipo', field: 'tipo', sortable: false, type: 'custom' },
    { header: 'Día', field: 'diaSemana', sortable: true, type: 'custom' },
    { header: 'Horario', field: 'horaInicio', sortable: false, type: 'custom' },
    { header: 'Acciones', field: 'acciones', sortable: false, type: 'custom' },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargar();
    }
  }

  cargar(): void {
    this.cargando.set(true);
    this.horarioService.listar().subscribe({
      next: (data) => {
        this.horarios.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  stats = computed(() => {
    const lista = this.horarios();
    return [
      { title: 'Horarios', value: lista.length, icon: 'schedule', bg: 'bg-teal-600' },
      { title: 'Doctores', value: lista.filter((h) => h.tipo === 'DOCTOR').length, icon: 'medical_services', bg: 'bg-sky-600' },
      { title: 'Recepcionistas', value: lista.filter((h) => h.tipo === 'RECEPCIONISTA').length, icon: 'support_agent', bg: 'bg-amber-600' },
    ];
  });

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const tipo = this.filtroTipo();
    const dia = this.filtroDia();
    const campo = this.sortField() as keyof HorarioTrabajoLeer;
    const asc = this.sortAsc();
    return this.horarios()
      .filter((h) => {
        const matchSearch = h.nombreCompleto.toLowerCase().includes(q);
        const matchTipo = tipo ? h.tipo === tipo : true;
        const matchDia = dia ? h.diaSemana === Number(dia) : true;
        return matchSearch && matchTipo && matchDia;
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

  tipoClase(tipo: string): string {
    return tipo === 'DOCTOR'
      ? 'bg-sky-100 text-sky-700 border border-sky-200'
      : 'bg-amber-100 text-amber-700 border border-amber-200';
  }

  hora(valor: string): string {
    return (valor || '').slice(0, 5);
  }

  onHorarioCreado(): void {
    this.crearOpen.set(false);
    this.cargar();
  }

  editar(row: HorarioTrabajoLeer): void {
    this.horarioEditar.set(row);
  }

  onHorarioActualizado(): void {
    this.horarioEditar.set(null);
    this.cargar();
  }

  desactivar(row: HorarioTrabajoLeer): void {
    this.toastService
      .confirmar('Eliminar horario', `¿Deseas eliminar el horario de ${row.nombreCompleto} del ${nombreDia(row.diaSemana)}?`)
      .then((confirmar) => {
        if (!confirmar) return;
        this.horarioService.eliminar(row.id).subscribe({
          next: (res) => {
            this.toastService.success(res?.mensaje || 'Horario eliminado con éxito.');
            this.horarios.update((lista) => lista.filter((h) => h.id !== row.id));
          },
          error: () => this.toastService.error('No se pudo eliminar el horario.'),
        });
      });
  }
}
