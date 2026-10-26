import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { aISO, formatearFechaCorta, normalizar } from '../../../horarios/utils/calendario.util';
import { Cita, CitaFila, OPCIONES_ESTADO, infoEstado } from '../../interface/cita.interface';
import { normalizarCita } from '../../utils/disponibilidad.util';
import { CitaService } from '../../services/cita.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { VerDetalleCitaModalComponent } from '../../components/ver-detalle-cita-modal/ver-detalle-cita-modal.component';
import { CitaCrearModalComponent } from '../../components/cita-crear-modal/cita-crear-modal.component';
import { CitaEditarModalComponent } from '../../components/cita-editar-modal/cita-editar-modal.component';
import { RegularizarCitaModalComponent } from '../../components/regularizar-cita-modal/regularizar-cita-modal.component';
import { puedeCancelarCita, MOTIVO_NO_CANCELABLE } from '../../utils/ventana-cita.util';
import { ResolucionRegularizacion } from '../../interface/cita.interface';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { HistorialCitaModalComponent } from '../../components/historial-cita-modal/historial-cita-modal.component';

@Component({
  selector: 'app-lista-cita',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    CitaCrearModalComponent,
    CitaEditarModalComponent,
    VerDetalleCitaModalComponent,
    HistorialCitaModalComponent,
    RegularizarCitaModalComponent,
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
  citaHistorial = signal<CitaFila | null>(null);

  idsPendientes = signal<Set<number>>(new Set());
  soloPendientes = signal(false);
  citaRegularizar = signal<CitaFila | null>(null);

  totalPendientes = computed(
    () => this.citas().filter((c) => this.idsPendientes().has(c.id)).length,
  );

  readonly motivoNoCancelable = MOTIVO_NO_CANCELABLE;

  estaPendiente(cita: CitaFila): boolean {
    return this.idsPendientes().has(cita.id);
  }

  puedeCancelar(cita: CitaFila): boolean {
    return puedeCancelarCita(cita);
  }

  cerrarRegularizar(): void {
    if (!this.procesando()) {
      this.citaRegularizar.set(null);
    }
  }

  confirmarRegularizacion(datos: {
    resolucion: ResolucionRegularizacion;
    observacion: string;
  }): void {
    const cita = this.citaRegularizar();

    if (!cita || this.procesando()) {
      return;
    }

    this.procesando.set(true);

    this.citaService.regularizar(cita.id, datos.resolucion, datos.observacion).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Cita regularizada con éxito');
        this.procesando.set(false);
        this.citaRegularizar.set(null);
        this.cargar(true);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo regularizar la cita');
        this.procesando.set(false);
      },
    });
  }

  private cargarPendientes(): void {
    // En lista-cita: this.citaService.listarPendientesRegularizacion()
    // En mis-citas-medico: this.citaService.listarMisPendientesRegularizacionMedico()
    this.citaService.listarPendientesRegularizacion().subscribe({
      next: (response) => this.idsPendientes.set(new Set((response.object || []).map((c) => c.id))),
      error: (error) => console.error('No se pudieron cargar las citas pendientes:', error),
    });
  }
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
    { header: 'Acciones', field: 'id', type: 'custom', align: 'center' },
  ];

  totalHoy = computed(
    () => this.citas().filter((c) => c.estado === 1 && c.fecha === this.hoyISO).length,
  );
  totalProgramadas = computed(() => this.citas().filter((c) => c.estado === 1).length);
  totalAtendidas = computed(() => this.citas().filter((c) => c.estado === 3).length);
  totalCanceladas = computed(() => this.citas().filter((c) => c.estado === 2).length);

  hayFiltros = computed(
    () =>
      this.busqueda().trim() !== '' ||
      this.filtroEstado() !== 'todos' ||
      this.filtroFecha() !== '' ||
      this.soloPendientes(),
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
      if (this.soloPendientes() && !this.idsPendientes().has(c.id)) {
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
        this.cargarPendientes();
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
    this.soloPendientes.set(false);
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

  handleGuardado(cita: Cita): void {
    this.cerrarForm();
    this.cargar(true);
    this.citaVer.set(normalizarCita(cita));
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
