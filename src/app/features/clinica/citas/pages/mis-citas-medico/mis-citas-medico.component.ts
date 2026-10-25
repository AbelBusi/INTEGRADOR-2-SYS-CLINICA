import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { aISO, formatearFechaCorta, normalizar } from '../../../horarios/utils/calendario.util';
import { CitaFila, OPCIONES_ESTADO, infoEstado } from '../../interface/cita.interface';
import { normalizarCita } from '../../utils/disponibilidad.util';
import { CitaService } from '../../services/cita.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { VerDetalleCitaModalComponent } from '../../components/ver-detalle-cita-modal/ver-detalle-cita-modal.component';
import { HistorialCitaModalComponent } from '../../components/historial-cita-modal/historial-cita-modal.component';
import { ObservacionCitaModalComponent } from '../../components/observacion-cita-modal/observacion-cita-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

type TipoAccion = 'atender' | 'cancelar';

@Component({
  selector: 'app-mis-citas-medico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    VerDetalleCitaModalComponent,
    HistorialCitaModalComponent,
    ObservacionCitaModalComponent,
  ],
  templateUrl: './mis-citas-medico.component.html',
})
export class MisCitasMedicoComponent implements OnInit {
  readonly hoyISO = aISO(new Date());
  readonly opcionesEstado = OPCIONES_ESTADO;

  citas = signal<CitaFila[]>([]);
  cargando = signal(false);
  procesando = signal(false);
  error = signal<string | null>(null);

  busqueda = signal('');
  filtroEstado = signal<number | 'todos'>('todos');
  filtroFecha = signal('');
  sortField = signal('');

  citaVer = signal<CitaFila | null>(null);
  citaHistorial = signal<CitaFila | null>(null);
  citaAccion = signal<{ cita: CitaFila; tipo: TipoAccion } | null>(null);

  columns: TableColumn<CitaFila>[] = [
    { header: 'Paciente', field: 'paciente', type: 'custom' },
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
      if (termino && !normalizar(`${c.paciente} ${c.motivo}`).includes(termino)) {
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
    this.error.set(null);

    this.citaService.listarMisCitasMedico().subscribe({
      next: (response) => {
        this.citas.set((response.object || []).map(normalizarCita));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar mis citas (médico):', error);
        this.error.set(
          error.status === 403
            ? error.error?.mensaje || 'Tu usuario no tiene un perfil de médico activo.'
            : 'No se pudieron cargar tus citas. Inténtalo de nuevo.',
        );
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

  puedeGestionar(cita: CitaFila): boolean {
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

  abrirAccion(cita: CitaFila, tipo: TipoAccion): void {
    this.citaAccion.set({ cita, tipo });
  }

  cerrarAccion(): void {
    if (!this.procesando()) {
      this.citaAccion.set(null);
    }
  }

  confirmarAccion(observacion: string): void {
    const accion = this.citaAccion();
    if (!accion || this.procesando()) {
      return;
    }

    this.procesando.set(true);

    const peticion =
      accion.tipo === 'atender'
        ? this.citaService.atender(accion.cita.id, observacion)
        : this.citaService.cancelar(accion.cita.id, observacion);

    peticion.subscribe({
      next: (response) => {
        this.toastService.success(
          response?.mensaje ||
            (accion.tipo === 'atender'
              ? 'Atención registrada con éxito'
              : 'Cita cancelada con éxito'),
        );
        this.procesando.set(false);
        this.citaAccion.set(null);
        this.cargar(true);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(
          error.error?.mensaje ||
            (accion.tipo === 'atender'
              ? 'Hubo un error al registrar la atención'
              : 'Hubo un error al cancelar la cita'),
        );
        this.procesando.set(false);
      },
    });
  }
}
