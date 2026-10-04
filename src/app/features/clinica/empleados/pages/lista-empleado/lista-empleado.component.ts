import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Empleado } from '../../interface/empleado.interface';
import { EmpleadoService } from '../../services/empleado.service';
import { ToastService } from '../../../../../core/services/toast.service';

import { VerDetalleEmpleadoModalComponent } from '../../components/ver-detalle-empleado-modal/ver-detalle-empleado-modal.component';
import { CrearEmpleadoModalComponent } from '../../components/crear-empleado-modal/crear-empleado-modal.component';
import { EditarEmpleadoModalComponent } from '../../components/editar-empleado-modal/editar-empleado-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

type FiltroEstado = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-lista-empleado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    VerDetalleEmpleadoModalComponent,
    CrearEmpleadoModalComponent,
    EditarEmpleadoModalComponent,
  ],
  templateUrl: './lista-empleado.component.html',
})
export class ListaEmpleadoComponent implements OnInit {
  search = '';
  empleados: Empleado[] = [];
  cargando = false;
  isCrearOpen = false;
  empleadoVer: Empleado | null = null;
  empleadoEditar: Empleado | null = null;
  empleadoSeleccionado: Empleado | null = null;
  sortField = 'nombreCompleto';
  filtroEstado: FiltroEstado = 'todos';

  columns: TableColumn<Empleado>[] = [
    { header: 'Empleado', field: 'nombreCompleto', sortable: true, type: 'custom' },
    { header: 'Documento', field: 'numeroDocumento', type: 'text' },
    { header: 'Teléfono', field: 'telefono', type: 'text' },
    { header: 'Cargo', field: 'cargo', type: 'text' },
    { header: 'Ingreso', field: 'fechaIngreso', type: 'custom' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom' },
  ];

  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.cargando = true;

    const estado = this.filtroEstado === 'todos' ? undefined : this.filtroEstado;

    this.empleadoService.listar(estado).subscribe({
      next: (response) => {
        this.empleados = response.object || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar empleados desde la API:', error);
        this.toastService.error('No se pudieron cargar los empleados del servidor.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get empleadosFiltrados(): Empleado[] {
    const term = this.search.trim().toLowerCase();

    if (!term) {
      return this.empleados;
    }

    return this.empleados.filter(
      (item) =>
        item.nombreCompleto?.toLowerCase().includes(term) ||
        item.numeroDocumento?.toLowerCase().includes(term) ||
        item.telefono?.toLowerCase().includes(term) ||
        item.cargo?.toLowerCase().includes(term),
    );
  }

  get totalEmpleados(): number {
    return this.empleados.filter((e) => e.estado === 1).length;
  }

  fotoUrl(foto: string | null): string | null {
    return this.empleadoService.obtenerUrlFoto(foto);
  }

  filtrarEstado(): void {
    this.empleadoSeleccionado = null;
    this.cargarEmpleados();
  }

  handleSort(field: string): void {
    this.sortField = field;
  }

  seleccionarEmpleado(item: Empleado): void {
    this.empleadoSeleccionado = this.empleadoSeleccionado?.id === item.id ? null : item;
  }

  setEmpleadoVer(item: Empleado): void {
    this.empleadoVer = item;
  }

  setEmpleadoEditar(item: Empleado): void {
    this.empleadoEditar = item;
  }

  handleEmpleadoCreado(): void {
    this.empleadoSeleccionado = null;
    this.cargarEmpleados();
  }

  handleEmpleadoEditado(): void {
    this.empleadoSeleccionado = null;
    this.empleadoEditar = null;
    this.cargarEmpleados();
  }

  cambiarEstado(item: Empleado, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.cargando) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Empleado`,
        `¿Estás seguro de que deseas ${accion} al empleado "${item.nombreCompleto}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.empleadoService.cambiarEstado(item.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje || `Empleado ${activar ? 'activado' : 'desactivado'} con éxito`,
            );
            this.empleadoSeleccionado = null;
            this.cargarEmpleados();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(
              error.error?.mensaje || `Hubo un error al ${accion} el empleado`,
            );
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }

  eliminarEmpleado(item: Empleado): void {
    if (this.cargando) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar Empleado',
        `¿Estás seguro de que deseas eliminar al empleado "${item.nombreCompleto}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.empleadoService.eliminarPorId(item.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Empleado eliminado con éxito');

            this.empleados = this.empleados.filter((e) => e.id !== item.id);
            this.empleadoSeleccionado = null;
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(
              error.error?.mensaje || 'Hubo un error al eliminar el empleado',
            );
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }
}
