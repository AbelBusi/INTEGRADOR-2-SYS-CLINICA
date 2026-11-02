import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolAdminService } from '../../services/rol-admin.service';
import { Rol } from '../../models/rol.model';
import { CrearRolModalComponent } from '../../components/crear-rol-modal/crear-rol-modal.component';
import { EditarRolModalComponent } from '../../components/editar-rol-modal/editar-rol-modal.component';

@Component({
  selector: 'app-lista-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, CrearRolModalComponent, EditarRolModalComponent],
  templateUrl: './lista-roles.component.html',
})
export class ListaRolesComponent implements OnInit {
  private rolService = inject(RolAdminService);

  roles = signal<Rol[]>([]);
  cargando = signal(true);
  search = signal('');
  isCrearOpen = signal(false);
  rolEditar = signal<Rol | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.rolService.listar().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  filtered(): Rol[] {
    const q = this.search().toLowerCase();
    return this.roles().filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) || r.descripcion.toLowerCase().includes(q),
    );
  }

  eliminar(id: number): void {
    if (!confirm('¿Desactivar este rol?')) return;
    this.rolService.eliminar(id).subscribe({ next: () => this.cargar() });
  }

  abrirEditar(rol: Rol): void {
    this.rolEditar.set(rol);
  }

  cerrarEditar(): void {
    this.rolEditar.set(null);
  }
}
