import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { AtencionHistoria } from '../../interface/historia-clinica.interface';
import { formatearFecha, formatearHora } from '../../utils/historia-clinica.util';
import { HcAtencionDetalleModalComponent } from '../hc-atencion-detalle-modal/hc-atencion-detalle-modal.component';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

/**
 * Solo lectura. Las atenciones se registran exclusivamente desde Citas Médicas.
 * Llegan ordenadas de la más reciente a la más antigua (así las entrega el backend).
 */
@Component({
  selector: 'app-hc-atenciones',
  standalone: true,
  imports: [
    CommonModule,
    CustomTableComponent,
    HcSeccionVaciaComponent,
    HcAtencionDetalleModalComponent,
  ],
  templateUrl: './hc-atenciones.component.html',
})
export class HcAtencionesComponent {
  @Input() atenciones: AtencionHistoria[] = [];
  @Input() cargando = false;
  @Input() error: string | null = null;
  @Output() reintentar = new EventEmitter<void>();

  atencionVer = signal<AtencionHistoria | null>(null);

  readonly columns: TableColumn<AtencionHistoria>[] = [
    { header: 'Fecha de atención', field: 'fechaCita', type: 'custom' },
    { header: 'Médico responsable', field: 'medico', type: 'text' },
    { header: 'Especialidad', field: 'especialidad', type: 'text' },
    { header: 'Diagnóstico', field: 'diagnosticos', type: 'custom' },
    { header: 'Acciones', field: 'idCita', type: 'custom', align: 'center' },
  ];

  fecha(a: AtencionHistoria): string {
    return formatearFecha(a.fechaCita);
  }

  horario(a: AtencionHistoria): string {
    const inicio = formatearHora(a.horaInicio);
    const fin = formatearHora(a.horaSalida);
    return inicio && fin ? `${inicio} - ${fin}` : inicio;
  }

  resumenDiagnostico(a: AtencionHistoria): string {
    return a.diagnosticos[0]?.descripcion ?? '';
  }

  diagnosticosExtra(a: AtencionHistoria): number {
    return Math.max(a.diagnosticos.length - 1, 0);
  }
}
