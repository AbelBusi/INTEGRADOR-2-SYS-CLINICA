import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AtencionHistoria } from '../../interface/historia-clinica.interface';
import { formatearFecha, formatearHora } from '../../utils/historia-clinica.util';
import { HcAtencionContenidoComponent } from '../hc-atencion-contenido/hc-atencion-contenido.component';
import { HcModalShellComponent } from '../hc-modal-shell/hc-modal-shell.component';

/** Detalle de una atención. Solo lectura: no expone ninguna acción de edición. */
@Component({
  selector: 'app-hc-atencion-detalle-modal',
  standalone: true,
  imports: [CommonModule, HcModalShellComponent, HcAtencionContenidoComponent],
  templateUrl: './hc-atencion-detalle-modal.component.html',
})
export class HcAtencionDetalleModalComponent {
  @Input({ required: true }) atencion!: AtencionHistoria;
  @Output() cerrar = new EventEmitter<void>();

  readonly fechaTexto = formatearFecha;

  get horario(): string {
    const inicio = formatearHora(this.atencion.horaInicio);
    const fin = formatearHora(this.atencion.horaSalida);
    return inicio && fin ? `${inicio} - ${fin}` : inicio;
  }

  get subtitulo(): string {
    return `${formatearFecha(this.atencion.fechaCita)} · ${this.atencion.medico}`;
  }
}
