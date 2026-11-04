import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitaFila } from '../../interface/cita.interface';
import { ClaveReportePortal } from '../../interface/reporte-medico.interface';
import { gruposPortal } from '../../utils/reporte-medico.util';
import { CalendarioMedicoModalComponent } from '../calendario-medico-modal/calendario-medico-modal.component';
import { ReporteActividadClinicaModalComponent } from '../reporte-actividad-clinica-modal/reporte-actividad-clinica-modal.component';
import { ReporteAgendaMedicoModalComponent } from '../reporte-agenda-medico-modal/reporte-agenda-medico-modal.component';
import { ReporteHorarioModalComponent } from '../reporte-horario-modal/reporte-horario-modal.component';
import { ReportePacienteModalComponent } from '../reporte-paciente-modal/reporte-paciente-modal.component';
import { ReportePendientesModalComponent } from '../reporte-pendientes-modal/reporte-pendientes-modal.component';
import { ReporteProductividadModalComponent } from '../reporte-productividad-modal/reporte-productividad-modal.component';

@Component({
  selector: 'app-reportes-portal-medico',
  standalone: true,
  imports: [
    CommonModule,
    ReporteAgendaMedicoModalComponent,
    CalendarioMedicoModalComponent,
    ReportePendientesModalComponent,
    ReporteProductividadModalComponent,
    ReporteActividadClinicaModalComponent,
    ReportePacienteModalComponent,
    ReporteHorarioModalComponent,
  ],
  templateUrl: './reportes-portal-medico.component.html',
})
export class ReportesPortalMedicoComponent {
  @Input({ required: true }) citas: CitaFila[] = [];
  @Input() idsPendientes: ReadonlySet<number> = new Set<number>();
  @Output() close = new EventEmitter<void>();

  readonly grupos = gruposPortal();

  activo = signal<ClaveReportePortal | null>(null);

  abrir(clave: ClaveReportePortal): void {
    this.activo.set(clave);
  }

  volver(): void {
    this.activo.set(null);
  }
}
