import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Subject,
  Subscription,
  catchError,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  interval,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import {
  PersonaBusqueda,
  RolesAsignables,
  TipoUsuario,
  UsuarioCreado,
} from '../../interface/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { ToastService } from '../../../../../core/services/toast.service';

type Fase = 'formulario' | 'generando' | 'listo';

const MINIMO_CARACTERES = 3;
const DURACION_MINIMA_MS = 1800;
const INTERVALO_PASOS_MS = 700;

@Component({
  selector: 'app-crear-usuario-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crear-usuario-modal.component.html',
  styles: [
    `
      .trazo-circulo {
        stroke-dasharray: 151;
        stroke-dashoffset: 151;
        animation: dibujar 0.55s ease-out forwards;
      }

      .trazo-check {
        stroke-dasharray: 40;
        stroke-dashoffset: 40;
        animation: dibujar 0.35s ease-out 0.5s forwards;
      }

      .barra-indeterminada {
        animation: deslizar 1.2s ease-in-out infinite;
      }

      @keyframes dibujar {
        to {
          stroke-dashoffset: 0;
        }
      }

      @keyframes deslizar {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(300%);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .trazo-circulo,
        .trazo-check {
          animation-duration: 0.01s;
          animation-delay: 0s;
        }

        .barra-indeterminada {
          animation: none;
        }
      }
    `,
  ],
})
export class CrearUsuarioModalComponent implements AfterViewInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() usuarioCreado = new EventEmitter<void>();

  @ViewChild('buscador') buscador?: ElementRef<HTMLInputElement>;

  readonly minimoCaracteres = MINIMO_CARACTERES;

  readonly pasosGeneracion = [
    'Creando el usuario',
    'Generando la contraseña temporal',
    'Asignando los roles',
    'Enviando las credenciales al correo',
  ];

  termino = signal('');
  resultados = signal<PersonaBusqueda[]>([]);
  buscando = signal(false);
  busquedaRealizada = signal(false);

  seleccionada = signal<PersonaBusqueda | null>(null);
  configuracion = signal<RolesAsignables | null>(null);
  idRoles = signal<number[]>([]);
  cargandoRoles = signal(false);

  fase = signal<Fase>('formulario');
  resultado = signal<UsuarioCreado | null>(null);
  indicePaso = signal(0);

  terminoCorto = computed(() => {
    const longitud = this.termino().trim().length;
    return longitud > 0 && longitud < MINIMO_CARACTERES;
  });

  sinResultados = computed(
    () => this.busquedaRealizada() && !this.buscando() && this.resultados().length === 0,
  );

  rolesSeleccionados = computed(() => {
    const config = this.configuracion();

    if (!config) {
      return [];
    }

    const ids = this.idRoles();
    return config.roles.filter((rol) => rol.obligatorio || ids.includes(rol.idRol));
  });

  puedeCrear = computed(
    () =>
      this.fase() === 'formulario' &&
      this.seleccionada()?.tieneCorreo === true &&
      this.configuracion() !== null &&
      !this.cargandoRoles() &&
      this.rolesSeleccionados().length > 0,
  );

  private readonly terminos = new Subject<string>();
  private ticker?: Subscription;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly toastService: ToastService,
  ) {
    this.terminos
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((termino) => this.buscando.set(termino.length >= MINIMO_CARACTERES)),
        switchMap((termino) =>
          termino.length < MINIMO_CARACTERES
            ? of(null)
            : this.usuarioService.buscarPersonas(termino).pipe(
              catchError((error) => {
                console.error(error);
                this.toastService.error(error.error?.mensaje || 'No se pudo realizar la búsqueda.');
                return of(null);
              }),
            ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.buscando.set(false);
        this.resultados.set(response?.object ?? []);
        this.busquedaRealizada.set(response !== null);
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.buscador?.nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.detenerGeneracion();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrar();
  }

  onTermino(valor: string): void {
    this.termino.set(valor);
    this.busquedaRealizada.set(false);

    const limpio = valor.trim();

    if (limpio.length < MINIMO_CARACTERES) {
      this.resultados.set([]);
    }

    this.terminos.next(limpio);
  }

  tipoPersona(persona: PersonaBusqueda): string {
    if (persona.esPaciente && persona.esEmpleado) {
      return 'Paciente y empleado';
    }
    return persona.esEmpleado ? 'Empleado' : 'Paciente';
  }

  detalleDocumento(persona: PersonaBusqueda): string {
    const base = `${persona.tipoDocumento} ${persona.numeroDocumento}`;
    return persona.genero ? `${base} · ${persona.genero}` : base;
  }

  seleccionar(persona: PersonaBusqueda): void {
    this.limpiarBusqueda();
    this.seleccionada.set(persona);
    this.configuracion.set(null);
    this.idRoles.set([]);

    if (!persona.tieneCorreo) {
      return;
    }

    this.cargandoRoles.set(true);

    this.usuarioService.obtenerRolesAsignables(persona.idPersona).subscribe({
      next: (response) => {
        if (this.seleccionada()?.idPersona !== persona.idPersona) {
          return;
        }

        const config = response.object;

        this.configuracion.set(config);
        this.idRoles.set(
          config.roles.filter((rol) => rol.recomendado && !rol.obligatorio).map((rol) => rol.idRol),
        );
        this.cargandoRoles.set(false);
      },
      error: (error) => {
        if (this.seleccionada()?.idPersona !== persona.idPersona) {
          return;
        }

        console.error(error);
        this.cargandoRoles.set(false);
        this.seleccionada.set(null);
        this.toastService.error(
          error.error?.mensaje || 'No se pudieron cargar los roles de la persona.',
        );
        this.enfocarBuscador();
      },
    });
  }

  cambiarPersona(): void {
    this.seleccionada.set(null);
    this.configuracion.set(null);
    this.idRoles.set([]);
    this.cargandoRoles.set(false);
    this.enfocarBuscador();
  }

  alternarRol(idRol: number): void {
    const rol = this.configuracion()?.roles.find((opcion) => opcion.idRol === idRol);

    if (!rol || rol.obligatorio) {
      return;
    }

    this.idRoles.update((actual) =>
      actual.includes(idRol) ? actual.filter((id) => id !== idRol) : [...actual, idRol],
    );
  }

  async crear(): Promise<void> {
    const persona = this.seleccionada();
    const config = this.configuracion();

    if (!persona || !config || !this.puedeCrear()) {
      return;
    }

    const seleccionados = this.rolesSeleccionados();

    const confirmar = await this.toastService.confirmar(
      'Crear usuario',
      `Se creará una cuenta para "${config.nombreCompleto}" con los roles: ${seleccionados
        .map((rol) => rol.nombre)
        .join(', ')}. ¿Deseas continuar?`,
    );

    if (!confirmar) {
      return;
    }

    const tipo: TipoUsuario = config.esPaciente ? 'PACIENTE' : 'EMPLEADO';

    this.iniciarGeneracion();

    forkJoin({
      creado: this.usuarioService.crear({
        idPersona: persona.idPersona,
        tipo,
        idRoles: seleccionados.filter((rol) => !rol.obligatorio).map((rol) => rol.idRol),
      }),
      pausa: timer(DURACION_MINIMA_MS),
    }).subscribe({
      next: ({ creado }) => {
        this.detenerGeneracion();
        this.resultado.set(creado.object);
        this.fase.set('listo');
        this.usuarioCreado.emit();
      },
      error: (error) => {
        console.error(error);
        this.detenerGeneracion();
        this.fase.set('formulario');
        this.toastService.error(error.error?.mensaje || 'No se pudo crear el usuario.');
      },
    });
  }

  crearOtro(): void {
    this.resultado.set(null);
    this.seleccionada.set(null);
    this.configuracion.set(null);
    this.idRoles.set([]);
    this.limpiarBusqueda();
    this.fase.set('formulario');
    this.enfocarBuscador();
  }

  cerrar(): void {
    if (this.fase() === 'generando') {
      return;
    }
    this.close.emit();
  }

  private iniciarGeneracion(): void {
    this.indicePaso.set(0);
    this.fase.set('generando');

    this.ticker = interval(INTERVALO_PASOS_MS).subscribe(() =>
      this.indicePaso.update((indice) => Math.min(indice + 1, this.pasosGeneracion.length - 1)),
    );
  }

  private detenerGeneracion(): void {
    this.ticker?.unsubscribe();
    this.ticker = undefined;
  }

  private limpiarBusqueda(): void {
    this.termino.set('');
    this.resultados.set([]);
    this.buscando.set(false);
    this.busquedaRealizada.set(false);
    this.terminos.next('');
  }

  private enfocarBuscador(): void {
    setTimeout(() => this.buscador?.nativeElement.focus());
  }
}
