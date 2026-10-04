import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { DoctorLeer } from '../../models/doctor.model';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { DetalleDoctorModalComponent } from '../../components/detalle-doctor-modal/detalle-doctor-modal.component';

@Component({
  selector: 'app-lista-doctores',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, DetalleDoctorModalComponent],
  templateUrl: './lista-doctores.component.html',
})
export class ListaDoctoresComponent implements OnInit {
  private doctorService = inject(DoctorService);

  doctores = signal<DoctorLeer[]>([]);
  cargando = signal(true);
  search = signal<string>('');
  filtroEspecialidad = signal<string>('');
  sortField = signal<string>('apellidos');
  sortAsc = signal<boolean>(true);

  selectedDoctorId = signal<number | null>(null);
  isDetalleOpen = signal<boolean>(false);

  columnas: TableColumn<DoctorLeer>[] = [
    { header: 'Doctor', field: 'apellidos', sortable: true, type: 'custom' },
    { header: 'Especialidad', field: 'especialidad', sortable: true, type: 'custom' },
    { header: 'CMP', field: 'cpm', sortable: false, type: 'custom' },
    { header: 'Género', field: 'genero', sortable: false, type: 'custom' },
    { header: 'Estado', field: 'estado', sortable: false, type: 'custom' },
  ];

  ngOnInit(): void {
    this.cargarDoctores();
  }

  cargarDoctores(): void {
    this.cargando.set(true);
    // Forzamos al servicio a traer todo sin mandar el string 'activo' roto
    this.doctorService.listar(undefined).subscribe({
      next: (data) => {
        console.log('Data cruda del backend:', data); // Pon este log para ver qué campos te llegan exactamente
        this.doctores.set(data ?? []);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al traer doctores:', err);
        this.cargando.set(false);
      },
    });
  }

  especialidades = computed(() => {
    const lista = this.doctores().map((d: any) => {
      if (!d) return null;
      // Blindaje: si especialidad es un objeto, extrae el nombre, si es string, úsalo directo
      return typeof d.especialidad === 'object' ? d.especialidad?.nombre : d.especialidad;
    });
    return [...new Set(lista)].filter(Boolean).sort();
  });

  stats = computed(() => {
    const listaDoctores = this.doctores();
    return [
      { title: 'Total Doctores', value: listaDoctores.length, icon: 'groups' },
      {
        title: 'Activos',
        // Comprobación flexible: acepta el número 1 o el string '1' o el estado que mande tu DB
        value: listaDoctores.filter((d) => d.estado === 1 || (d.estado as any) === '1').length,
        icon: 'check_circle',
      },
      { title: 'Especialidades', value: this.especialidades().length, icon: 'local_hospital' },
    ];
  });

  filteredDoctores = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const esp = this.filtroEspecialidad();
    const campo = this.sortField() as keyof DoctorLeer;
    const ascendente = this.sortAsc();

    return this.doctores()
      .filter((d: any) => {
        if (!d) return false;

        // Extraer valores de forma ultra segura para evitar errores de "undefined"
        const nombre = d.nombre || d.persona?.nombre || '';
        const apellidos = d.apellidos || d.persona?.apellidos || '';
        const cpm = d.cpm || '';
        const nombreEsp =
          typeof d.especialidad === 'object' ? d.especialidad?.nombre || '' : d.especialidad || '';

        const matchSearch = `${nombre} ${apellidos} ${cpm} ${nombreEsp}`
          .toLowerCase()
          .includes(texto);

        const matchEsp = esp ? nombreEsp === esp : true;

        return matchSearch && matchEsp;
      })
      .sort((a: any, b: any) => {
        const av = String(a?.[campo] || a?.persona?.[campo] || '').toLowerCase();
        const bv = String(b?.[campo] || b?.persona?.[campo] || '').toLowerCase();
        return ascendente ? av.localeCompare(bv) : bv.localeCompare(av);
      });
  });

  handleSort(field: string): void {
    if (this.sortField() === field) {
      this.sortAsc.update((v) => !v);
    } else {
      this.sortField.set(field);
      this.sortAsc.set(true);
    }
  }

  abrirDetalle(row: DoctorLeer): void {
    if (row && row.id) {
      this.selectedDoctorId.set(row.id);
      this.isDetalleOpen.set(true);
    }
  }

  cerrarDetalle(): void {
    this.isDetalleOpen.set(false);
    this.selectedDoctorId.set(null);
  }

  handleDoctorUpdated(): void {
    this.cargarDoctores();
  }
}
