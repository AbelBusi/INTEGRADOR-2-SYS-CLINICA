import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { TipoUsuario, UsuarioFila } from '../../interface/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { FechaHoraApi, claveOrden, formatearFechaHora, normalizar } from '../../utils/formato.util';
import { ToastService } from '../../../../../core/services/toast.service';
import { CrearUsuarioPanelComponent } from '../../components/crear-usuario-panel/crear-usuario-panel.component';
import { VerUsuarioModalComponent } from '../../components/ver-usuario-modal/ver-usuario-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';

type FiltroTipo = 'todos' | TipoUsuario;
type FiltroEstado = 'todos' | 'activo' | 'inactivo';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    CrearUsuarioPanelComponent,
    VerUsuarioModalComponent,
  ],
  templateUrl: './gestion-usuarios.component.html',
})
export class GestionUsuariosComponent implements OnInit {
  usuarios = signal<UsuarioFila[]>([]);
  cargando = signal(false);
  procesando = signal(false);

  busqueda = signal('');
  filtroTipo = signal<FiltroTipo>('todos');
  filtroEstado = signal<FiltroEstado>('todos');
  sortField = signal('');

  usuarioVer = signal<UsuarioFila | null>(null);

  columns: TableColumn<UsuarioFila>[] = [
    { header: 'Persona', field: 'persona', sortable: true, type: 'custom' },
    { header: 'Tipo', field: 'tipo', type: 'custom' },
    { header: 'Rol', field: 'rol', type: 'custom' },
    { header: 'Usuario', field: 'nombreUsuario', type: 'custom' },
    { header: 'Fecha creación', field: 'fechaCreacion', type: 'custom' },
    { header: 'Fecha actualización', field: 'fechaActualizacion', type: 'custom' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom' },
  ];

  total = computed(() => this.usuarios().length);
  totalPacientes = computed(() => this.usuarios().filter((u) => u.tipo === 'PACIENTE').length);
  totalEmpleados = computed(() => this.usuarios().filter((u) => u.tipo === 'EMPLEADO').length);
  totalActivos = computed(() => this.usuarios().filter((u) => u.estado === 1).length);

  hayFiltros = computed(
    () =>
      this.busqueda().trim() !== '' ||
      this.filtroTipo() !== 'todos' ||
      this.filtroEstado() !== 'todos',
  );

  filas = computed(() => {
    const termino = normalizar(this.busqueda().trim());
    const tipo = this.filtroTipo();
    const estado = this.filtroEstado();

    const lista = this.usuarios().filter((u) => {
      if (tipo !== 'todos' && u.tipo !== tipo) {
        return false;
      }
      if (estado === 'activo' && u.estado !== 1) {
        return false;
      }
      if (estado === 'inactivo' && u.estado !== 2) {
        return false;
      }
      if (termino && !normalizar(`${u.persona} ${u.nombreUsuario} ${u.rol}`).includes(termino)) {
        return false;
      }
      return true;
    });

    if (this.sortField() === 'persona') {
      return [...lista].sort((a, b) => a.persona.localeCompare(b.persona));
    }

    return [...lista].sort((a, b) =>
      claveOrden(b.fechaCreacion).localeCompare(claveOrden(a.fechaCreacion)),
    );
  });

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargar(false);
  }

  cargar(silencioso: boolean): void {
    if (!silencioso) {
      this.cargando.set(true);
    }

    forkJoin({
      pacientes: this.usuarioService.listarPacientes(),
      empleados: this.usuarioService.listarEmpleados(),
    }).subscribe({
      next: ({ pacientes, empleados }) => {
        const filas: UsuarioFila[] = [
          ...(pacientes.object || []).map((u) => ({ ...u, tipo: 'PACIENTE' as TipoUsuario })),
          ...(empleados.object || []).map((u) => ({ ...u, tipo: 'EMPLEADO' as TipoUsuario })),
        ];

        this.usuarios.set(filas);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.toastService.error('No se pudieron cargar los usuarios del servidor.');
        this.cargando.set(false);
      },
    });
  }

  fecha(valor: FechaHoraApi): string {
    return formatearFechaHora(valor);
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.filtroTipo.set('todos');
    this.filtroEstado.set('todos');
  }

  handleSort(field: string): void {
    this.sortField.set(this.sortField() === field ? '' : field);
  }

  setUsuarioVer(fila: UsuarioFila): void {
    this.usuarioVer.set(fila);
  }

  cambiarEstado(fila: UsuarioFila, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.procesando()) {
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Usuario`,
        `¿Estás seguro de que deseas ${accion} la cuenta de "${fila.persona}"?`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.procesando.set(true);

        this.usuarioService.cambiarEstado(fila.id, estado).subscribe({
          next: (response) => {
            this.toastService.success(
              response?.mensaje || `Usuario ${activar ? 'activado' : 'desactivado'} con éxito`,
            );
            this.procesando.set(false);
            this.cargar(true);
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(
              error.error?.mensaje || `Hubo un error al ${accion} el usuario`,
            );
            this.procesando.set(false);
          },
        });
      });
  }
}
