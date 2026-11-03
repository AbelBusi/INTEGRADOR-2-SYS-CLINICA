import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitaFila } from '../../interface/cita.interface';
import { ClaveReporte } from '../../interface/reporte-cita-extra.interface';
import { DEFINICIONES_REPORTE } from '../../utils/reporte-cita-extra.util';
import { ReporteAgendaModalComponent } from '../reporte-agenda-modal/reporte-agenda-modal.component';
import { ReporteCitasModalComponent } from '../reporte-citas-modal/reporte-citas-modal.component';
import { ReporteHorarioModalComponent } from '../reporte-horario-modal/reporte-horario-modal.component';
import { ReporteMedicoModalComponent } from '../reporte-medico-modal/reporte-medico-modal.component';
import { ReportePacienteModalComponent } from '../reporte-paciente-modal/reporte-paciente-modal.component';
import { ReportePendientesModalComponent } from '../reporte-pendientes-modal/reporte-pendientes-modal.component';

@Component({
  selector: 'app-reportes-citas',
  standalone: true,
  imports: [
    CommonModule,
    ReporteCitasModalComponent,
    ReporteMedicoModalComponent,
    ReportePacienteModalComponent,
    ReporteHorarioModalComponent,
    ReportePendientesModalComponent,
    ReporteAgendaModalComponent,
  ],
  templateUrl: './reportes-citas.component.html',
})
export class ReportesCitasComponent {
  @Input({ required: true }) citas: CitaFila[] = [];
  @Input() idsPendientes: ReadonlySet<number> = new Set<number>();
  @Output() close = new EventEmitter<void>();

  readonly reportes = DEFINICIONES_REPORTE;

  activo = signal<ClaveReporte | null>(null);

  abrir(clave: ClaveReporte): void {
    this.activo.set(clave);
  }

  volver(): void {
    this.activo.set(null);
  }
}
