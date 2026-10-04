import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecepcionistaService } from '../../services/recepcionista.service';
import { RecepcionistaLeer, RecepcionistaDetalle } from '../../models/recepcionista.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { EditarRecepcionistaModalComponent } from '../../components/editar-recepcionista-modal/editar-recepcionista-modal.component';

@Component({
  selector: 'app-lista-recepcionistas',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, EditarRecepcionistaModalComponent],
  templateUrl: './lista-recepcionistas.component.html',
})
export class ListaRecepcionistasComponent implements OnInit {
  private recepcionistaService = inject(RecepcionistaService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  recepcionistas = signal<RecepcionistaLeer[]>([]);
  cargando = signal(true);
  search = signal('');
  sortField = signal<string>('apellidos');
  sortAsc = signal<boolean>(true);

  recepcionistaEditar = signal<RecepcionistaDetalle | null>(null);

  columnas: TableColumn<RecepcionistaLeer>[] = [
    { header: 'Código', field: 'codigoEmpleado', sortable: true, type: 'custom' },
    { header: 'Recepcionista', field: 'apellidos', sortable: true, type: 'custom' },
    { header: 'Género', field: 'genero', sortable: false, type: 'custom' },
    { header: 'Estado', field: 'estado', sortable: false, type: 'custom' },
    { header: 'Acciones', field: 'acciones', sortable: false, type: 'custom' },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargar();
    }
  }

  cargar(): void {
    this.cargando.set(true);
    this.recepcionistaService.listar('ACTIVO').subscribe({
      next: (data) => {
        this.recepcionistas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  stats = computed(() => [
    {
      title: 'Recepcionistas Activos',
      value: this.recepcionistas().length,
      icon: 'support_agent',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ]);

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const campo = this.sortField() as keyof RecepcionistaLeer;
    const asc = this.sortAsc();
    return this.recepcionistas()
      .filter((r) =>
        `${r.nombre} ${r.apellidos} ${r.codigoEmpleado}`.toLowerCase().includes(q),
      )
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

  editar(row: RecepcionistaLeer): void {
    this.recepcionistaService.obtenerPorId(row.id).subscribe({
      next: (detalle) => this.recepcionistaEditar.set(detalle),
      error: () => this.toastService.error('No se pudo cargar la información del recepcionista.'),
    });
  }

  onRecepcionistaActualizado(): void {
    this.recepcionistaEditar.set(null);
    this.cargar();
  }

  desactivar(row: RecepcionistaLeer): void {
    this.toastService
      .confirmar(
        'Desactivar recepcionista',
        `¿Estás seguro de que deseas desactivar a ${row.nombre} ${row.apellidos}?`,
      )
      .then((confirmar) => {
        if (!confirmar) return;
        this.recepcionistaService.eliminar(row.id).subscribe({
          next: () => {
            this.toastService.success('Recepcionista desactivado con éxito.');
            this.recepcionistas.update((lista) => lista.filter((r) => r.id !== row.id));
          },
          error: () => this.toastService.error('No se pudo desactivar el recepcionista.'),
        });
      });
  }
}
