import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { filasPacientes } from '../../utils/reporte-cita-extra.util';
import {
  SERIES_ESTADO,
  construirReporte,
  fechaIsoTexto,
  filasPorEstado,
  filasPorPunto,
} from '../../utils/reporte-cita.util';
import {
  documentoProductividad,
  filasPuntualidad,
  resumenPuntualidad,
  tarjetasProductividad,
} from '../../utils/reporte-medico.util';
import { FiltroRangoCitaComponent } from '../filtro-rango-cita/filtro-rango-cita.component';
import { GraficoBarrasCitaComponent } from '../grafico-barras-cita/grafico-barras-cita.component';
import { GraficoColumnasCitaComponent } from '../grafico-columnas-cita/grafico-columnas-cita.component';
import { ReporteCitaBase } from '../reporte-cita-marco/reporte-cita.base';
import { ReporteCitaMarcoComponent } from '../reporte-cita-marco/reporte-cita-marco.component';
import { TarjetasReporteCitaComponent } from '../tarjetas-reporte-cita/tarjetas-reporte-cita.component';

@Component({
  selector: 'app-reporte-productividad-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReporteCitaMarcoComponent,
    FiltroRangoCitaComponent,
    TarjetasReporteCitaComponent,
    GraficoBarrasCitaComponent,
    GraficoColumnasCitaComponent,
  ],
  templateUrl: './reporte-productividad-modal.component.html',
})
export class ReporteProductividadModalComponent extends ReporteCitaBase {
  readonly series = SERIES_ESTADO;
  readonly fechaIsoTexto = fechaIsoTexto;

  medico = computed(() => this.fuente()[0]?.medico ?? 'Médico');

  reporte = computed(() =>
    construirReporte(this.fuente(), this.pendientes(), {
      desde: this.desde(),
      hasta: this.hasta(),
      idMedico: 'todos',
      estado: 'todos',
    }),
  );

  tarjetas = computed(() => tarjetasProductividad(this.reporte().citas));
  graficoEstado = computed(() => filasPorEstado(this.reporte().conteo));
  graficoDia = computed(() => filasPorPunto(this.reporte().porDiaSemana));
  graficoPuntualidad = computed(() => filasPuntualidad(this.reporte().citas));
  puntualidad = computed(() => resumenPuntualidad(this.reporte().citas));
  pacientes = computed(() => filasPacientes(this.reporte().citas).slice(0, 10));
  documento = computed(() => documentoProductividad(this.reporte(), this.medico()));

  puedeExportar = computed(
    () => this.reporte().conteo.total > 0 && !this.rangoInvalido() && !this.generando(),
  );

  exportar(): void {
    void this.generar(this.documento());
  }
}
