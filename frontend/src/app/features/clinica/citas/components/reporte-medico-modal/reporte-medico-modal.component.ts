import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { infoEstado, OPCIONES_ESTADO } from '../../interface/cita.interface';
import { documentoMedico, filasPacientes } from '../../utils/reporte-cita-extra.util';
import {
  SERIES_ESTADO,
  construirReporte,
  fechaIsoTexto,
  filasPorEstado,
  filasPorPunto,
  opcionesMedico,
  tarjetasReporte,
} from '../../utils/reporte-cita.util';
import { FiltroRangoCitaComponent } from '../filtro-rango-cita/filtro-rango-cita.component';
import { GraficoBarrasCitaComponent } from '../grafico-barras-cita/grafico-barras-cita.component';
import { GraficoColumnasCitaComponent } from '../grafico-columnas-cita/grafico-columnas-cita.component';
import { ReporteCitaBase } from '../reporte-cita-marco/reporte-cita.base';
import { ReporteCitaMarcoComponent } from '../reporte-cita-marco/reporte-cita-marco.component';
import { TarjetasReporteCitaComponent } from '../tarjetas-reporte-cita/tarjetas-reporte-cita.component';

@Component({
  selector: 'app-reporte-medico-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReporteCitaMarcoComponent,
    FiltroRangoCitaComponent,
    TarjetasReporteCitaComponent,
    GraficoBarrasCitaComponent,
    GraficoColumnasCitaComponent,
  ],
  templateUrl: './reporte-medico-modal.component.html',
})
export class ReporteMedicoModalComponent extends ReporteCitaBase {
  readonly opcionesEstado = OPCIONES_ESTADO;
  readonly series = SERIES_ESTADO;
  readonly fechaIsoTexto = fechaIsoTexto;

  idMedicoSel = signal<number | null>(null);
  estado = signal<number | 'todos'>('todos');
  incluirDetalle = signal(false);

  medicos = computed(() => opcionesMedico(this.fuente()));
  idMedico = computed(() => this.idMedicoSel() ?? this.medicos()[0]?.idMedico ?? null);

  reporte = computed(() => {
    const idMedico = this.idMedico();

    return idMedico === null
      ? null
      : construirReporte(this.fuente(), this.pendientes(), {
          desde: this.desde(),
          hasta: this.hasta(),
          idMedico,
          estado: this.estado(),
        });
  });

  tarjetas = computed(() => {
    const reporte = this.reporte();
    return reporte ? tarjetasReporte(reporte) : [];
  });
  filasEstado = computed(() => {
    const reporte = this.reporte();
    return reporte ? filasPorEstado(reporte.conteo) : [];
  });
  filasDia = computed(() => {
    const reporte = this.reporte();
    return reporte ? filasPorPunto(reporte.porDiaSemana) : [];
  });
  pacientes = computed(() => {
    const reporte = this.reporte();
    return reporte ? filasPacientes(reporte.citas).slice(0, 10) : [];
  });
  documento = computed(() => {
    const reporte = this.reporte();
    return reporte ? documentoMedico(reporte, this.incluirDetalle()) : null;
  });

  puedeExportar = computed(
    () => (this.reporte()?.conteo.total ?? 0) > 0 && !this.rangoInvalido() && !this.generando(),
  );

  estadoInfo(estado: number) {
    return infoEstado(estado);
  }

  exportar(): void {
    void this.generar(this.documento());
  }
}
