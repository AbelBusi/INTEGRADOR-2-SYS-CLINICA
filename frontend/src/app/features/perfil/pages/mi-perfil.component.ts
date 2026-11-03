import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { PerfilService } from '../services/perfil.service';
import { Perfil } from '../models/perfil.models';

type TipoMensaje = 'ok' | 'error';
type PasoCorreo = 'cerrado' | 'nuevo' | 'codigo';

interface Mensaje {
  tipo: TipoMensaje;
  texto: string;
}

function clavesIguales(control: AbstractControl): ValidationErrors | null {
  const nueva = control.get('nuevaClave')?.value;
  const confirmacion = control.get('confirmacionClave')?.value;
  return nueva && confirmacion && nueva !== confirmacion ? { noCoincide: true } : null;
}

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mi-perfil.component.html',
})
export class MiPerfilComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly perfilService = inject(PerfilService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  perfil = signal<Perfil | null>(null);
  cargando = signal(true);
  errorCarga = signal<string | null>(null);

  guardandoContacto = signal(false);
  mensajeContacto = signal<Mensaje | null>(null);

  pasoCorreo = signal<PasoCorreo>('cerrado');
  procesandoCorreo = signal(false);
  correoDestino = signal('');
  mensajeCorreo = signal<Mensaje | null>(null);

  guardandoClave = signal(false);
  mensajeClave = signal<Mensaje | null>(null);
  verClaveActual = signal(false);
  verClaveNueva = signal(false);

  inicial = computed(() => this.perfil()?.nombres?.charAt(0).toUpperCase() ?? '?');

  nombreCompleto = computed(() => {
    const p = this.perfil();
    return p ? `${p.nombres} ${p.apellidos}`.trim() : '';
  });

  formContacto = this.fb.nonNullable.group({
    telefono: ['', [Validators.maxLength(20), Validators.pattern(/^$|^\+?[0-9 ]{7,20}$/)]],
    direccion: ['', [Validators.required, Validators.maxLength(150)]],
  });

  formNuevoCorreo = this.fb.nonNullable.group({
    nuevoCorreo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
  });

  formCodigo = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  formClave = this.fb.nonNullable.group(
    {
      claveActual: ['', [Validators.required]],
      nuevaClave: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      confirmacionClave: ['', [Validators.required]],
    },
    { validators: clavesIguales },
  );

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando.set(true);
    this.errorCarga.set(null);

    this.perfilService.obtener().subscribe({
      next: (perfil) => {
        this.aplicarPerfil(perfil);
        this.cargando.set(false);
      },
      error: (err) => {
        this.errorCarga.set(this.extraerMensaje(err, 'No se pudo cargar tu perfil'));
        this.cargando.set(false);
      },
    });
  }

  guardarContacto(): void {
    if (this.formContacto.invalid) {
      this.formContacto.markAllAsTouched();
      return;
    }

    const { telefono, direccion } = this.formContacto.getRawValue();

    this.guardandoContacto.set(true);
    this.mensajeContacto.set(null);

    this.perfilService
      .actualizarContacto({ telefono: telefono.trim(), direccion: direccion.trim() })
      .subscribe({
        next: (perfil) => {
          this.aplicarPerfil(perfil);
          this.guardandoContacto.set(false);
          this.mensajeContacto.set({ tipo: 'ok', texto: 'Datos de contacto actualizados' });
        },
        error: (err) => {
          this.guardandoContacto.set(false);
          this.mensajeContacto.set({
            tipo: 'error',
            texto: this.extraerMensaje(err, 'No se pudieron guardar los cambios'),
          });
        },
      });
  }

  restablecerContacto(): void {
    const p = this.perfil();
    if (p) this.aplicarPerfil(p);
    this.mensajeContacto.set(null);
  }

  abrirCambioCorreo(): void {
    this.formNuevoCorreo.reset();
    this.formCodigo.reset();
    this.mensajeCorreo.set(null);
    this.pasoCorreo.set('nuevo');
  }

  cancelarCambioCorreo(): void {
    this.pasoCorreo.set('cerrado');
    this.mensajeCorreo.set(null);
  }

  solicitarCodigo(): void {
    if (this.formNuevoCorreo.invalid) {
      this.formNuevoCorreo.markAllAsTouched();
      return;
    }

    this.procesandoCorreo.set(true);
    this.mensajeCorreo.set(null);

    this.perfilService
      .solicitarCambioCorreo(this.formNuevoCorreo.getRawValue().nuevoCorreo.trim())
      .subscribe({
        next: (destino) => {
          this.correoDestino.set(destino);
          this.formCodigo.reset();
          this.pasoCorreo.set('codigo');
          this.procesandoCorreo.set(false);
        },
        error: (err) => {
          this.procesandoCorreo.set(false);
          this.mensajeCorreo.set({
            tipo: 'error',
            texto: this.extraerMensaje(err, 'No se pudo enviar el código'),
          });
        },
      });
  }

  confirmarCodigo(): void {
    if (this.formCodigo.invalid) {
      this.formCodigo.markAllAsTouched();
      return;
    }

    this.procesandoCorreo.set(true);
    this.mensajeCorreo.set(null);

    this.perfilService.confirmarCambioCorreo(this.formCodigo.getRawValue().codigo).subscribe({
      next: (perfil) => {
        this.aplicarPerfil(perfil);
        this.procesandoCorreo.set(false);
        this.pasoCorreo.set('cerrado');
        this.mensajeCorreo.set({ tipo: 'ok', texto: 'Correo actualizado correctamente' });
      },
      error: (err) => {
        this.procesandoCorreo.set(false);
        this.mensajeCorreo.set({
          tipo: 'error',
          texto: this.extraerMensaje(err, 'No se pudo verificar el código'),
        });
      },
    });
  }

  cambiarClave(): void {
    if (this.formClave.invalid) {
      this.formClave.markAllAsTouched();
      return;
    }

    this.guardandoClave.set(true);
    this.mensajeClave.set(null);

    this.perfilService.cambiarClave(this.formClave.getRawValue()).subscribe({
      next: () => {
        this.guardandoClave.set(false);
        this.mensajeClave.set({
          tipo: 'ok',
          texto: 'Contraseña actualizada. Te redirigimos para que inicies sesión de nuevo',
        });
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 1800);
      },
      error: (err) => {
        this.guardandoClave.set(false);
        this.mensajeClave.set({
          tipo: 'error',
          texto: this.extraerMensaje(err, 'No se pudo cambiar la contraseña'),
        });
      },
    });
  }

  private aplicarPerfil(perfil: Perfil): void {
    this.perfil.set(perfil);
    this.formContacto.reset({
      telefono: perfil.telefono ?? '',
      direccion: perfil.direccion ?? '',
    });
  }



  private extraerMensaje(err: unknown, respaldo: string): string {
    const cuerpo = (err as { error?: unknown } | null)?.error;

    if (typeof cuerpo === 'string' && cuerpo.trim()) return cuerpo;

    const obj = cuerpo as { mensaje?: string; message?: string; error?: string } | null;
    return obj?.mensaje ?? obj?.message ?? obj?.error ?? respaldo;
  }
}
