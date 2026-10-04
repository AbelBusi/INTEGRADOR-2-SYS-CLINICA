import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaMedicaLeer, CitaMedicaResumenDTO } from '../../interface/cita.interface';
import { CitaService } from '../../services/cita.service';
import { EditarCitaModalComponent} from '../../components/editar-cita-modal/editar-cita-modal.component'
import { ToastService } from '../../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { DetalleCitaModalComponent } from '../../components/detalle-cita-modal/detalle-cita-modal.component';

@Component({
  selector: 'app-lista-cita',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    DetalleCitaModalComponent,
    EditarCitaModalComponent,
  ],
  templateUrl: './lista-citas-medicas-component.html',
})
export class ListaCitaComponent implements OnInit {
  private _search = '';

  get search(): string {
    return this._search;
  }

  set search(value: string) {
    this._search = value;
  }

  sortField: keyof CitaMedicaLeer = 'nombrePaciente';
  sortAsc = true;

  citas: CitaMedicaLeer[] = [];
  cargando = false;

  citaSeleccionada = signal<CitaMedicaLeer | null>(null);

  citaAEditar = signal<CitaMedicaResumenDTO | null>(null);

  columnas: TableColumn<CitaMedicaLeer>[] = [
    { field: 'nombrePaciente', header: 'Paciente', type: 'custom', sortable: true },
    { field: 'nombreDoctor', header: 'Doctor', type: 'text', sortable: true },
    { field: 'especialidad', header: 'Especialidad', type: 'text', sortable: true },
    { field: 'diaConsulta', header: 'Día', type: 'text', sortable: true },
    { field: 'horaInicio', header: 'Hora Inicio', type: 'text', sortable: true },
    { field: 'horaSalida', header: 'Hora Salida', type: 'text', sortable: true },
  ];

  constructor(
    private readonly citaService: CitaService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.citaService.listar().subscribe({
      next: (response) => {
        if (response.object) {
          this.citas = Array.isArray(response.object) ? response.object : [response.object];
        } else {
          this.citas = [];
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar las citas del servidor.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  seleccionarCita(id: number): void {
    this.cargando = true;
    this.citaService.obtenerPorId(id).subscribe({
      next: (response) => {
        const data = response.object;
        const cita = Array.isArray(data) ? data[0] : data;

        if (cita) {
          this.citaSeleccionada.set(cita);
        } else {
          this.toastService.error('No se encontró información de la cita.');
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('Error al recuperar los detalles de la cita.');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  handleSort(field: string) {
    const keyField = field as keyof CitaMedicaLeer;
    if (this.sortField === keyField) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = keyField;
      this.sortAsc = true;
    }
  }

  get filteredCitas(): CitaMedicaLeer[] {
    return this.citas
      .filter((c) => {
        const term = this.search.toLowerCase();
        const pacienteMatch = c.nombrePaciente?.toLowerCase().includes(term) || false;
        const apellidosMatch = c.apellidosPaciente?.toLowerCase().includes(term) || false;
        const doctorMatch = c.nombreDoctor?.toLowerCase().includes(term) || false;
        return pacienteMatch || apellidosMatch || doctorMatch;
      })
      .sort((a, b) => {
        const av = String(a[this.sortField] ?? '').toLowerCase();
        const bv = String(b[this.sortField] ?? '').toLowerCase();
        return this.sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
  }

  get stats() {
    return [
      {
        title: 'Total Citas Activas',
        value: this.citas.length,
        icon: 'calendar_today',
        bg: 'bg-[#0d6b68]/10',
        color: 'text-[#0d6b68]',
      },
    ];
  }

  handleEdit(cita: CitaMedicaLeer): void {
    this.cargando = true;

    this.citaService.obtenerPorId(cita.id).subscribe({
      next: (response) => {
        const data = response.object;
        const citaCompleta = Array.isArray(data) ? data[0] : data;

        this.citaSeleccionada.set(null);
        this.citaAEditar.set(citaCompleta as CitaMedicaResumenDTO); // Abre la edición con la data completa
        this.cargando = false;
      },
      error: () => {
        this.toastService.error('No se pudo cargar la cita para edición');
        this.cargando = false;
      },
    });
  }
}

