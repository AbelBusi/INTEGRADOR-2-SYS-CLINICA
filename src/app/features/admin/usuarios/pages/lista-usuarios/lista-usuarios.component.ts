import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioLeer } from '../../models/usuario.model';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { ToastService } from '../../../../../core/services/toast.service';
import { DetalleUsuarioModalComponent } from '../../components/detalle-usuario-modal/detalle-usuario-modal.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, DetalleUsuarioModalComponent],
  templateUrl: './lista-usuarios.component.html',
})
export class ListaUsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);

  usuarios = signal<UsuarioLeer[]>([]);
  cargando = signal(true);
  search = signal('');
  filtroTipo = signal<string>('');
  sortField = signal<string>('usuario');
  sortAsc = signal<boolean>(true);

  selectedUsuarioId = signal<number | null>(null);
  isDetalleOpen = signal<boolean>(false);

  columnas: TableColumn<UsuarioLeer>[] = [
    { header: 'Usuario', field: 'usuario', sortable: true, type: 'custom' },
    { header: 'Nombre', field: 'nombre', sortable: true, type: 'custom' },
    { header: 'Correo', field: 'correo', sortable: false, type: 'custom' },
    { header: 'Rol', field: 'nombreRol', sortable: false, type: 'custom' },
    { header: 'Tipo', field: 'tipo', sortable: false, type: 'custom' },
    { header: 'Estado', field: 'estado', sortable: false, type: 'custom' },
    { header: 'Acciones', field: 'acciones', sortable: false, type: 'actions' },
  ];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.usuarioService.listar('ACTIVO').subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  tipos = computed(() => {
    return [...new Set(this.usuarios().map((u) => u.tipo))].filter(Boolean).sort();
  });

  stats = computed(() => {
    const lista = this.usuarios();
    return [
      { title: 'Usuarios Activos', value: lista.length, icon: 'manage_accounts', bg: 'bg-teal-600' },
      { title: 'Doctores', value: lista.filter((u) => u.tipo === 'DOCTOR').length, icon: 'medical_services', bg: 'bg-sky-600' },
      { title: 'Pacientes', value: lista.filter((u) => u.tipo === 'PACIENTE').length, icon: 'groups', bg: 'bg-emerald-600' },
      { title: 'Recepcionistas', value: lista.filter((u) => u.tipo === 'RECEPCIONISTA').length, icon: 'support_agent', bg: 'bg-amber-600' },
    ];
  });

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const tipo = this.filtroTipo();
    const campo = this.sortField() as keyof UsuarioLeer;
    const asc = this.sortAsc();
    return this.usuarios()
      .filter((u) => {
        const matchSearch = `${u.usuario} ${u.nombre} ${u.correo} ${u.nombreRol}`
          .toLowerCase()
          .includes(q);
        const matchTipo = tipo ? u.tipo === tipo : true;
        return matchSearch && matchTipo;
      })
      .sort((a, b) => {
        const av = String(a[campo] ?? '').toLowerCase();
        const bv = String(b[campo] ?? '').toLowerCase();
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
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

  abrirDetalle(row: UsuarioLeer): void {
    if (row && row.id) {
      this.selectedUsuarioId.set(row.id);
      this.isDetalleOpen.set(true);
    }
  }

  cerrarDetalle(): void {
    this.isDetalleOpen.set(false);
    this.selectedUsuarioId.set(null);
  }

  tipoClase(tipo: string): string {
    switch (tipo) {
      case 'DOCTOR':
        return 'bg-sky-100 text-sky-700 border border-sky-200';
      case 'PACIENTE':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'RECEPCIONISTA':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  }

  desactivar(usuario: UsuarioLeer): void {
    this.toastService
      .confirmar(
        'Desactivar usuario',
        `¿Estás seguro de que deseas desactivar la cuenta "${usuario.usuario}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) return;
        this.usuarioService.eliminar(usuario.id).subscribe({
          next: (res) => {
            this.toastService.success(res?.mensaje || 'Usuario desactivado con éxito');
            this.usuarios.set(this.usuarios().filter((u) => u.id !== usuario.id));
          },
          error: () => this.toastService.error('Hubo un error al desactivar el usuario'),
        });
      });
  }
}
