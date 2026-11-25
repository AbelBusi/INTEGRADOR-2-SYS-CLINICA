import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { AtencionHistoria } from '../../interface/historia-clinica.interface';
import {
  formatearFechaHora,
  textoTipoDiagnostico,
  textoUrgencia,
} from '../../utils/historia-clinica.util';

/**
 * Diagnósticos, tratamientos, indicaciones y derivaciones de una atención. Solo lectura.
 * Lo usan el modal de detalle (médico) y el panel del paciente (despliegue en línea).
 */
@Component({
  selector: 'app-hc-atencion-contenido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hc-atencion-contenido.component.html',
})
export class HcAtencionContenidoComponent {
  @Input({ required: true }) atencion!: AtencionHistoria;

  readonly fechaHoraTexto = formatearFechaHora;
  readonly tipoDiagnostico = textoTipoDiagnostico;
  readonly urgencia = textoUrgencia;
}
