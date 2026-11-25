import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { AtencionHistoria } from '../../interface/historia-clinica.interface';
import { formatearFecha } from '../../utils/historia-clinica.util';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

interface TratamientoVista {
  clave: string;
  medicamento: string;
  detalles: { etiqueta: string; valor: string }[];
  indicacion: string | null;
  diagnostico: string;
  fecha: string;
  medico: string;
}

/** Todos los medicamentos recetados al paciente, de la atención más reciente a la más antigua. */
@Component({
  selector: 'app-hc-panel-tratamientos',
  standalone: true,
  imports: [CommonModule, HcSeccionVaciaComponent],
  templateUrl: './hc-panel-tratamientos.component.html',
})
export class HcPanelTratamientosComponent {
  @Input() atenciones: AtencionHistoria[] = [];
  @Input() cargando = false;
  @Input() error: string | null = null;
  @Output() reintentar = new EventEmitter<void>();

  busqueda = signal('');

  todos(): TratamientoVista[] {
    const lista: TratamientoVista[] = [];
    for (const a of this.atenciones) {
      for (const dx of a.diagnosticos) {
        for (const t of dx.tratamientos) {
          const detalles: { etiqueta: string; valor: string }[] = [];
          if (t.dosis) detalles.push({ etiqueta: 'Dosis', valor: t.dosis });
          if (t.viaAdministracion) detalles.push({ etiqueta: 'Vía', valor: t.viaAdministracion });
          if (t.frecuencia) detalles.push({ etiqueta: 'Frecuencia', valor: t.frecuencia });
          if (t.duracionDias) detalles.push({ etiqueta: 'Duración', valor: `${t.duracionDias} días` });
          if (t.cantidadTotal) detalles.push({ etiqueta: 'Cantidad', valor: `${t.cantidadTotal}` });
          lista.push({
            clave: `${a.idCita}-${dx.id}-${t.id}`,
            medicamento: t.nombreMedicamento,
            detalles,
            indicacion: t.indicacion || null,
            diagnostico: dx.descripcion,
            fecha: formatearFecha(a.fechaCita),
            medico: a.medico,
          });
        }
      }
    }
    return lista;
  }

  filtrados(): TratamientoVista[] {
    const q = this.busqueda().trim().toLowerCase();
    const todos = this.todos();
    return q
      ? todos.filter((t) => `${t.medicamento} ${t.diagnostico}`.toLowerCase().includes(q))
      : todos;
  }

  alBuscar(evento: Event): void {
    this.busqueda.set((evento.target as HTMLInputElement).value);
  }
}
