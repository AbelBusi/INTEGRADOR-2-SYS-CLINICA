import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecuperarClaveComponent } from '../recuperar-clave/recuperar-clave.component';
import { SeleccionarPerfilComponent } from '../seleccionar-perfil/seleccionar-perfil.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Perfil } from '../../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RecuperarClaveComponent, SeleccionarPerfilComponent],
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {
  onLogin = output<void>();

  private router = inject(Router);
  private authService = inject(AuthService);

  showPass = signal<boolean>(false);
  usuario = signal<string>('');
  claveAcceso = signal<string>('');
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  serverError = signal<string | null>(null);
  recordarme = signal<boolean>(false);
  vista = signal<'login' | 'recuperar' | 'perfil'>('login');

  perfiles = signal<Perfil[]>([]);

  private tokenSeleccion = '';

  stats = signal([
    { label: 'Pacientes', value: '1,240' },
    { label: 'Doctores', value: '38' },
    { label: 'Citas hoy', value: '94' },
  ]);

  constructor() {
    this.cargarUsuarioRecordado();
  }

  private cargarUsuarioRecordado(): void {
    const usuarioGuardado = localStorage.getItem('usuario_recordado');

    if (usuarioGuardado) {
      this.usuario.set(usuarioGuardado);
      this.recordarme.set(true);
    }
  }

  private guardarUsuarioRecordado(): void {
    if (this.recordarme()) {
      localStorage.setItem('usuario_recordado', this.usuario());
    } else {
      localStorage.removeItem('usuario_recordado');
    }
  }

  toggleShowPass(): void {
    this.showPass.update((value) => !value);
  }

  abrirRecuperacion(): void {
    this.error.set(null);
    this.vista.set('recuperar');
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (!this.usuario() || !this.claveAcceso()) {
      this.error.set('Por favor, ingresa tus credenciales.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);
    this.serverError.set(null);

    const credenciales = {
      usuario: this.usuario(),
      claveAcceso: this.claveAcceso(),
    };

    this.authService.login(credenciales).subscribe({
      next: (respuesta) => {
        this.cargando.set(false);
        this.guardarUsuarioRecordado();

        if (
          respuesta.requiere_seleccion_rol &&
          respuesta.token_seleccion &&
          respuesta.perfiles?.length
        ) {
          this.tokenSeleccion = respuesta.token_seleccion;
          this.perfiles.set(respuesta.perfiles);
          this.claveAcceso.set('');
          this.vista.set('perfil');
          return;
        }

        this.finalizarLogin();
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.serverError.set(this.mensajeDeError(err));
      },
    });
  }

  elegirPerfil(idRol: number): void {
    if (this.cargando()) return;

    this.cargando.set(true);
    this.serverError.set(null);

    this.authService.seleccionarRol(this.tokenSeleccion, idRol).subscribe({
      next: () => {
        this.cargando.set(false);
        this.tokenSeleccion = '';
        this.finalizarLogin();
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);

        if (err.status === 401) {
          this.volverAlLogin();
          this.error.set('La selección de perfil expiró. Inicia sesión nuevamente.');
          return;
        }

        this.serverError.set(this.mensajeDeError(err));
      },
    });
  }

  volverAlLogin(): void {
    this.tokenSeleccion = '';
    this.perfiles.set([]);
    this.claveAcceso.set('');
    this.error.set(null);
    this.serverError.set(null);
    this.vista.set('login');
  }

  closeServerError(): void {
    this.serverError.set(null);
  }

  private finalizarLogin(): void {
    this.onLogin.emit();
    this.router.navigate(['/dashboard']);
  }

  private mensajeDeError(err: HttpErrorResponse): string {
    if (err.error?.mensaje) {
      return err.error.mensaje;
    }
    if (err.status === 401 || err.status === 403) {
      return 'Usuario o contraseña incorrectos.';
    }
    if (err.status === 0) {
      return 'No hay conexión con el servidor del backend.';
    }
    return 'Ocurrió un error inesperado en el sistema.';
  }
}
