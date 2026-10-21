import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RolResumen, UsuarioFila } from '../../interface/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { ToastService } from '../../../../../core/services/toast.service';

function esRolPaciente(rol: RolResumen): boolean {
  return rol.nombre.trim().toUpperCase() === 'PACIENTE';
}

@Component({
  selector: 'app-cambiar-rol-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-rol-modal.component.html',
})
export class CambiarRolModalComponent implements OnInit {
  @Input() usuario: UsuarioFila | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() rolCambiado = new EventEmitter<void>();

  asignados = signal<RolResumen[]>([]);
  catalogo = signal<RolResumen[]>([]);
  idNuevoRol = signal<number | null>(null);

  cargando = signal(false);
  agregando = signal(false);
  quitandoId = signal<number | null>(null);

  disponibles = computed(() => {
    const ids = new Set(this.asignados().map((rol) => rol.idRol));
    const tipos = this.usuario?.tipos ?? [];

    return this.catalogo().filter((rol) => {
      if (ids.has(rol.idRol)) {
        return false;
      }
      return esRolPaciente(rol) ? tipos.includes('PACIENTE') : tipos.includes('EMPLEADO');
    });
  });

  avisos = computed(() => {
    const tipos = this.usuario?.tipos ?? [];
    const lista: string[] = [];

    if (!tipos.includes('PACIENTE')) {
      lista.push('Para asignar el rol PACIENTE, la persona debe estar registrada como paciente.');
    }
    if (!tipos.includes('EMPLEADO')) {
      lista.push('Para asignar roles laborales, la persona debe estar registrada como empleado.');
    }

    return lista;
  });

  unSoloRol = computed(() => this.asignados().length <= 1);

  ocupado = computed(() => this.agregando() || this.quitandoId() !== null);

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    const usuario = this.usuario;

    if (!usuario) {
      return;
    }

    this.cargando.set(true);

    forkJoin({
      actuales: this.usuarioService.obtenerRoles(usuario.id),
      catalogo: this.usuarioService.listarRoles(),
    }).subscribe({
      next: ({ actuales, catalogo }) => {
        this.asignados.set(actuales.object?.roles ?? []);
        this.catalogo.set(catalogo.object || []);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los roles de la cuenta.');
        this.cargando.set(false);
        this.onClose();
      },
    });
  }

  esPaciente(rol: RolResumen): boolean {
    return esRolPaciente(rol);
  }

  agregar(): void {
    const usuario = this.usuario;
    const idRol = this.idNuevoRol();

    if (!usuario || idRol === null || this.ocupado()) {
      return;
    }

    this.agregando.set(true);

    this.usuarioService.asignarRol(usuario.id, idRol).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Rol asignado con éxito');
        this.idNuevoRol.set(null);
        this.agregando.set(false);
        this.recargarRoles();
        this.rolCambiado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo asignar el rol.');
        this.agregando.set(false);
      },
    });
  }

  async quitar(rol: RolResumen): Promise<void> {
    const usuario = this.usuario;

    if (!usuario || this.ocupado() || this.esPaciente(rol) || this.unSoloRol()) {
      return;
    }

    const confirmar = await this.toastService.confirmar(
      'Quitar rol',
      `¿Quitar el rol "${rol.nombre}" a ${usuario.nombreCompleto}? Su sesión actual se cerrará.`,
    );

    if (!confirmar) {
      return;
    }

    this.quitandoId.set(rol.idRol);

    this.usuarioService.revocarRol(usuario.id, rol.idRol).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Rol revocado con éxito');
        this.quitandoId.set(null);
        this.recargarRoles();
        this.rolCambiado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo quitar el rol.');
        this.quitandoId.set(null);
      },
    });
  }

  private recargarRoles(): void {
    const usuario = this.usuario;

    if (!usuario) {
      return;
    }

    this.usuarioService.obtenerRoles(usuario.id).subscribe({
      next: (response) => this.asignados.set(response.object?.roles ?? []),
      error: (error) => console.error(error),
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
