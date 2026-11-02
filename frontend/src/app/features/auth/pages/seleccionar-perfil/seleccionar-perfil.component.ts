import { Component, computed, input, output } from '@angular/core';
import { Perfil } from '../../models/auth.models';

@Component({
  selector: 'app-seleccionar-perfil',
  standalone: true,
  templateUrl: './seleccionar-perfil.component.html',
  styles: [],
})
export class SeleccionarPerfilComponent {
  usuario = input.required<string>();
  perfiles = input.required<Perfil[]>();
  cargando = input<boolean>(false);

  elegir = output<number>();
  volver = output<void>();

  inicial = computed(() => this.usuario().trim().charAt(0).toUpperCase());

  private readonly iconos: Record<string, string> = {
    ADMINISTRADOR: 'admin_panel_settings',
    ADMIN: 'admin_panel_settings',
    MEDICO: 'stethoscope',
    DOCTOR: 'stethoscope',
    ENFERMERO: 'vaccines',
    ENFERMERA: 'vaccines',
    OBSTETRA: 'pregnant_woman',
    RECEPCIONISTA: 'support_agent',
    RECEPCION: 'support_agent',
    CAJERO: 'point_of_sale',
    LABORATORIO: 'biotech',
    FARMACIA: 'medication',
  };

  icono(nombre: string): string {
    return this.iconos[this.normalizar(nombre)] ?? 'badge';
  }

  titulo(nombre: string): string {
    const limpio = nombre.trim();
    return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
  }

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toUpperCase();
  }
}
