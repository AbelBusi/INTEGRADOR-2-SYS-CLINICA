import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExamenMedico } from '../../interface/examen-medico.interface';
import { ExamenMedicoService } from '../../services/examen-medico.service';
import { ToastService } from '../../../../../core/services/toast.service';

import { CrearExamenMedicoModalComponent } from '../../components/crear-examen-medico/crear-examen-medico-modal.component';
import { VerDetalleExamenMedicoModalComponent } from '../../components/ver-detalle-examen-medico-modal/ver-detalle-examen-medico-modal.component';
import { EditarExamenMedicoModalComponent } from '../../components/editar-examen-medico/editar-examen-medico-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

type FiltroEstado = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-lista-examen-medico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    CrearExamenMedicoModalComponent,
    EditarExamenMedicoModalComponent,
    VerDetalleExamenMedicoModalComponent,
  ],
  templateUrl: './lista-examen-medico.component.html',
})
export class ListaExamenMedicoComponent implements OnInit {
  search = '';
  examenes: ExamenMedico[] = [];
  cargando = false;
  isCrearOpen = false;
  examenVer: ExamenMedico | null = null;
  examenEditar: ExamenMedico | null = null;
  sortField = 'nombre';
  filtroEstado: FiltroEstado = 'todos';

  columns: TableColumn<ExamenMedico>[] = [
    { header: 'Examen', field: 'nombre', sortable: true, type: 'custom' },
    { header: 'Tipo', field: 'tipoExamen', sortable: true, type: 'text' },
    { header: 'Descripción', field: 'descripcion', type: 'text' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom', align: 'center' },
  ];

  constructor(
    private readonly examenService: ExamenMedicoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarExamenes();
  }

  cargarExamenes(): void {
    this.cargando = true;

    const estado = this.filtroEstado === 'todos' ? undefined : this.filtroEstado;

    this.examenService.listar(estado).subscribe({
      next: (response) => {
        this.examenes = response.object || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar exámenes médicos desde la API:', error);
        this.toastService.error('No se pudieron cargar los exámenes médicos del servidor.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get examenesFiltrados(): ExamenMedico[] {
    const term = this.search.trim().toLowerCase();

    if (!term) {
      return this.examenes;
    }

    return this.examenes.filter(
      (item) =>
        item.nombre?.toLowerCase().includes(term) ||
        item.tipoExamen?.toLowerCase().includes(term) ||
        item.descripcion?.toLowerCase().includes(term),
    );
  }

  get totalExamenes(): number {
    return this.examenes.filter((e) => e.estado === 1).length;
  }

  filtrarEstado(): void {
    this.cargarExamenes();
  }

  handleSort(field: string): void {
    this.sortField = field;
  }

  setExamenVer(item: ExamenMedico): void {
    this.examenVer = item;
  }

  setExamenEditar(item: ExamenMedico): void {
    this.examenEditar = item;
  }

  handleExamenCreado(): void {
    this.cargarExamenes();
  }

  handleExamenEditado(examenActualizado: ExamenMedico): void {
    const index = this.examenes.findIndex((e) => e.id === examenActualizado.id);

    if (index !== -1) {
      this.examenes[index] = { ...examenActualizado };
      this.examenes = [...this.examenes];
    }

    this.examenEditar = null;
    this.cdr.detectChanges();
  }

  cambiarEstado(item: ExamenMedico, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.cargando) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Examen Médico`,
        `¿Estás seguro de que deseas ${accion} el examen "${item.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.examenService.cambiarEstado(item.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje ||
                `Examen médico ${activar ? 'activado' : 'desactivado'} con éxito`,
            );
            this.cargarExamenes();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(
              error?.error?.mensaje || `Hubo un error al ${accion} el examen médico`,
            );
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }
}
