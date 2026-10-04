import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { PacienteInterface, PacienteDetalleLeerDTO } from '../../interface/paciente.interface';
import { DetallePacienteModalComponent } from '../../components/detalle-paciente-modal/detalle-paciente-modal.component';
import { ToastService } from '../../../../../core/services/toast.service';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

@Component({
  selector: 'app-lista-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, DetallePacienteModalComponent, CustomTableComponent],
  templateUrl: './lista-pacientes.component.html',
})
export class ListaPacientesComponent implements OnInit {
  private readonly pacienteService = inject(PacienteService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toastService = inject(ToastService);

  search = signal<string>('');
  sortField = signal<keyof PacienteInterface>('paciente');
  sortAsc = signal<boolean>(true);

  selectedPaciente = signal<PacienteDetalleLeerDTO | null>(null);
  cargando = signal<boolean>(false);
  pacientesReal = signal<PacienteInterface[]>([]);

  columns: TableColumn<PacienteInterface>[] = [
    { header: 'Paciente', field: 'paciente', sortable: true, type: 'custom' },
    { header: 'DNI', field: 'dni', sortable: true },
    { header: 'Contacto', field: 'telefono' },
    { header: 'Seguro', field: 'entidadAseguradora', sortable: true },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'actions', type: 'actions' },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarPacientes();
    }
  }

  cargarPacientes(): void {
    this.cargando.set(true);
    this.pacienteService.listarPacientes('ACTIVO').subscribe({
      next: (pacientes) => {
        this.pacientesReal.set(pacientes);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  stats = computed(() => [
    {
      title: 'Pacientes Activos',
      value: this.pacientesReal().length,
      icon: 'check_circle',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]);

  filteredPacientes = computed(() => {
    const texto = this.search().toLowerCase().trim();
    const campo = this.sortField();
    const ascendente = this.sortAsc();

    const listaFiltrada = this.pacientesReal().filter((p) =>
      `${p.paciente} ${p.dni}`.toLowerCase().includes(texto),
    );

    return [...listaFiltrada].sort((a, b) => {
      const av = String(a[campo] ?? '').toLowerCase();
      const bv = String(b[campo] ?? '').toLowerCase();
      return ascendente ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  });

  handleSort(field: string): void {
    const validField = field as keyof PacienteInterface;
    if (this.sortField() === validField) {
      this.sortAsc.update((v) => !v);
    } else {
      this.sortField.set(validField);
      this.sortAsc.set(true);
    }
  }

  selectPaciente(paciente: PacienteInterface): void {
    this.pacienteService.traerPacientePorId(paciente.id).subscribe({
      next: (pacienteDetalle) => {
        this.selectedPaciente.set(pacienteDetalle);
      },
      error: (err) => {
        console.error('Error al obtener los detalles del paciente:', err);
      },
    });
  }

  async handleEliminar(paciente: PacienteInterface): Promise<void> {
    const seguro = await this.toastService.confirmar(
      '¿Eliminar paciente?',
      `¿Estás seguro de que deseas eliminar al paciente ${paciente.paciente}? Esta acción no se puede deshacer.`,
    );

    if (!seguro) return;

    this.pacienteService.eliminarPaciente(paciente.id).subscribe({
      next: () => {
        this.toastService.success('Paciente eliminado con éxito.');
        this.pacientesReal.update((lista) => lista.filter((p) => p.id !== paciente.id));
      },
      error: (err) => {
        console.error('Error al eliminar paciente:', err);
        this.toastService.error('No se pudo completar la eliminación del paciente.');
      },
    });
  }

  onPacienteUpdated(pacienteActualizado: PacienteDetalleLeerDTO): void {
    this.pacientesReal.update((lista) =>
      lista.map((p) =>
        p.id === pacienteActualizado.id
          ? {
              ...p,
              paciente: `${pacienteActualizado.persona.nombre} ${pacienteActualizado.persona.apellidos}`,
              dni: pacienteActualizado.persona.dni,
              entidadAseguradora: pacienteActualizado.entidadAseguradora,
              estado: pacienteActualizado.estado,
            }
          : p,
      ),
    );

    if (this.selectedPaciente()?.id === pacienteActualizado.id) {
      this.selectedPaciente.set(pacienteActualizado);
    }
  }
}
