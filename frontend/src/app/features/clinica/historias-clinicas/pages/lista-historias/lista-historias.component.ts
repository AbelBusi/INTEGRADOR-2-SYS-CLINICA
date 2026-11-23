import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { normalizar } from '../../../horarios/utils/calendario.util';
import { VerHistoriaClinicaModalComponent } from '../../components/ver-historia-clinica-modal/ver-historia-clinica-modal.component';
import { HistoriaClinicaResumen } from '../../interface/historia-clinica.interface';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { formatearFechaHora, grupoConRh } from '../../utils/historia-clinica.util';

@Component({
  selector: 'app-lista-historias',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, VerHistoriaClinicaModalComponent],
  templateUrl: './lista-historias.component.html',
})
export class ListaHistoriasComponent implements OnInit {
  historias = signal<HistoriaClinicaResumen[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);
  busqueda = signal('');
  sortField = signal('fechaActualizacion');
  historiaVer = signal<HistoriaClinicaResumen | null>(null);

  readonly columns: TableColumn<HistoriaClinicaResumen>[] = [
    { header: 'N° Historia', field: 'numeroHistoria', type: 'custom' },
    { header: 'Documento', field: 'numeroDocumento', type: 'text' },
    { header: 'Paciente', field: 'nombreCompleto', sortable: true, type: 'custom' },
    { header: 'Grupo sanguíneo', field: 'grupoSanguineo', type: 'custom' },
    { header: 'Última actualización', field: 'fechaActualizacion', sortable: true, type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom', align: 'center' },
  ];

  totalHistorias = computed(() => this.historias().length);
  totalSinGrupo = computed(
    () => this.historias().filter((h) => !h.grupoSanguineo || !h.factorRh).length,
  );

  filas = computed(() => {
    const termino = normalizar(this.busqueda().trim());

    const lista = this.historias().filter(
      (h) =>
        !termino ||
        normalizar(`${h.nombreCompleto} ${h.numeroDocumento} ${h.numeroHistoria}`).includes(
          termino,
        ),
    );

    if (this.sortField() === 'nombreCompleto') {
      return [...lista].sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
    }

    // Por defecto: más recientemente actualizadas primero.
    const clave = (h: HistoriaClinicaResumen) => h.fechaActualizacion ?? h.fechaCreacion ?? '';
    return [...lista].sort((a, b) => clave(b).localeCompare(clave(a)));
  });

  constructor(
    private readonly servicio: HistoriaClinicaService,
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

    this.servicio.listar().subscribe({
      next: (response) => {
        this.historias.set(response.object || []);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar historias clínicas:', error);
        this.error.set(
          error.status === 403
            ? error.error?.mensaje || 'No tienes autorización para consultar historias clínicas.'
            : 'No se pudieron cargar las historias clínicas. Inténtalo de nuevo.',
        );
        this.toastService.error('No se pudieron cargar las historias clínicas del servidor.');
        this.cargando.set(false);
      },
    });
  }

  handleSort(field: string): void {
    this.sortField.set(this.sortField() === field ? 'fechaActualizacion' : field);
  }

  grupo(h: HistoriaClinicaResumen): string {
    return grupoConRh(h.grupoSanguineo, h.factorRh);
  }

  fecha(h: HistoriaClinicaResumen): string {
    return formatearFechaHora(h.fechaActualizacion ?? h.fechaCreacion);
  }

  alCambiarHistoria(): void {
    this.cargar(true);
  }
}
