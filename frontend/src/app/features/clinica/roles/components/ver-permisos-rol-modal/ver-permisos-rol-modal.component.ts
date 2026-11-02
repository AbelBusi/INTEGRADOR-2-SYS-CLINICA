import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  computed,
  inject,
  signal,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Rol } from '../../interface/rol.interface';
import { PermisoItem, PermisoModulo } from '../../interface/autorizacion.interface';
import { AutorizacionService } from '../../services/autorizacion.service';
import { ToastService } from '../../../../../core/services/toast.service';

interface GrupoVista {
  modulo: string;
  titulo: string;
  visibles: PermisoItem[];
  seleccionados: number;
  total: number;
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

@Component({
  selector: 'app-ver-permisos-rol-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-permisos-rol-modal.component.html',
})
export class VerPermisosRolModalComponent implements OnInit {
  @Input() rol: Rol | null = null;
  @Output() close = new EventEmitter<void>();

  private readonly autorizacionService = inject(AutorizacionService);
  private readonly toastService = inject(ToastService);

  cargando = signal(false);
  errorCarga = signal(false);

  catalogo = signal<PermisoModulo[]>([]);
  seleccion = signal<ReadonlySet<number>>(new Set());
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

        return {
          modulo: modulo.modulo,
          titulo: this.formatearModulo(modulo.modulo),
          visibles,
          seleccionados: modulo.permisos.filter((p) => seleccion.has(p.id)).length,
          total: modulo.permisos.length,
        } as GrupoVista;
      })
      .filter((grupo) => grupo.visibles.length > 0);
  });

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
        this.cargando.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los permisos del rol.');
        this.errorCarga.set(true);
        this.cargando.set(false);
      },
    });
  }

  formatearModulo(modulo: string): string {
    const texto = modulo.replace(/[_-]+/g, ' ').trim().toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}
