import { Component, OnInit, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { aISO, formatearFechaCorta, normalizar } from '../../../horarios/utils/calendario.util';
import { Cita, CitaFila, OPCIONES_ESTADO, infoEstado } from '../../interface/cita.interface';
import { normalizarCita } from '../../utils/disponibilidad.util';
import { CitaService } from '../../services/cita.service';
import { CitaFiltroService } from '../../services/cita-filtro.service';
import { CitaFiltros, PaginaCitas } from '../../interface/cita-filtro.interface';
import { ToastService } from '../../../../../core/services/toast.service';
import { VerDetalleCitaModalComponent } from '../../components/ver-detalle-cita-modal/ver-detalle-cita-modal.component';
import { CitaCrearModalComponent } from '../../components/cita-crear-modal/cita-crear-modal.component';
import { CitaEditarModalComponent } from '../../components/cita-editar-modal/cita-editar-modal.component';
import { CitasFiltrosModalComponent } from '../../components/citas-filtros-modal/citas-filtros-modal.component';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { HistorialCitaModalComponent } from '../../components/historial-cita-modal/historial-cita-modal.component';
import { RegularizarCitaAdministrativoModalComponent } from '../../components/regularizar-cita-administrativo-modal/regularizar-cita-administrativo-modal.component';
import {
  MotivoRegularizacionAdministrativa,
  OPCIONES_REGULARIZACION_ADMINISTRATIVA,
} from '../../interface/cita.interface';
import { ReportesCitasComponent } from '../../components/reportes-citas/reportes-citas.component';
import { enAtencion as enAtencionCita } from '../../utils/atencion-cita.util';
import { puedeCancelarCita, motivoNoCancelableCita } from '../../utils/ventana-cita.util';
import { TienePermisoDirective } from '../../../../../core/directives/tiene-permiso.directive';

type PaginaFiltrada = Omit<PaginaCitas, 'contenido'> & { contenido: CitaFila[] };

@Component({
  selector: 'app-lista-cita',
  standalone: true,
  imports: [
    CommonModule,
    TienePermisoDirective,
    FormsModule,
    CustomTableComponent,
    CitaCrearModalComponent,
    CitaEditarModalComponent,
    VerDetalleCitaModalComponent,
    HistorialCitaModalComponent,
    RegularizarCitaAdministrativoModalComponent,
    ReportesCitasComponent,
    CitasFiltrosModalComponent,
  ],
  templateUrl: './lista-cita.component.html',
})
export class ListaCitaComponent implements OnInit, OnDestroy {
  readonly hoyISO = aISO(new Date());
  private latido: ReturnType<typeof setInterval> | null = null;

  readonly opcionesEstado = OPCIONES_ESTADO;

  citas = signal<CitaFila[]>([]);
  cargando = signal(false);
  procesando = signal(false);

  idsSinActividad = signal<Set<number>>(new Set());
  readonly motivoNoEliminable =
    'No se puede eliminar: la cita tiene atención iniciada o información clínica.';

  busqueda = signal('');
  filtroEstado = signal<number | 'todos'>('todos');
  filtroFecha = signal('');
  sortField = signal('');
  citaHistorial = signal<CitaFila | null>(null);
  reporteAbierto = signal(false);
  idsPendientes = signal<Set<number>>(new Set());
  soloPendientes = signal(false);
  citaRegularizar = signal<CitaFila | null>(null);
  menuAbierto = signal<any | null>(null);
  totalPendientes = computed(
    () => this.citas().filter((c) => this.idsPendientes().has(c.id)).length,
  );

  // ---- Filtros avanzados (servicio independiente) ----
  modalFiltrosAbierto = signal(false);
  filtrosAvanzados = signal<CitaFiltros>({});
  paginaFiltrada = signal<PaginaFiltrada | null>(null);
  cargandoFiltros = signal(false);
  readonly tamanioPagina = 10;
  private subFiltros: Subscription | null = null;

  cantidadFiltrosAvanzados = computed(() =>
    this.filtroService.contarActivos(this.filtrosAvanzados()),
  );
  modoAvanzado = computed(() => this.cantidadFiltrosAvanzados() > 0);

  modalAccionesAbierto = signal<boolean>(false);
  citaSeleccionada = signal<any | null>(null);

  abrirModalAcciones(row: any) {
    this.citaSeleccionada.set(row);
    this.modalAccionesAbierto.set(true);
  }

  enAtencion(cita: CitaFila): boolean {
    return enAtencionCita(cita);
  }

  motivoNoCancelable(cita: CitaFila): string {
    return motivoNoCancelableCita(cita);
  }

  puedeEditar(cita: CitaFila): boolean {
    return !cita.inicioAtencion && new Date() < new Date(`${cita.fecha}T${cita.inicio}`);
  }

  puedeEliminar(cita: CitaFila): boolean {
    return cita.estado !== 3 && cita.estado !== 5 && !cita.inicioAtencion;
  }

  ngOnDestroy(): void {
    this.detenerLatido();
    this.subFiltros?.unsubscribe();
  }

  private alFallar(error: any, mensaje: string): void {
    console.error(error);
    this.toastService.error(error.error?.mensaje || mensaje);
    this.procesando.set(false);

    if (error.status === 409) {
      this.citaRegularizar.set(null);
      this.cargar(true);
    }
  }

  private iniciarLatido(idCita: number): void {
    this.detenerLatido();

    this.latido = setInterval(
      () => {
        this.citaService.renovarOperacion(idCita).subscribe({
          error: (error) => {
            this.detenerLatido();
            this.citaReprogramar.set(null);
            this.toastService.error(error.error?.mensaje || 'La reserva de la cita expiró.');
            this.cargar(true);
          },
        });
      },
      5 * 60 * 1000,
    );
  }

  private detenerLatido(): void {
    if (this.latido !== null) {
      clearInterval(this.latido);
      this.latido = null;
    }
  }

  citaReprogramar = signal<{
    cita: CitaFila;
    motivo: MotivoRegularizacionAdministrativa;
    observacion: string;
  } | null>(null);

  cerrarModalAcciones() {
    this.modalAccionesAbierto.set(false);
    this.citaSeleccionada.set(null);
  }

  readonly motivoNoEditable = 'No se puede editar una cita cuyo horario ya comenzó.';

  estaPendiente(cita: CitaFila): boolean {
    return this.idsPendientes().has(cita.id);
  }

  private cargarSinActividad(): void {
    this.citaService.listarAtencionesSinActividad().subscribe({
      next: (r) => this.idsSinActividad.set(new Set((r.object || []).map((c) => c.id))),
      error: (e) => console.error('No se pudieron cargar las atenciones sin actividad:', e),
    });
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
    motivo: MotivoRegularizacionAdministrativa;
    observacion: string;
  }): void {
    const cita = this.citaRegularizar();

    if (!cita || this.procesando()) {
      return;
    }

    const opcion = OPCIONES_REGULARIZACION_ADMINISTRATIVA.find((o) => o.valor === datos.motivo);

    if (opcion?.permiteReprogramar) {
      this.procesando.set(true);

      this.citaService.iniciarRegularizacionAdministrativa(cita.id, datos.observacion).subscribe({
        next: () => {
          this.procesando.set(false);
          this.citaRegularizar.set(null);
          this.citaReprogramar.set({ cita, motivo: datos.motivo, observacion: datos.observacion });
          this.iniciarLatido(cita.id);
        },
        error: (error) => this.alFallar(error, 'No se pudo iniciar la regularización'),
      });
      return;
    }

    this.procesando.set(true);

    this.citaService.regularizarAdministrativo(cita.id, datos.motivo, datos.observacion).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Cita regularizada con éxito');
        this.procesando.set(false);
        this.citaRegularizar.set(null);
        this.cargar(true);
      },
      error: (error) => this.alFallar(error, 'No se pudo regularizar la cita'),
    });
  }

  private cargarPendientes(): void {
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
      this.soloPendientes() ||
      this.modoAvanzado(),
  );

  filas = computed(() => {
    const termino = normalizar(this.busqueda().trim());
    const estado = this.filtroEstado();
    const fecha = this.filtroFecha();

    // Con filtros avanzados la fuente es la página del servidor; sin ellos, el listado original.
    const lista = this.modoAvanzado()
      ? (this.paginaFiltrada()?.contenido ?? [])
      : this.citas().filter((c) => {
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
    private readonly filtroService: CitaFiltroService,
  ) {}

  ngOnInit(): void {
    this.cargar(false);
  }

  cerrarReprogramacion(): void {
    const reprogramacion = this.citaReprogramar();

    this.detenerLatido();
    this.citaReprogramar.set(null);

    if (reprogramacion) {
      this.citaService
        .liberarOperacion(reprogramacion.cita.id)
        .subscribe({ error: () => undefined });
    }
  }

  handleReprogramado(cita: Cita): void {
    this.detenerLatido();
    this.citaReprogramar.set(null);
    this.cargar(true);
    this.citaVer.set(normalizarCita(cita));
  }

  cargar(silencioso: boolean): void {
    if (!silencioso) {
      this.cargando.set(true);
    }

    this.citaService.listar().subscribe({
      next: (response) => {
        this.citas.set((response.object || []).map(normalizarCita));
        this.cargarPendientes();
        this.cargarSinActividad();
        this.cargando.set(false);

        // Si hay filtros avanzados activos, refresca también la página filtrada
        if (this.modoAvanzado()) {
          this.consultarFiltrados(this.paginaFiltrada()?.pagina ?? 0, true);
        }
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
    this.limpiarFiltrosAvanzados();
  }

  // ---- Filtros avanzados ----

  abrirFiltros(): void {
    this.modalFiltrosAbierto.set(true);
  }

  aplicarFiltrosAvanzados(filtros: CitaFiltros): void {
    this.filtrosAvanzados.set(filtros);
    this.modalFiltrosAbierto.set(false);

    if (this.cantidadFiltrosAvanzados() === 0) {
      this.subFiltros?.unsubscribe();
      this.paginaFiltrada.set(null);
      return;
    }

    // Al cambiar los criterios se vuelve a la primera página
    this.consultarFiltrados(0, false);
  }

  limpiarFiltrosAvanzados(): void {
    this.subFiltros?.unsubscribe();
    this.filtrosAvanzados.set({});
    this.paginaFiltrada.set(null);
    this.cargandoFiltros.set(false);
    this.modalFiltrosAbierto.set(false);
  }

  consultarFiltrados(pagina: number, silencioso: boolean): void {
    // Cancela la solicitud anterior para evitar duplicadas o respuestas tardías
    this.subFiltros?.unsubscribe();

    if (!silencioso) {
      this.cargandoFiltros.set(true);
    }

    this.subFiltros = this.filtroService
      .buscar(this.filtrosAvanzados(), pagina, this.tamanioPagina)
      .subscribe({
        next: (response) => {
          const p = response.object;
          this.paginaFiltrada.set({
            ...p,
            contenido: (p.contenido || []).map(normalizarCita),
          });
          this.cargandoFiltros.set(false);
        },
        error: (error) => {
          console.error('Error al aplicar filtros:', error);
          this.toastService.error(error.error?.mensaje || 'No se pudieron aplicar los filtros.');
          this.cargandoFiltros.set(false);
        },
      });
  }

  irAPagina(pagina: number): void {
    const p = this.paginaFiltrada();
    if (!p || pagina < 0 || pagina >= p.totalPaginas) {
      return;
    }
    this.consultarFiltrados(pagina, false);
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
          error: (error) => this.alFallar(error, 'Hubo un error al cancelar la cita'),
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
          error: (error) => this.alFallar(error, 'Hubo un error al eliminar la cita'),
        });
      });
  }
}
