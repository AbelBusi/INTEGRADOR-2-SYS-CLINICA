import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Especialidad } from '../../interface/especialidad.interface';
import { EspecialidadService } from '../../services/especialidad.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { VerDetalleEspecialidadModalComponent } from '../../components/ver-detalle-especialidad-modal/ver-detalle-especialidad-modal.component';
import { CrearEspecialidadModalComponent } from '../../components/crear-especialidad-modal/crear-especialidad-modal.component';
import { EditarEspecialidadModalComponent } from '../../components/editar-especialidad-modal/editar-especialidad-modal.component';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

type FiltroEstado = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-lista-especialidad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    VerDetalleEspecialidadModalComponent,
    CrearEspecialidadModalComponent,
    EditarEspecialidadModalComponent,
  ],
  templateUrl: './lista-especialidad.component.html',
})
export class ListaEspecialidadComponent implements OnInit {
  search = '';
  especialidades: Especialidad[] = [];
  cargando = false;
  isCrearOpen = false;
  especialidadVer: Especialidad | null = null;
  especialidadEditar: Especialidad | null = null;
  especialidadSeleccionada: Especialidad | null = null;
  sortField = 'nombre';
  filtroEstado: FiltroEstado = 'todos';

  columns: TableColumn<Especialidad>[] = [
    { header: 'Especialidad', field: 'nombre', sortable: true, type: 'custom' },
    { header: 'Descripción', field: 'descripcion', type: 'text' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom' }, // <- ahora custom
  ];

  constructor(
    private readonly especialidadService: EspecialidadService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.cargando = true;

    const estado = this.filtroEstado === 'todos' ? undefined : this.filtroEstado;

    this.especialidadService.listar(estado).subscribe({
      next: (response) => {
        this.especialidades = response.object || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar especialidades desde la API:', error);
        this.toastService.error('No se pudieron cargar las especialidades del servidor.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get especialidadesFiltradas(): Especialidad[] {
    const term = this.search.trim().toLowerCase();

    if (!term) {
      return this.especialidades;
    }

    return this.especialidades.filter(
      (especialidad) =>
        especialidad.nombre?.toLowerCase().includes(term) ||
        especialidad.descripcion?.toLowerCase().includes(term),
    );
  }

  get totalEspecialidades(): number {
    return this.especialidades.filter((e) => e.estado === 1).length;
  }

  filtrarEstado(): void {
    this.especialidadSeleccionada = null;
    this.cargarEspecialidades();
  }

  handleSort(field: string): void {
    this.sortField = field;
  }

  seleccionarEspecialidad(especialidad: Especialidad): void {
    this.especialidadSeleccionada =
      this.especialidadSeleccionada?.id === especialidad.id ? null : especialidad;
  }

  setEspecialidadVer(especialidad: Especialidad): void {
    this.especialidadVer = especialidad;
  }

  setEspecialidadEditar(especialidad: Especialidad): void {
    this.especialidadEditar = especialidad;
  }

  handleEspecialidadCreada(): void {
    this.especialidadSeleccionada = null;
    this.cargarEspecialidades();
  }

  handleEspecialidadEditada(especialidadActualizada: Especialidad): void {
    const index = this.especialidades.findIndex((e) => e.id === especialidadActualizada.id);

    if (index !== -1) {
      this.especialidades[index] = { ...especialidadActualizada };
      this.especialidades = [...this.especialidades];
    }

    this.especialidadSeleccionada = null;
    this.especialidadEditar = null;
    this.cdr.detectChanges();
  }

  cambiarEstado(especialidad: Especialidad, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.cargando) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Especialidad`,
        `¿Estás seguro de que deseas ${accion} la especialidad "${especialidad.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.especialidadService.cambiarEstado(especialidad.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje || `Especialidad ${activar ? 'activada' : 'desactivada'} con éxito`,
            );
            this.especialidadSeleccionada = null;
            this.cargarEspecialidades();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(`Hubo un error al ${accion} la especialidad`);
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }

  eliminarEspecialidad(especialidad: Especialidad): void {
    if (this.cargando) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar Especialidad',
        `¿Estás seguro de que deseas eliminar la especialidad "${especialidad.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.especialidadService.eliminarPorId(especialidad.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Especialidad eliminada con éxito');

            this.especialidades = this.especialidades.filter((e) => e.id !== especialidad.id);
            this.especialidadSeleccionada = null;
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error('Hubo un error al eliminar la especialidad');
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }
}
