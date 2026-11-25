import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { AtencionHistoria } from '../../interface/historia-clinica.interface';
import { formatearFecha, formatearHora } from '../../utils/historia-clinica.util';
import { HcAtencionContenidoComponent } from '../hc-atencion-contenido/hc-atencion-contenido.component';
import { HcPanelSeccionComponent } from '../hc-panel/hc-panel-seccion.component';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

const POR_BLOQUE = 5;

/**
 * Atenciones médicas del paciente en línea de tiempo, de la más reciente a la más antigua.
 * Solo lectura: las atenciones se registran únicamente desde Citas Médicas.
 */
@Component({
  selector: 'app-hc-panel-atenciones',
  standalone: true,
  imports: [
    CommonModule,
    HcPanelSeccionComponent,
    HcSeccionVaciaComponent,
    HcAtencionContenidoComponent,
  ],
  templateUrl: './hc-panel-atenciones.component.html',
})
export class HcPanelAtencionesComponent {
  @Input() atenciones: AtencionHistoria[] = [];
  @Input() cargando = false;
  @Input() error: string | null = null;
  @Output() reintentar = new EventEmitter<void>();

  readonly porBloque = POR_BLOQUE;

  visibles = signal(POR_BLOQUE);
  private abiertas = signal<ReadonlySet<number>>(new Set());

  lista(): AtencionHistoria[] {
    return this.atenciones.slice(0, this.visibles());
  }

  restantes(): number {
    return Math.max(this.atenciones.length - this.visibles(), 0);
  }

  mostrarMas(): void {
    this.visibles.update((n) => n + POR_BLOQUE);
  }

  estaAbierta(idCita: number): boolean {
    return this.abiertas().has(idCita);
  }

  alternar(idCita: number): void {
    const siguiente = new Set(this.abiertas());
    if (!siguiente.delete(idCita)) {
      siguiente.add(idCita);
    }
    this.abiertas.set(siguiente);
  }

  fecha(a: AtencionHistoria): string {
    return formatearFecha(a.fechaCita);
  }

  horario(a: AtencionHistoria): string {
    const inicio = formatearHora(a.horaInicio);
    const fin = formatearHora(a.horaSalida);
    return inicio && fin ? `${inicio} - ${fin}` : inicio;
  }

  resumenDiagnostico(a: AtencionHistoria): string {
    const dx = a.diagnosticos[0];
    if (!dx) {
      return '';
    }
    const extra = a.diagnosticos.length - 1;
    return `${dx.codigo} · ${dx.descripcion}${extra > 0 ? ` (+${extra} más)` : ''}`;
  }
}
