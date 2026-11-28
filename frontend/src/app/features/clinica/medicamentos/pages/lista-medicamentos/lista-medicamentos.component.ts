import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Medicamento } from '../../interface/medicamento.interface';
import { MedicamentoService } from '../../services/medicamento.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { mensajeError, textoGrupo, textoIndicacion, urlImagen } from '../../utils/medicamento.util';

import { MedicamentoFormModalComponent } from '../../components/medicamento-form-modal/medicamento-form-modal.component';
import { VerDetalleMedicamentoModalComponent } from '../../components/ver-detalle-medicamento-modal/ver-detalle-medicamento-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

type FiltroEstado = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-lista-medicamentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    MedicamentoFormModalComponent,
    VerDetalleMedicamentoModalComponent,
  ],
  templateUrl: './lista-medicamentos.component.html',
})
export class ListaMedicamentosComponent implements OnInit {
  search = '';
  medicamentos: Medicamento[] = [];
  cargando = false;
  sortField = 'nombre';
  filtroEstado: FiltroEstado = 'todos';

  isCrearOpen = false;
  medicamentoEditar: Medicamento | null = null;
  medicamentoVer: Medicamento | null = null;
  medicamentoSeleccionado: Medicamento | null = null;

  readonly imagen = urlImagen;
  readonly grupo = textoGrupo;
  readonly indicacion = textoIndicacion;

  columns: TableColumn<Medicamento>[] = [
    { header: 'Medicamento', field: 'nombre', sortable: true, type: 'custom' },
    { header: 'Concentración', field: 'concentracion', type: 'text' },
    { header: 'Grupo terapéutico', field: 'grupoTerapeutico', type: 'custom' },
    { header: 'Receta', field: 'requiereReceta', type: 'custom' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom', align: 'center' },
  ];

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  cargarMedicamentos(): void {
    this.cargando = true;

    const estado = this.filtroEstado === 'todos' ? undefined : this.filtroEstado;

    this.medicamentoService.listar(estado).subscribe({
      next: (response) => {
        this.medicamentos = response.object || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar medicamentos desde la API:', error);
        this.toastService.error('No se pudieron cargar los medicamentos del servidor.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  /** Busca por nombre, principio activo, laboratorio, concentración, grupo o indicación, sin importar tildes. */
  get medicamentosFiltrados(): Medicamento[] {
    const term = this.normalizar(this.search);

    if (!term) {
      return this.medicamentos;
    }

    return this.medicamentos.filter((m) =>
      this.normalizar(
        [
          m.nombre,
          m.principioActivo,
          m.laboratorio,
          m.concentracion,
          textoGrupo(m.grupoTerapeutico),
          textoIndicacion(m.indicacionTerapeutica),
        ]
          .filter(Boolean)
          .join(' '),
      ).includes(term),
    );
  }

  get totalActivos(): number {
    return this.medicamentos.filter((m) => m.estado === 1).length;
  }

  private normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  filtrarEstado(): void {
    this.medicamentoSeleccionado = null;
    this.cargarMedicamentos();
  }

  handleSort(field: string): void {
    this.sortField = field;
  }

  seleccionarMedicamento(item: Medicamento): void {
    this.medicamentoSeleccionado = this.medicamentoSeleccionado?.id === item.id ? null : item;
  }

  setMedicamentoVer(item: Medicamento): void {
    this.medicamentoVer = item;
  }

  setMedicamentoEditar(item: Medicamento): void {
    this.medicamentoEditar = item;
  }

  handleMedicamentoCreado(): void {
    this.isCrearOpen = false;
    this.medicamentoSeleccionado = null;
    this.cargarMedicamentos();
  }

  handleMedicamentoEditado(actualizado: Medicamento): void {
    const index = this.medicamentos.findIndex((m) => m.id === actualizado.id);

    if (index !== -1) {
      this.medicamentos[index] = { ...actualizado };
      this.medicamentos = [...this.medicamentos];
    }

    this.medicamentoSeleccionado = null;
    this.medicamentoEditar = null;
    this.cdr.detectChanges();
  }

  cambiarEstado(item: Medicamento, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.cargando) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} medicamento`,
        `¿Estás seguro de que deseas ${accion} el medicamento "${item.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.medicamentoService.cambiarEstado(item.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje || `Medicamento ${activar ? 'activado' : 'desactivado'} con éxito`,
            );
            this.medicamentoSeleccionado = null;
            this.cargarMedicamentos();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(
              mensajeError(error, `Hubo un error al ${accion} el medicamento`),
            );
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }

  eliminarMedicamento(item: Medicamento): void {
    if (this.cargando) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar medicamento',
        `¿Estás seguro de que deseas eliminar el medicamento "${item.nombre}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.cargando = true;

        this.medicamentoService.eliminarPorId(item.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Medicamento eliminado con éxito');

            this.medicamentos = this.medicamentos.filter((m) => m.id !== item.id);
            this.medicamentoSeleccionado = null;
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(
              mensajeError(error, 'Hubo un error al eliminar el medicamento'),
            );
            this.cargando = false;
            this.cdr.detectChanges();
          },
        });
      });
  }
}
