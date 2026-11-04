import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  documentoPendientes,
  filasAntiguedad,
  filasPendientes,
  filasPendientesPorMedico,
  tarjetasPendientes,
  textoMedico,
} from '../../utils/reporte-cita-extra.util';
import { fechaIsoTexto, opcionesMedico } from '../../utils/reporte-cita.util';
import { GraficoBarrasCitaComponent } from '../grafico-barras-cita/grafico-barras-cita.component';
import { ReporteCitaBase } from '../reporte-cita-marco/reporte-cita.base';
import { ReporteCitaMarcoComponent } from '../reporte-cita-marco/reporte-cita-marco.component';
import { TarjetasReporteCitaComponent } from '../tarjetas-reporte-cita/tarjetas-reporte-cita.component';

@Component({
  selector: 'app-reporte-pendientes-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReporteCitaMarcoComponent,
    TarjetasReporteCitaComponent,
    GraficoBarrasCitaComponent,
  ],
  templateUrl: './reporte-pendientes-modal.component.html',
})
export class ReportePendientesModalComponent extends ReporteCitaBase {
  readonly fechaIsoTexto = fechaIsoTexto;

  idMedico = signal<number | 'todos'>('todos');

  medicos = computed(() => opcionesMedico(this.fuente()));

  filas = computed(() =>
    filasPendientes(this.fuente(), this.pendientes(), this.idMedico(), new Date()),
  );

  tarjetas = computed(() => tarjetasPendientes(this.filas()));
  filasMedico = computed(() => filasPendientesPorMedico(this.filas()));
  filasAntiguedad = computed(() => filasAntiguedad(this.filas()));

  documento = computed(() =>
    documentoPendientes(this.filas(), textoMedico(this.fuente(), this.idMedico())),
  );

  puedeExportar = computed(() => this.filas().length > 0 && !this.generando());

  exportar(): void {
    void this.generar(this.documento());
  }
}
