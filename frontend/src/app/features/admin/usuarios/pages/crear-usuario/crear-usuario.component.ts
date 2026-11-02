import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import { Rol, UsuarioCrearDTO } from '../../models/usuario.model';
import { PersonaService, PersonaSinCuenta } from '../../../../../core/services/persona.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html',
})
export class CrearUsuarioComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private rolService = inject(RolService);
  private personaService = inject(PersonaService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  roles = signal<Rol[]>([]);
  personas = signal<PersonaSinCuenta[]>([]);
  loading = false;
  isSaving = false;

  form = {
    personaId: 0,
    rolId: 0,
    usuario: '',
    claveAcceso: '',
  };

  ngOnInit(): void {
    this.rolService.listar().subscribe({
      next: (roles) => {
        const activos = roles.filter((r) => r.estado === 1);
        this.roles.set(activos);
        if (activos.length) this.form.rolId = activos[0].id;
      },
    });
    this.personaService.sinCuenta().subscribe({
      next: (personas) => this.personas.set(personas),
    });
  }

  handleSubmit() {
    if (!this.form.personaId || !this.form.usuario || !this.form.claveAcceso || !this.form.rolId) {
      this.toastService.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this.loading = true;

    const dto: UsuarioCrearDTO = {
      persona: { id: this.form.personaId },
      rol: { id: this.form.rolId },
      usuario: this.form.usuario,
      claveAcceso: this.form.claveAcceso,
      estado: 1,
    };

    this.usuarioService.crear(dto).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.isSaving = true;

        const mensajeExito = response?.mensaje || 'Usuario registrado correctamente.';
        this.toastService.success(mensajeExito);

        setTimeout(() => {
          this.router.navigate(['/dashboard/usuarios']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.isSaving = false;
        console.error(err);

        const mensajeError = err.error?.mensaje || 'No se pudo registrar el usuario.';
        this.toastService.error(mensajeError);
      },
    });
  }
}
