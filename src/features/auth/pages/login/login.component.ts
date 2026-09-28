import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {
  onLogin = output<void>();

  private router = inject(Router);
  private authService = inject(AuthService); // Inyectamos el servicio de autenticación

  showPass = signal<boolean>(false);
  usuario = signal<string>('');
  claveAcceso = signal<string>('');
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  serverError = signal<string | null>(null);

  stats = signal([
    { label: 'Pacientes', value: '1,240' },
    { label: 'Doctores', value: '38' },
    { label: 'Citas hoy', value: '94' },
  ]);

  toggleShowPass(): void {
    this.showPass.update((value) => !value);
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
      next: (response) => {
        this.cargando.set(false);
        this.onLogin.emit();
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);

        if (err.error?.mensaje) {
          this.serverError.set(err.error.mensaje);
        } else if (err.status === 401 || err.status === 403) {
          this.serverError.set('Usuario o contraseña incorrectos.');
        } else if (err.status === 0) {
          this.serverError.set('No hay conexión con el servidor del backend.');
        } else {
          this.serverError.set('Ocurrió un error inesperado en el sistema.');
        }
      },
    });
  }

  closeServerError(): void {
    this.serverError.set(null);
  }
}
