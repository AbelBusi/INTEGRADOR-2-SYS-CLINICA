import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { TipoUsuario, UsuarioFila, UsuarioListado } from '../../interface/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { normalizar } from '../../utils/formato.util';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { CrearUsuarioPanelComponent } from '../../components/crear-usuario-panel/crear-usuario-panel.component';
import { VerUsuarioModalComponent } from '../../components/ver-usuario-modal/ver-usuario-modal.component';
import { CambiarRolModalComponent } from '../../components/cambiar-rol-modal/cambiar-rol-modal.component';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { TienePermisoDirective } from '../../../../../core/directives/tiene-permiso.directive';

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
    CambiarRolModalComponent,
    TienePermisoDirective,
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
  usuarioRol = signal<UsuarioFila | null>(null);

  private idActual = '';

  columns: TableColumn<UsuarioFila>[] = [
    { header: 'Persona', field: 'nombreCompleto', sortable: true, type: 'custom' },
    { header: 'Documento', field: 'numeroDocumento', type: 'custom' },
    { header: 'Perfil', field: 'tipos', type: 'custom' },
    { header: 'Roles', field: 'roles', type: 'custom' },
    { header: 'Usuario', field: 'usuario', type: 'custom' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom' },
  ];

  total = computed(() => this.usuarios().length);
  totalPacientes = computed(
    () => this.usuarios().filter((u) => u.tipos.includes('PACIENTE')).length,
  );
  totalEmpleados = computed(
    () => this.usuarios().filter((u) => u.tipos.includes('EMPLEADO')).length,
  );
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
      if (tipo !== 'todos' && !u.tipos.includes(tipo)) {
        return false;
      }
      if (estado === 'activo' && u.estado !== 1) {
        return false;
      }
      if (estado === 'inactivo' && u.estado !== 2) {
        return false;
      }

      const texto = `${u.nombreCompleto} ${u.usuario} ${u.numeroDocumento} ${u.roles
        .map((rol) => rol.nombre)
        .join(' ')}`;

      if (termino && !normalizar(texto).includes(termino)) {
        return false;
      }
      return true;
    });

    if (this.sortField() === 'nombreCompleto') {
      return [...lista].sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
    }

    return lista;
  });

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.idActual = String(this.authService.getUserId());
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
        this.usuarios.set(this.combinar(pacientes.object || [], empleados.object || []));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.toastService.error('No se pudieron cargar los usuarios del servidor.');
        this.cargando.set(false);
      },
    });
  }

  private combinar(pacientes: UsuarioListado[], empleados: UsuarioListado[]): UsuarioFila[] {
    const cuentas = new Map<number, UsuarioFila>();

    const agregar = (lista: UsuarioListado[], tipo: TipoUsuario): void => {
      for (const usuario of lista) {
        const existente = cuentas.get(usuario.id);

        if (existente) {
          if (!existente.tipos.includes(tipo)) {
            existente.tipos.push(tipo);
          }
        } else {
          cuentas.set(usuario.id, { ...usuario, roles: usuario.roles ?? [], tipos: [tipo] });
        }
      }
    };

    agregar(pacientes, 'PACIENTE');
    agregar(empleados, 'EMPLEADO');

    return [...cuentas.values()].sort((a, b) => b.id - a.id);
  }

  esCuentaPropia(fila: UsuarioFila): boolean {
    return String(fila.id) === this.idActual;
  }

  puedeGestionarRoles(fila: UsuarioFila): boolean {
    return fila.tipos.includes('EMPLEADO');
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

  setUsuarioRol(fila: UsuarioFila): void {
    if (this.esCuentaPropia(fila)) {
      this.toastService.warning('No puedes modificar los roles de tu propia cuenta.');
      return;
    }

    if (!this.puedeGestionarRoles(fila)) {
      this.toastService.warning('Los roles solo se gestionan en cuentas de empleados.');
      return;
    }

    this.usuarioRol.set(fila);
  }

  handleRolesActualizados(): void {
    this.cargar(true);
  }

  cambiarEstado(fila: UsuarioFila, estado: 'ACTIVO' | 'INACTIVO'): void {
    if (this.procesando()) {
      return;
    }

    if (this.esCuentaPropia(fila)) {
      this.toastService.warning('No puedes cambiar el estado de tu propia cuenta.');
      return;
    }

    const activar = estado === 'ACTIVO';
    const accion = activar ? 'activar' : 'desactivar';

    this.toastService
      .confirmar(
        `${activar ? 'Activar' : 'Desactivar'} Usuario`,
        `¿Estás seguro de que deseas ${accion} la cuenta de "${fila.nombreCompleto}"?`,
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
