import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ExportModalComponent } from '../../../../../shared/components/export-modal/export-modal.component';
import { ExportDataSource } from '../../../../../shared/export/interface/export.interface';
import { crearMedicoExportConfig } from '../../export/medico-export.config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Medico } from '../../interface/medico.interface';
import { MedicoService } from '../../services/medico.service';
import { ToastService } from '../../../../../core/services/toast.service';

import { VerDetalleMedicoModalComponent } from '../../components/ver-detalle-medico-modal/ver-detalle-medico-modal.component';
import { CrearMedicoModalComponent } from '../../components/crear-medico-modal/crear-medico-modal.component';
import { EditarMedicoModalComponent } from '../../components/editar-medico-modal/editar-medico-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { TienePermisoDirective } from '../../../../../core/directives/tiene-permiso.directive';

type FiltroEstado = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-lista-medico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    VerDetalleMedicoModalComponent,
    CrearMedicoModalComponent,
    ExportModalComponent,
    EditarMedicoModalComponent,
    TienePermisoDirective,
  ],
  templateUrl: './lista-medico.component.html',
})
export class ListaMedicoComponent implements OnInit {
  search = '';
  medicos: Medico[] = [];
  cargando = false;
  isCrearOpen = false;
  medicoVer: Medico | null = null;
  medicoEditar: Medico | null = null;
  medicoSeleccionado: Medico | null = null;
  sortField = 'nombreCompleto';
  filtroEstado: FiltroEstado = 'todos';

  @ViewChild(CustomTableComponent) tabla?: CustomTableComponent<Medico>;
  isExportOpen = false;

  readonly exportConfig = crearMedicoExportConfig(() => this.filtrosExportacion());
  readonly exportDataSource: ExportDataSource<Medico> = {
    getPageRows: () => this.tabla?.paginatedData() ?? [],
    getFilteredRows: () => this.medicosFiltrados,
  };

  columns: TableColumn<Medico>[] = [
    { header: 'Médico', field: 'nombreCompleto', sortable: true, type: 'custom' },
    { header: 'Cargo', field: 'cargo', type: 'text' },
    { header: 'Especialidad', field: 'especialidad', type: 'text' },
    { header: 'Colegiatura', field: 'numeroColegiatura', type: 'text' },
    { header: 'Teléfono', field: 'telefono', type: 'custom' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom', align: 'center' },
  ];

  constructor(
    private readonly medicoService: MedicoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    this.cargando = true;

    const estado = this.filtroEstado === 'todos' ? undefined : this.filtroEstado;

    this.medicoService.listar(estado).subscribe({
      next: (response) => {
        this.medicos = response.object || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar médicos desde la API:', error);
        this.toastService.error('No se pudieron cargar los médicos del servidor.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get medicosFiltrados(): Medico[] {
    const term = this.search.trim().toLowerCase();

    if (!term) {
      return this.medicos;
    }

    return this.medicos.filter(
      (item) =>
        item.nombreCompleto?.toLowerCase().includes(term) ||
        item.cargo?.toLowerCase().includes(term) ||
        item.especialidad?.toLowerCase().includes(term) ||
        item.numeroColegiatura?.toLowerCase().includes(term) ||
        item.telefono?.toLowerCase().includes(term),
    );
  }

  get totalMedicos(): number {
    return this.medicos.filter((m) => m.estado === 1).length;
  }

  fotoUrl(foto: string | null): string | null {
    return this.medicoService.obtenerUrlFoto(foto);
  }

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

  filtrarEstado(): void {
    this.medicoSeleccionado = null;
    this.cargarMedicos();
  }

  handleSort(field: string): void {
    this.sortField = field;
  }

  seleccionarMedico(item: Medico): void {
    this.medicoSeleccionado = this.medicoSeleccionado?.id === item.id ? null : item;
  }

  setMedicoVer(item: Medico): void {
    this.medicoVer = item;
  }

  setMedicoEditar(item: Medico): void {
    this.medicoEditar = item;
  }

  handleMedicoCreado(): void {
    this.medicoSeleccionado = null;
    this.cargarMedicos();
  }

  handleMedicoEditado(): void {
    this.medicoSeleccionado = null;
    this.medicoEditar = null;
    this.cargarMedicos();
  }

  cambiarEstado(item: Medico, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.cargando) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Médico`,
        `¿Estás seguro de que deseas ${accion} al médico "${item.nombreCompleto}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.medicoService.cambiarEstado(item.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje || `Médico ${activar ? 'activado' : 'desactivado'} con éxito`,
            );
            this.medicoSeleccionado = null;
            this.cargarMedicos();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(error.error?.mensaje || `Hubo un error al ${accion} el médico`);
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }

  eliminarMedico(item: Medico): void {
    if (this.cargando) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar Médico',
        `¿Estás seguro de que deseas eliminar al médico "${item.nombreCompleto}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.medicoService.eliminarPorId(item.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Médico eliminado con éxito');

            this.medicos = this.medicos.filter((m) => m.id !== item.id);
            this.medicoSeleccionado = null;
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(error.error?.mensaje || 'Hubo un error al eliminar el médico');
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }
}
