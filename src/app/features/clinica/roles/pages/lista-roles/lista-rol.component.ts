import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Rol } from '../../interface/rol.interface';
import { RolService } from '../../services/rol.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { VerDetalleRolModalComponent } from '../../components/ver-detalle-rol-modal/ver-detalle-rol-modal.component';
import { CrearRolModalComponent } from '../../components/crear-rol-modal/crear-rol-modal.component';
import { EditarRolModalComponent } from '../../components/editar-rol-modal/editar-rol-modal.component';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

type FiltroEstado = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-lista-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    VerDetalleRolModalComponent,
    CrearRolModalComponent,
    EditarRolModalComponent,
  ],
  templateUrl: './lista-rol.component.html',
})
export class ListaRolComponent implements OnInit {
  search = '';
  roles: Rol[] = [];
  cargando = false;
  isCrearOpen = false;
  rolVer: Rol | null = null;
  rolEditar: Rol | null = null;
  rolSeleccionado: Rol | null = null;
  sortField = 'nombre';
  filtroEstado: FiltroEstado = 'todos';

  columns: TableColumn<Rol>[] = [
    { header: 'Rol', field: 'nombre', sortable: true, type: 'custom' },
    { header: 'Descripción', field: 'descripcion', type: 'text' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom', align: 'center' },
  ];

  constructor(
    private readonly rolService: RolService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.cargando = true;

    const estado = this.filtroEstado === 'todos' ? undefined : this.filtroEstado;

    this.rolService.listar(estado).subscribe({
      next: (response) => {
        this.roles = response.object || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar roles desde la API:', error);
        this.toastService.error('No se pudieron cargar los roles del servidor.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get rolesFiltrados(): Rol[] {
    const term = this.search.trim().toLowerCase();

    if (!term) {
      return this.roles;
    }

    return this.roles.filter(
      (rol) =>
        rol.nombre?.toLowerCase().includes(term) ||
        rol.descripcion?.toLowerCase().includes(term),
    );
  }

  get totalRoles(): number {
    return this.roles.filter((e) => e.estado === 1).length;
  }

  filtrarEstado(): void {
    this.rolSeleccionado = null;
    this.cargarRoles();
  }

  handleSort(field: string): void {
    this.sortField = field;
  }

  seleccionarRoles(rol: Rol): void {
    this.rolSeleccionado =
      this.rolSeleccionado?.id === rol.id ? null : rol;
  }

  setRolVer(rol: Rol): void {
    this.rolVer = rol;
  }

  setRolEditar(rol: Rol): void {
    this.rolEditar = rol;
  }

  handleRolCreado(): void {
    this.rolSeleccionado = null;
    this.cargarRoles();
  }

  handleRolEditado(rolActualizado: Rol): void {
    const index = this.roles.findIndex((e) => e.id === rolActualizado.id);

    if (index !== -1) {
      this.roles[index] = { ...rolActualizado };
      this.roles = [...this.roles];
    }

    this.rolSeleccionado = null;
    this.rolEditar = null;
    this.cdr.detectChanges();
  }

  cambiarEstado(rol: Rol, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.cargando) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Rol`,
        `¿Estás seguro de que deseas ${accion} la especialidad "${rol.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.rolService.cambiarEstado(rol.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje || `Rol ${activar ? 'activada' : 'desactivada'} con éxito`,
            );
            this.rolSeleccionado = null;
            this.cargarRoles();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(`Hubo un error al ${accion} el rol`);
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }

  eliminarRol(rol: Rol): void {
    if (this.cargando) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar Rol',
        `¿Estás seguro de que deseas eliminar el rol "${rol.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.rolService.eliminarPorId(rol.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Rol eliminado con éxito');

            this.roles = this.roles.filter((e) => e.id !== rol.id);
            this.rolSeleccionado = null;
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error('Hubo un error al eliminar el rol');
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }
}
