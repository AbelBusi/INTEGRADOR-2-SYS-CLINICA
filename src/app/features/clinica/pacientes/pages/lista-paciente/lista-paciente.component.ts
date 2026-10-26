import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Paciente } from '../../interface/paciente.interface';
import { PacienteService } from '../../services/paciente.service';
import { ToastService } from '../../../../../core/services/toast.service';

import { VerDetallePacienteModalComponent } from '../../components/ver-detalle-paciente-modal/ver-detalle-paciente-modal.component';
import { CrearPacienteModalComponent } from '../../components/crear-paciente-modal/crear-paciente-modal.component';
import { EditarPacienteModalComponent } from '../../components/editar-paciente-modal/editar-paciente-modal.component';
import { ExportModalComponent } from '../../../../../shared/components/export-modal/export-modal.component';
import { ExportDataSource } from '../../../../../shared/export/interface/export.interface';
import { crearPacienteExportConfig } from '../../export/paciente-export.config';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { TienePermisoDirective } from '../../../../../core/directives/tiene-permiso.directive';
import { PERMISOS } from '../../../../../core/constants/permisos.constants';
import { BuscarEmpleadoModalComponent } from '../../components/buscar-empleado-modal/buscar-empleado-modal.component';

type FiltroEstado = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-lista-paciente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    VerDetallePacienteModalComponent,
    CrearPacienteModalComponent,
    EditarPacienteModalComponent,
    TienePermisoDirective,
    ExportModalComponent,
    BuscarEmpleadoModalComponent,
  ],
  templateUrl: './lista-paciente.component.html',
})
export class ListaPacienteComponent implements OnInit {
  search = '';
  pacientes: Paciente[] = [];
  cargando = false;
  isCrearOpen = false;
  pacienteVer: Paciente | null = null;
  pacienteEditar: Paciente | null = null;
  pacienteSeleccionado: Paciente | null = null;
  sortField = 'paciente';
  filtroEstado: FiltroEstado = 'todos';
  isBuscarOpen = false;

  columns: TableColumn<Paciente>[] = [
    { header: 'Paciente', field: 'paciente', sortable: true, type: 'custom' },
    { header: 'Género', field: 'genero', type: 'text' },
    { header: 'Teléfono', field: 'telefono', type: 'custom' },
    { header: 'Entidad', field: 'entidadAsegurado', type: 'text' },
    { header: 'Código asegurado', field: 'codigoAsegurado', type: 'text' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom', align: 'center' },
  ];

  @ViewChild(CustomTableComponent) tabla?: CustomTableComponent<Paciente>;
  isExportOpen = false;

  readonly exportConfig = crearPacienteExportConfig(() => this.filtrosExportacion());
  readonly exportDataSource: ExportDataSource<Paciente> = {
    getPageRows: () => this.tabla?.paginatedData() ?? [],
    getFilteredRows: () => this.pacientesFiltrados,
  };

  private filtrosExportacion(): string[] {
    const estados: Record<FiltroEstado, string> = {
      todos: 'Todos',
      activo: 'Activos',
      inactivo: 'Inactivos',
    };
    const filtros = [`Estado: ${estados[this.filtroEstado]}`];
    if (this.search.trim()) {
      filtros.push('Búsqueda por texto aplicada');
    }
    return filtros;
  }

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  handleEmpleadoProcesado(): void {
    this.pacienteSeleccionado = null;
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.cargando = true;

    const estado = this.filtroEstado === 'todos' ? undefined : this.filtroEstado;

    this.pacienteService.listar(estado).subscribe({
      next: (response) => {
        this.pacientes = response.object || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar pacientes desde la API:', error);
        this.toastService.error('No se pudieron cargar los pacientes del servidor.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get pacientesFiltrados(): Paciente[] {
    const term = this.search.trim().toLowerCase();

    if (!term) {
      return this.pacientes;
    }

    return this.pacientes.filter(
      (item) =>
        item.paciente?.toLowerCase().includes(term) ||
        item.genero?.toLowerCase().includes(term) ||
        item.telefono?.toLowerCase().includes(term) ||
        item.entidadAsegurado?.toLowerCase().includes(term) ||
        item.codigoAsegurado?.toLowerCase().includes(term),
    );
  }

  get totalPacientes(): number {
    return this.pacientes.filter((p) => p.estado === 1).length;
  }

  filtrarEstado(): void {
    this.pacienteSeleccionado = null;
    this.cargarPacientes();
  }

  handleSort(field: string): void {
    this.sortField = field;
  }

  seleccionarPaciente(item: Paciente): void {
    this.pacienteSeleccionado = this.pacienteSeleccionado?.id === item.id ? null : item;
  }

  setPacienteVer(item: Paciente): void {
    this.pacienteVer = item;
  }

  setPacienteEditar(item: Paciente): void {
    this.pacienteEditar = item;
  }

  handlePacienteCreado(): void {
    this.pacienteSeleccionado = null;
    this.cargarPacientes();
  }

  handlePacienteEditado(): void {
    this.pacienteSeleccionado = null;
    this.pacienteEditar = null;
    this.cargarPacientes();
  }

  cambiarEstado(item: Paciente, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.cargando) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Paciente`,
        `¿Estás seguro de que deseas ${accion} al paciente "${item.paciente}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.pacienteService.cambiarEstado(item.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje || `Paciente ${activar ? 'activado' : 'desactivado'} con éxito`,
            );
            this.pacienteSeleccionado = null;
            this.cargarPacientes();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(
              error.error?.mensaje || `Hubo un error al ${accion} el paciente`,
            );
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }

  eliminarPaciente(item: Paciente): void {
    if (this.cargando) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar Paciente',
        `¿Estás seguro de que deseas eliminar al paciente "${item.paciente}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.pacienteService.eliminarPorId(item.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Paciente eliminado con éxito');

            this.pacientes = this.pacientes.filter((p) => p.id !== item.id);
            this.pacienteSeleccionado = null;
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(
              error.error?.mensaje || 'Hubo un error al eliminar el paciente',
            );
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }

  protected readonly PERMISOS = PERMISOS;
}
