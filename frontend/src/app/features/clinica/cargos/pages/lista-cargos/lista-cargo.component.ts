import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { cargo } from '../../interface/cargo.interface';
import { CargoService } from '../../services/cargo.service';
import { ToastService } from '../../../../../core/services/toast.service';

import { VerDetalleCargoModalComponent } from '../../components/ver-detalle-cargo-modal/ver-detalle-cargo-modal.component';
import { CrearCargoModalComponent } from '../../components/crear-cargo-modal/crear-cargo-modal.component';
import { EditarCargoModalComponent } from '../../components/editar-cargo-modal/editar-cargo-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

type FiltroEstado = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-lista-cargo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    VerDetalleCargoModalComponent,
    CrearCargoModalComponent,
    EditarCargoModalComponent,
  ],
  templateUrl: './lista-cargo.component.html',
})
export class ListaCargoComponent implements OnInit {
  search = '';
  cargos: cargo[] = [];
  cargando = false;
  isCrearOpen = false;
  cargoVer: cargo | null = null;
  cargoEditar: cargo | null = null;
  cargoSeleccionado: cargo | null = null;
  sortField = 'nombre';
  filtroEstado: FiltroEstado = 'todos';

  columns: TableColumn<cargo>[] = [
    { header: 'Cargo', field: 'nombre', sortable: true, type: 'custom' },
    { header: 'Descripción', field: 'descripcion', type: 'text' },
    { header: '¿ES PERSONAL MEDICO?', field: 'esPersonalMedico', type: 'custom' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom', align: 'center' },
  ];

  constructor(
    private readonly cargoService: CargoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {

    this.cargarCargos();
  }

  cargarCargos(): void {
    this.cargando = true;

    const estado = this.filtroEstado === 'todos' ? undefined : this.filtroEstado;

    this.cargoService.listar(estado).subscribe({
      next: (response) => {
        this.cargos = response.object || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar cargos desde la API:', error);
        this.toastService.error('No se pudieron cargar los cargos del servidor.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get cargosFiltrados(): cargo[] {
    const term = this.search.trim().toLowerCase();

    if (!term) {
      return this.cargos;
    }

    return this.cargos.filter(
      (item) =>
        item.nombre?.toLowerCase().includes(term) || item.descripcion?.toLowerCase().includes(term),
    );
  }

  get totalCargos(): number {
    return this.cargos.filter((c) => c.estado === 1).length;
  }

  filtrarEstado(): void {
    this.cargoSeleccionado = null;
    this.cargarCargos();
  }

  handleSort(field: string): void {
    this.sortField = field;
  }

  seleccionarCargo(item: cargo): void {
    this.cargoSeleccionado = this.cargoSeleccionado?.id === item.id ? null : item;
  }

  setCargoVer(item: cargo): void {
    this.cargoVer = item;
  }

  setCargoEditar(item: cargo): void {
    this.cargoEditar = item;
  }

  handleCargoCreado(): void {
    this.cargoSeleccionado = null;
    this.cargarCargos();
  }

  handleCargoEditado(cargoActualizado: cargo): void {
    const index = this.cargos.findIndex((c) => c.id === cargoActualizado.id);

    if (index !== -1) {
      this.cargos[index] = { ...cargoActualizado };
      this.cargos = [...this.cargos];
    }

    this.cargoSeleccionado = null;
    this.cargoEditar = null;
    this.cdr.detectChanges();
  }

  cambiarEstado(item: cargo, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.cargando) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Cargo`,
        `¿Estás seguro de que deseas ${accion} el cargo "${item.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.cargoService.cambiarEstado(item.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje || `Cargo ${activar ? 'activado' : 'desactivado'} con éxito`,
            );
            this.cargoSeleccionado = null;
            this.cargarCargos();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(`Hubo un error al ${accion} el cargo`);
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }

  eliminarCargo(item: cargo): void {
    if (this.cargando) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar Cargo',
        `¿Estás seguro de que deseas eliminar el cargo "${item.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.cargoService.eliminarPorId(item.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Cargo eliminado con éxito');

            this.cargos = this.cargos.filter((c) => c.id !== item.id);
            this.cargoSeleccionado = null;
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(error);

            this.toastService.error(
              error?.error?.mensaje || 'Hubo un error al eliminar la especialidad',
            );

            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }
}
