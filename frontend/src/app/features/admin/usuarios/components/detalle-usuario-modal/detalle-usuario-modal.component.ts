import { Component, computed, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDetalle } from '../../models/usuario.model';

@Component({
  selector: 'app-detalle-usuario-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-usuario-modal.component.html',
})
export class DetalleUsuarioModalComponent {
  private readonly usuarioService = inject(UsuarioService);

  usuarioId = input.required<number>();
  close = output<void>();

  datos = signal<UsuarioDetalle | null>(null);
  cargando = signal<boolean>(false);

  constructor() {
    effect(() => {
      const id = this.usuarioId();
      if (id) {
        this.cargarDetalleUsuario(id);
      }
    });
  }

  private cargarDetalleUsuario(id: number): void {
    this.cargando.set(true);
    this.usuarioService.obtenerPorId(id).subscribe({
      next: (res) => {
        this.datos.set(res);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  iniciales = computed(() => {
    const u = this.datos();
    if (!u || !u.persona) return '';
    const nombre = u.persona.nombre || '';
    const apellidos = u.persona.apellidos || '';
    return `${nombre[0] || ''}${apellidos[0] || ''}`.toUpperCase();
  });

  quickStats = computed(() => {
    const u = this.datos();
    if (!u) return [];
    return [
      { label: 'Tipo', value: u.tipo, icon: 'category' },
      { label: 'Rol', value: u.nombreRol, icon: 'badge' },
      { label: 'Usuario', value: u.usuario, icon: 'account_circle' },
    ];
  });

  contactoInfo = computed(() => {
    const u = this.datos();
    if (!u || !u.persona) return [];
    return [
      { icon: 'mail', value: u.persona.correo },
      { icon: 'phone', value: u.persona.telefono },
    ];
  });

  handleClose(): void {
    this.close.emit();
  }
}
