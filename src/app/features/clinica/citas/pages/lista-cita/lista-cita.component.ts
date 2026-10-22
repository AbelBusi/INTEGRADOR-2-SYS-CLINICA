import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { aISO, formatearFechaCorta, normalizar } from '../../../horarios/utils/calendario.util';
import { CitaFila, OPCIONES_ESTADO, infoEstado } from '../../interface/cita.interface';
import { normalizarCita } from '../../utils/disponibilidad.util';
import { CitaService } from '../../services/cita.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { CitaFormModalComponent } from '../../components/cita-form-modal/cita-form-modal.component';
import { VerDetalleCitaModalComponent } from '../../components/ver-detalle-cita-modal/ver-detalle-cita-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

@Component({
  selector: 'app-lista-cita',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    CitaFormModalComponent,
    VerDetalleCitaModalComponent,
  ],
  templateUrl: './lista-cita.component.html',
})
export class ListaCitaComponent implements OnInit {
  readonly hoyISO = aISO(new Date());
  readonly opcionesEstado = OPCIONES_ESTADO;

  citas = signal<CitaFila[]>([]);
  cargando = signal(false);
  procesando = signal(false);

  busqueda = signal('');
  filtroEstado = signal<number | 'todos'>('todos');
  filtroFecha = signal('');
  sortField = signal('');

  formAbierto = signal(false);
  citaEditar = signal<CitaFila | null>(null);
  citaVer = signal<CitaFila | null>(null);

  columns: TableColumn<CitaFila>[] = [
    { header: 'Paciente', field: 'paciente', type: 'custom' },
    { header: 'Médico', field: 'medico', type: 'custom' },
    { header: 'Fecha', field: 'fecha', sortable: true, type: 'custom' },
    { header: 'Horario', field: 'inicio', type: 'custom' },
    { header: 'Motivo', field: 'motivo', type: 'custom' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom' },
  ];

  totalHoy = computed(
    () => this.citas().filter((c) => c.estado === 1 && c.fecha === this.hoyISO).length,
  );
  totalProgramadas = computed(() => this.citas().filter((c) => c.estado === 1).length);
  totalAtendidas = computed(() => this.citas().filter((c) => c.estado === 3).length);
  totalCanceladas = computed(() => this.citas().filter((c) => c.estado === 2).length);

  hayFiltros = computed(
    () =>
      this.busqueda().trim() !== '' || this.filtroEstado() !== 'todos' || this.filtroFecha() !== '',
  );

  filas = computed(() => {
    const termino = normalizar(this.busqueda().trim());
    const estado = this.filtroEstado();
    const fecha = this.filtroFecha();

    const lista = this.citas().filter((c) => {
      if (estado !== 'todos' && c.estado !== estado) {
        return false;
      }
      if (fecha && c.fecha !== fecha) {
        return false;
      }
      if (termino && !normalizar(`${c.paciente} ${c.medico} ${c.motivo}`).includes(termino)) {
        return false;
      }
      return true;
    });

    const clave = (c: CitaFila): string => `${c.fecha} ${c.inicio}`;
    const ascendente = [...lista].sort((a, b) => clave(a).localeCompare(clave(b)));

    return this.sortField() === 'fecha' ? ascendente : ascendente.reverse();
  });

  constructor(
    private readonly citaService: CitaService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargar(false);
  }

  cargar(silencioso: boolean): void {
    if (!silencioso) {
      this.cargando.set(true);
    }

    this.citaService.listar().subscribe({
      next: (response) => {
        this.citas.set((response.object || []).map(normalizarCita));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar citas desde la API:', error);
        this.toastService.error('No se pudieron cargar las citas del servidor.');
        this.cargando.set(false);
      },
    });
  }

  estadoInfo(estado: number) {
    return infoEstado(estado);
  }

  fechaCorta(iso: string): string {
    return formatearFechaCorta(iso);
  }

  puedeModificar(cita: CitaFila): boolean {
    return cita.estado === 1;
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.filtroEstado.set('todos');
    this.filtroFecha.set('');
  }

  handleSort(field: string): void {
    this.sortField.set(this.sortField() === field ? '' : field);
  }

  abrirNueva(): void {
    this.citaEditar.set(null);
    this.formAbierto.set(true);
  }

  abrirEditar(cita: CitaFila): void {
    this.citaEditar.set(cita);
    this.formAbierto.set(true);
  }

  cerrarForm(): void {
    this.formAbierto.set(false);
    this.citaEditar.set(null);
  }

  handleGuardado(): void {
    this.cerrarForm();
    this.cargar(true);
  }

  cancelar(cita: CitaFila): void {
    if (this.procesando()) {
      return;
    }

    this.toastService
      .confirmar(
        'Cancelar cita',
        `¿Cancelar la cita de "${cita.paciente}" con ${cita.medico} el ${formatearFechaCorta(cita.fecha)} a las ${cita.inicio}?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.procesando.set(true);

        this.citaService.cancelar(cita.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Cita cancelada con éxito');
            this.procesando.set(false);
            this.cargar(true);
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(error.error?.mensaje || 'Hubo un error al cancelar la cita');
            this.procesando.set(false);
          },
        });
      });
  }

  eliminar(cita: CitaFila): void {
    if (this.procesando()) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar cita',
        `¿Estás seguro de que deseas eliminar la cita de "${cita.paciente}" del ${formatearFechaCorta(cita.fecha)}?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.procesando.set(true);

        this.citaService.eliminar(cita.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Cita eliminada con éxito');
            this.procesando.set(false);
            this.cargar(true);
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(error.error?.mensaje || 'Hubo un error al eliminar la cita');
            this.procesando.set(false);
          },
        });
      });
  }
}
