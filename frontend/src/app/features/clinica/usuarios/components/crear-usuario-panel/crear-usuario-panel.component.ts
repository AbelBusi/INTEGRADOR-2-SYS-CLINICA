import { Component, EventEmitter, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, timer } from 'rxjs';
import {
  PersonaUsuario,
  RolesAsignables,
  TipoUsuario,
  UsuarioCreado,
} from '../../interface/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { ToastService } from '../../../../../core/services/toast.service';

type Fase = 'formulario' | 'generando' | 'listo';

const DURACION_MINIMA_MS = 1800;

@Component({
  selector: 'app-crear-usuario-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario-panel.component.html',
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
export class CrearUsuarioPanelComponent implements OnInit {
  @Output() usuarioCreado = new EventEmitter<void>();

  personas = signal<PersonaUsuario[]>([]);
  idPersona = signal<number | null>(null);
  configuracion = signal<RolesAsignables | null>(null);
  idRoles = signal<number[]>([]);

  cargandoPersonas = signal(false);
  cargandoRoles = signal(false);
  fase = signal<Fase>('formulario');
  resultado = signal<UsuarioCreado | null>(null);

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
      this.idPersona() !== null &&
      this.configuracion() !== null &&
      !this.cargandoRoles() &&
      this.rolesSeleccionados().length > 0,
  );

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarPersonas();
  }

  onPersonaChange(idPersona: number | null): void {
    this.idPersona.set(idPersona);
    this.configuracion.set(null);
    this.idRoles.set([]);

    if (idPersona === null) {
      return;
    }

    this.cargandoRoles.set(true);

    this.usuarioService.obtenerRolesAsignables(idPersona).subscribe({
      next: (response) => {
        if (this.idPersona() !== idPersona) {
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
        if (this.idPersona() !== idPersona) {
          return;
        }

        console.error(error);
        this.cargandoRoles.set(false);
        this.idPersona.set(null);
        this.toastService.error(
          error.error?.mensaje || 'No se pudieron cargar los roles de la persona.',
        );
      },
    });
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

  private cargarPersonas(): void {
    this.personas.set([]);
    this.cargandoPersonas.set(true);

    this.usuarioService.listarPersonasSinUsuario().subscribe({
      next: (response) => {
        this.personas.set(response.object || []);
        this.cargandoPersonas.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudo cargar la lista de personas sin usuario.');
        this.cargandoPersonas.set(false);
      },
    });
  }

  async crear(): Promise<void> {
    const idPersona = this.idPersona();
    const config = this.configuracion();

    if (idPersona === null || config === null || !this.puedeCrear()) {
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

    this.fase.set('generando');

    forkJoin({
      creado: this.usuarioService.crear({
        idPersona,
        tipo,
        idRoles: seleccionados.filter((rol) => !rol.obligatorio).map((rol) => rol.idRol),
      }),
      pausa: timer(DURACION_MINIMA_MS),
    }).subscribe({
      next: ({ creado }) => {
        this.resultado.set(creado.object);
        this.fase.set('listo');
        this.usuarioCreado.emit();
      },
      error: (error) => {
        console.error(error);
        this.fase.set('formulario');
        this.toastService.error(error.error?.mensaje || 'No se pudo crear el usuario.');
      },
    });
  }

  crearOtro(): void {
    this.resultado.set(null);
    this.idPersona.set(null);
    this.configuracion.set(null);
    this.idRoles.set([]);
    this.fase.set('formulario');
    this.cargarPersonas();
  }
}
