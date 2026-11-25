import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Contenedor común de cada sección del panel de la historia clínica del paciente.
 * Cabecera con icono, título y contador; el contenido va en <ng-content>.
 */
@Component({
  selector: 'app-hc-panel-seccion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hc-panel-seccion.component.html',
})
export class HcPanelSeccionComponent {
  /** Id del elemento, usado por el índice lateral para desplazarse a la sección. */
  @Input({ required: true }) anclaId!: string;
  @Input({ required: true }) titulo!: string;
  @Input() descripcion = '';
  @Input() icono = 'assignment';
  @Input() contador: number | null = null;
  /** true = solo el contenido, sin tarjeta ni cabecera (cuando ya va dentro de un modal). */
  @Input() sinMarco = false;
}
