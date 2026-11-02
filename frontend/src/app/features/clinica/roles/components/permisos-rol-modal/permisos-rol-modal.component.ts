import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Rol } from '../../interface/rol.interface';
import { PermisoItem, PermisoModulo } from '../../interface/autorizacion.interface';
import { AutorizacionService } from '../../services/autorizacion.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastService } from '../../../../../core/services/toast.service';

interface GrupoVista {
  modulo: string;
  titulo: string;
  visibles: PermisoItem[];
  seleccionados: number;
  total: number;
  estado: 'ninguno' | 'parcial' | 'todos';
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

@Component({
  selector: 'app-permisos-rol-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permisos-rol-modal.component.html',
})
export class PermisosRolModalComponent implements OnInit {
  @Input() rol: Rol | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  private readonly autorizacionService = inject(AutorizacionService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  cargando = signal(false);
  errorCarga = signal(false);
  guardando = signal(false);

  catalogo = signal<PermisoModulo[]>([]);
  seleccion = signal<ReadonlySet<number>>(new Set());
  inicial = signal<ReadonlySet<number>>(new Set());
  busqueda = signal('');

  idsCatalogo = computed(
    () => new Set(this.catalogo().flatMap((modulo) => modulo.permisos.map((p) => p.id))),
  );

  totalPermisos = computed(() => this.idsCatalogo().size);

  totalSeleccionados = computed(() => {
    const ids = this.idsCatalogo();
    let total = 0;
    this.seleccion().forEach((id) => {
      if (ids.has(id)) {
        total++;
      }
    });
    return total;
  });

  agregados = computed(() => {
    let total = 0;
    this.seleccion().forEach((id) => {
      if (!this.inicial().has(id)) {
        total++;
      }
    });
    return total;
  });

  quitados = computed(() => {
    let total = 0;
    this.inicial().forEach((id) => {
      if (!this.seleccion().has(id)) {
        total++;
      }
    });
    return total;
  });

  hayCambios = computed(() => this.agregados() > 0 || this.quitados() > 0);

  grupos = computed<GrupoVista[]>(() => {
    const termino = normalizar(this.busqueda().trim());
    const seleccion = this.seleccion();

    return this.catalogo()
      .map((modulo) => {
        const visibles = termino
          ? modulo.permisos.filter((p) =>
              normalizar(`${modulo.modulo} ${p.nombre} ${p.codigo}`).includes(termino),
            )
          : modulo.permisos;

        const marcadosVisibles = visibles.filter((p) => seleccion.has(p.id)).length;

        return {
          modulo: modulo.modulo,
          titulo: this.formatearModulo(modulo.modulo),
          visibles,
          seleccionados: modulo.permisos.filter((p) => seleccion.has(p.id)).length,
          total: modulo.permisos.length,
          estado:
            marcadosVisibles === 0
              ? 'ninguno'
              : marcadosVisibles === visibles.length
                ? 'todos'
                : 'parcial',
        } as GrupoVista;
      })
      .filter((grupo) => grupo.visibles.length > 0);
  });

  get esRolPropio(): boolean {
    const roles = this.authService.getRole();
    const nombreRol = normalizar(this.rol?.nombre ?? '');

    return roles.some((rol) => normalizar(rol) === nombreRol);
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    const rol = this.rol;

    if (!rol) {
      return;
    }

    this.cargando.set(true);
    this.errorCarga.set(false);

    forkJoin({
      catalogo: this.autorizacionService.listarPermisos(),
      asignados: this.autorizacionService.listarPorRol(rol.id),
    }).subscribe({
      next: ({ catalogo, asignados }) => {
        this.catalogo.set(catalogo.object?.modulos ?? []);

        const ids = new Set<number>(
          (asignados.object?.permisos ?? []).flatMap((modulo) => modulo.permisos.map((p) => p.id)),
        );

        this.seleccion.set(ids);
        this.inicial.set(new Set(ids));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los permisos.');
        this.errorCarga.set(true);
        this.cargando.set(false);
      },
    });
  }

  formatearModulo(modulo: string): string {
    const texto = modulo.replace(/[_-]+/g, ' ').trim().toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  esPermisoVerObligatorio(permiso: PermisoItem, grupo: GrupoVista): boolean {
    const esVer = /listar|ver|read|get/i.test(permiso.codigo || permiso.nombre);
    if (!esVer) {
      return false;
    }

    const moduloOriginal = this.catalogo().find((m) => m.modulo === grupo.modulo);
    if (!moduloOriginal) {
      return false;
    }

    return moduloOriginal.permisos
      .filter((p) => p.id !== permiso.id)
      .some((p) => this.seleccion().has(p.id));
  }

  alternar(id: number): void {
    const modulos = this.catalogo();
    let permisoEncontrado: PermisoItem | undefined;
    let moduloEncontrado: PermisoModulo | undefined;

    for (const modulo of modulos) {
      const p = modulo.permisos.find((item) => item.id === id);
      if (p) {
        permisoEncontrado = p;
        moduloEncontrado = modulo;
        break;
      }
    }

    if (!permisoEncontrado || !moduloEncontrado) {
      return;
    }

    const esVerOListar = /listar|ver|read|get/i.test(
      permisoEncontrado.codigo || permisoEncontrado.nombre,
    );
    const estaSeleccionado = this.seleccion().has(id);

    const grupoTemp: GrupoVista = {
      modulo: moduloEncontrado.modulo,
      titulo: '',
      visibles: moduloEncontrado.permisos,
      seleccionados: 0,
      total: moduloEncontrado.permisos.length,
      estado: 'ninguno',
    };

    if (
      estaSeleccionado &&
      esVerOListar &&
      this.esPermisoVerObligatorio(permisoEncontrado, grupoTemp)
    ) {
      return;
    }

    this.seleccion.update((actual) => {
      const nuevo = new Set(actual);

      if (estaSeleccionado) {
        nuevo.delete(id);
      } else {
        nuevo.add(id);

        if (!esVerOListar) {
          const permisoListar = moduloEncontrado!.permisos.find((p) =>
            /listar|ver|read|get/i.test(p.codigo || p.nombre),
          );
          if (permisoListar) {
            nuevo.add(permisoListar.id);
          }
        }
      }

      return nuevo;
    });
  }
  alternarGrupo(grupo: GrupoVista): void {
    const ids = grupo.visibles.map((p) => p.id);
    const todosMarcados = ids.every((id) => this.seleccion().has(id));
    this.establecer(ids, !todosMarcados);
  }

  marcarVisibles(marcar: boolean): void {
    this.establecer(
      this.grupos().flatMap((grupo) => grupo.visibles.map((p) => p.id)),
      marcar,
    );
  }

  private establecer(ids: number[], marcar: boolean): void {
    this.seleccion.update((actual) => {
      const nuevo = new Set(actual);
      ids.forEach((id) => (marcar ? nuevo.add(id) : nuevo.delete(id)));
      return nuevo;
    });
  }

  async cerrar(): Promise<void> {
    if (this.guardando()) {
      return;
    }

    if (this.hayCambios()) {
      const descartar = await this.toastService.confirmar(
        'Descartar cambios',
        'Tienes cambios sin guardar en los permisos. ¿Deseas cerrar sin guardarlos?',
      );

      if (!descartar) {
        return;
      }
    }

    this.close.emit();
  }

  async guardar(): Promise<void> {
    const rol = this.rol;

    if (!rol || !this.hayCambios() || this.guardando()) {
      return;
    }

    if (this.esRolPropio && this.quitados() > 0) {
      const continuar = await this.toastService.confirmar(
        'Modificar tu propio rol',
        'Estás quitando permisos al rol que estás usando. Podrías perder el acceso a algunas secciones. ¿Deseas continuar?',
      );

      if (!continuar) {
        return;
      }
    }

    this.guardando.set(true);

    this.autorizacionService
      .sincronizar({
        idRol: rol.id,
        idPermisos: [...this.seleccion()].sort((a, b) => a - b),
      })
      .subscribe({
        next: (response) => {
          this.toastService.success(response?.mensaje || 'Permisos actualizados con éxito');
          this.guardando.set(false);
          this.guardado.emit();
        },
        error: (error) => {
          console.error(error);
          this.toastService.error(error.error?.mensaje || 'No se pudieron guardar los permisos.');
          this.guardando.set(false);
        },
      });
  }
}
