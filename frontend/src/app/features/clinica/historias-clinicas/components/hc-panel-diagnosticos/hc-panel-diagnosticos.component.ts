import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AtencionHistoria } from '../../interface/historia-clinica.interface';
import { formatearFecha, textoTipoDiagnostico } from '../../utils/historia-clinica.util';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

interface DiagnosticoVista {
  clave: string;
  codigo: string;
  descripcion: string;
  tipo: string;
  observaciones: string | null;
  fecha: string;
  medico: string;
  especialidad: string;
}

/** Todos los diagnósticos del paciente, de la atención más reciente a la más antigua. */
@Component({
  selector: 'app-hc-panel-diagnosticos',
  standalone: true,
  imports: [CommonModule, HcSeccionVaciaComponent],
  templateUrl: './hc-panel-diagnosticos.component.html',
})
export class HcPanelDiagnosticosComponent {
  @Input() atenciones: AtencionHistoria[] = [];
  @Input() cargando = false;
  @Input() error: string | null = null;
  @Output() reintentar = new EventEmitter<void>();

  todos(): DiagnosticoVista[] {
    return this.atenciones.flatMap((a) =>
      a.diagnosticos.map((dx) => ({
        clave: `${a.idCita}-${dx.id}`,
        codigo: dx.codigo,
        descripcion: dx.descripcion,
        tipo: textoTipoDiagnostico(dx.tipoDiagnostico),
        observaciones: dx.observaciones || null,
        fecha: formatearFecha(a.fechaCita),
        medico: a.medico,
        especialidad: a.especialidad,
      })),
    );
  }
}
