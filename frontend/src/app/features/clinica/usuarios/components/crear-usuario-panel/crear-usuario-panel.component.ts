import { Component, EventEmitter, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, timer } from 'rxjs';
import {
  PersonaUsuario,
  RolResumen,
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

  tipo = signal<TipoUsuario>('PACIENTE');
  personas = signal<PersonaUsuario[]>([]);
  roles = signal<RolResumen[]>([]);
  idPersona = signal<number | null>(null);
  idRol = signal<number | null>(null);

  cargandoPersonas = signal(false);
  fase = signal<Fase>('formulario');
  resultado = signal<UsuarioCreado | null>(null);

  rolesEmpleado = computed(() =>
    this.roles().filter((rol) => rol.nombre.trim().toUpperCase() !== 'PACIENTE'),
  );

  etiquetaPersona = computed(() => (this.tipo() === 'PACIENTE' ? 'Paciente' : 'Empleado'));

  puedeCrear = computed(
    () =>
      this.fase() === 'formulario' &&
      this.idPersona() !== null &&
      (this.tipo() === 'PACIENTE' || this.idRol() !== null),
  );

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarPersonas();

    this.usuarioService.listarRoles().subscribe({
      next: (response) => this.roles.set(response.object || []),
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los roles.');
      },
    });
  }

  onTipoChange(tipo: TipoUsuario): void {
    this.tipo.set(tipo);
    this.idPersona.set(null);
    this.idRol.set(null);
    this.cargarPersonas();
  }

  private cargarPersonas(): void {
    const tipo = this.tipo();

    this.personas.set([]);
    this.cargandoPersonas.set(true);

    const peticion =
      tipo === 'PACIENTE'
        ? this.usuarioService.listarPacientesSinUsuario()
        : this.usuarioService.listarEmpleadosSinUsuario();

    peticion.subscribe({
      next: (response) => {
        if (this.tipo() === tipo) {
          this.personas.set(response.object || []);
          this.cargandoPersonas.set(false);
        }
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudo cargar la lista de personas sin usuario.');
        this.cargandoPersonas.set(false);
      },
    });
  }

  crear(): void {
    const idPersona = this.idPersona();

    if (idPersona === null || !this.puedeCrear()) {
      return;
    }

    const esEmpleado = this.tipo() === 'EMPLEADO';

    this.fase.set('generando');

    forkJoin({
      creado: this.usuarioService.crear({
        idPersona,
        tipo: this.tipo(),
        idRol: esEmpleado ? this.idRol() : null,
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
    this.idRol.set(null);
    this.fase.set('formulario');
    this.cargarPersonas();
  }
}
