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
import { PermisosRolModalComponent } from '../../components/permisos-rol-modal/permisos-rol-modal.component';
import { TienePermisoDirective } from '../../../../../core/directives/tiene-permiso.directive';
import { PERMISOS } from '../../../../../core/constants/permisos.constants';
import { VerPermisosRolModalComponent } from '../../components/ver-permisos-rol-modal/ver-permisos-rol-modal.component';

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
    PermisosRolModalComponent,
    TienePermisoDirective,
    EditarRolModalComponent,
    VerPermisosRolModalComponent,
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
  readonly PERMISOS = PERMISOS;
  rolPermisos: Rol | null = null;
  rolVerPermisos: Rol | null = null;

  columns: TableColumn<Rol>[] = [
    { header: 'Rol', field: 'nombre', sortable: true, type: 'custom' },
    { header: 'Descripción', field: 'descripcion', type: 'text' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Permisos', field: 'permisos', type: 'custom', align: 'center' },
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

  esRolBase(id: number): boolean {
    return [1, 2, 4].includes(id);
  }

  setRolPermisos(rol: Rol): void {
    if (this.esRolBase(rol.id)) {
      this.toastService.warning('No se pueden modificar los permisos de un rol base del sistema.');
      return;
    }
    this.rolPermisos = rol;
  }

  handlePermisosGuardados(): void {
    this.rolPermisos = null;
    this.cdr.detectChanges();
  }

  setRolVerPermisos(rol: Rol): void {
    this.rolVerPermisos = rol;
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
        rol.nombre?.toLowerCase().includes(term) || rol.descripcion?.toLowerCase().includes(term),
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
    this.rolSeleccionado = this.rolSeleccionado?.id === rol.id ? null : rol;
  }

  setRolVer(rol: Rol): void {
    this.rolVer = rol;
  }

  setRolEditar(rol: Rol): void {
    if (this.esRolBase(rol.id)) {
      this.toastService.warning('No se puede editar un rol base del sistema.');
      return;
    }
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
    if (this.esRolBase(rol.id)) {
      this.toastService.warning('No se puede cambiar el estado de un rol base del sistema.');
      return;
    }

    if (this.cargando) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Rol`,
        `¿Estás seguro de que deseas ${accion} el rol "${rol.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.rolService.cambiarEstado(rol.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje || `Rol ${activar ? 'activado' : 'desactivado'} con éxito`,
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
    if (this.esRolBase(rol.id)) {
      this.toastService.warning('No se puede eliminar un rol base del sistema.');
      return;
    }

    if (this.cargando) {
      return;
    }

    this.toastService
      .confirmar('Eliminar Rol', `¿Estás seguro de que deseas eliminar el rol "${rol.nombre}"?`)
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

            this.toastService.error(error?.error?.mensaje || 'Hubo un error al eliminar el rol');

            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }
}
