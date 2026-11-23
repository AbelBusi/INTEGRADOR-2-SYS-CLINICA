import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Contenedor común de los modales del módulo. Reproduce el patrón visual de los modales
 * existentes (cabecera #58595B, franja bicolor, cuerpo blanco) para no repetir el marcado.
 *
 * Contenido: <ng-content>. Pie opcional: elemento con el atributo `hc-footer`.
 */
@Component({
  selector: 'app-hc-modal-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hc-modal-shell.component.html',
})
export class HcModalShellComponent {
  @Input({ required: true }) titulo!: string;
  @Input() subtitulo = '';
  @Input() icono = 'assignment';
  /** Clase Tailwind de ancho máximo (ej. 'max-w-md', 'max-w-5xl'). */
  @Input() ancho = 'max-w-md';
  /** true para modales abiertos encima de otro modal. */
  @Input() elevado = false;
  @Output() cerrar = new EventEmitter<void>();
}
