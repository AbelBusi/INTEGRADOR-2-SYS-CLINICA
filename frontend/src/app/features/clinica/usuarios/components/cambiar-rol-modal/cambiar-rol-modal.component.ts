import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolResumen, UsuarioFila } from '../../interface/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { ToastService } from '../../../../../core/services/toast.service';

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

  roles = signal<RolResumen[]>([]);
  idRol = signal<number | null>(null);
  idRolActual = signal<number | null>(null);
  cargando = signal(false);
  guardando = signal(false);

  rolesDisponibles = computed(() =>
    this.roles().filter((rol) => rol.nombre.trim().toUpperCase() !== 'PACIENTE'),
  );

  hayCambio = computed(() => this.idRol() !== null && this.idRol() !== this.idRolActual());

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargando.set(true);

    this.usuarioService.listarRoles().subscribe({
      next: (response) => {
        const lista = response.object || [];
        this.roles.set(lista);

        const actual = lista.find(
          (rol) => rol.nombre.trim().toUpperCase() === this.usuario?.rol.trim().toUpperCase(),
        );

        this.idRolActual.set(actual?.idRol ?? null);
        this.idRol.set(actual?.idRol ?? null);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los roles.');
        this.cargando.set(false);
        this.onClose();
      },
    });
  }

  guardar(): void {
    const idRol = this.idRol();

    if (!this.usuario || idRol === null || !this.hayCambio() || this.guardando()) {
      return;
    }

    this.guardando.set(true);

    this.usuarioService.cambiarRol(this.usuario.id, idRol).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Rol actualizado con éxito');
        this.guardando.set(false);
        this.rolCambiado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo cambiar el rol.');
        this.guardando.set(false);
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
