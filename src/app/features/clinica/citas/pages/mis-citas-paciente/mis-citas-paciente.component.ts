import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { aISO, formatearFechaCorta, normalizar } from '../../../horarios/utils/calendario.util';
import { CitaFila, OPCIONES_ESTADO, infoEstado } from '../../interface/cita.interface';
import { normalizarCita } from '../../utils/disponibilidad.util';
import { CitaService } from '../../services/cita.service';
import { VerDetalleCitaModalComponent } from '../../components/ver-detalle-cita-modal/ver-detalle-cita-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { HistorialCitaModalComponent } from '../../components/historial-cita-modal/historial-cita-modal.component';

@Component({
  selector: 'app-mis-citas-paciente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    VerDetalleCitaModalComponent,
    HistorialCitaModalComponent,
  ],
  templateUrl: './mis-citas-paciente.component.html',
})
export class MisCitasPacienteComponent implements OnInit {
  readonly hoyISO = aISO(new Date());
  readonly opcionesEstado = OPCIONES_ESTADO;

  citas = signal<CitaFila[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  busqueda = signal('');
  filtroEstado = signal<number | 'todos'>('todos');
  filtroFecha = signal('');
  sortField = signal('');
  citaHistorial = signal<CitaFila | null>(null);

  citaVer = signal<CitaFila | null>(null);

  columns: TableColumn<CitaFila>[] = [
    { header: 'Médico', field: 'medico', type: 'custom' },
    { header: 'Fecha', field: 'fecha', sortable: true, type: 'custom' },
    { header: 'Horario', field: 'inicio', type: 'custom' },
    { header: 'Motivo', field: 'motivo', type: 'custom' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom' },
  ];

  totalProximas = computed(
    () => this.citas().filter((c) => c.estado === 1 && c.fecha >= this.hoyISO).length,
  );
  totalAtendidas = computed(() => this.citas().filter((c) => c.estado === 3).length);
  totalCanceladas = computed(() => this.citas().filter((c) => c.estado === 2).length);
  totalCitas = computed(() => this.citas().length);

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
      if (termino && !normalizar(`${c.medico} ${c.motivo}`).includes(termino)) {
        return false;
      }
      return true;
    });

    const clave = (c: CitaFila): string => `${c.fecha} ${c.inicio}`;
    const ascendente = [...lista].sort((a, b) => clave(a).localeCompare(clave(b)));

    return this.sortField() === 'fecha' ? ascendente : ascendente.reverse();
  });

  constructor(private readonly citaService: CitaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.citaService.listarMisCitasPaciente().subscribe({
      next: (response) => {
        this.citas.set((response.object || []).map(normalizarCita));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar mis citas (paciente):', error);
        this.error.set(
          error.status === 403
            ? error.error?.mensaje || 'Tu usuario no tiene un perfil de paciente activo.'
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

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.filtroEstado.set('todos');
    this.filtroFecha.set('');
  }

  handleSort(field: string): void {
    this.sortField.set(this.sortField() === field ? '' : field);
  }
}
