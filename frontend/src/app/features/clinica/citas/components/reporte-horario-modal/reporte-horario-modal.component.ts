import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  COLORES_CALOR,
  construirMapaCalor,
  documentoHorario,
  filasPorDia,
  filasPorHora,
  nivelCalor,
  tarjetasHorario,
  textoMedico,
} from '../../utils/reporte-cita-extra.util';
import { SERIES_ESTADO, filtrarCitas, opcionesMedico } from '../../utils/reporte-cita.util';
import { FiltroRangoCitaComponent } from '../filtro-rango-cita/filtro-rango-cita.component';
import { GraficoBarrasCitaComponent } from '../grafico-barras-cita/grafico-barras-cita.component';
import { ReporteCitaBase } from '../reporte-cita-marco/reporte-cita.base';
import { ReporteCitaMarcoComponent } from '../reporte-cita-marco/reporte-cita-marco.component';
import { TarjetasReporteCitaComponent } from '../tarjetas-reporte-cita/tarjetas-reporte-cita.component';

@Component({
  selector: 'app-reporte-horario-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReporteCitaMarcoComponent,
    FiltroRangoCitaComponent,
    TarjetasReporteCitaComponent,
    GraficoBarrasCitaComponent,
  ],
  templateUrl: './reporte-horario-modal.component.html',
})
export class ReporteHorarioModalComponent extends ReporteCitaBase {
  readonly series = SERIES_ESTADO;
  readonly coloresCalor = COLORES_CALOR;

  idMedico = signal<number | 'todos'>('todos');
  soloEfectivas = signal(true);

  medicos = computed(() => opcionesMedico(this.fuente()));

  citasAnalizadas = computed(() =>
    filtrarCitas(this.fuente(), {
      desde: this.desde(),
      hasta: this.hasta(),
      idMedico: this.idMedico(),
      estado: 'todos',
    }).filter((cita) => !this.soloEfectivas() || cita.estado === 1 || cita.estado === 3),
  );

  mapa = computed(() => construirMapaCalor(this.citasAnalizadas()));
  filasHora = computed(() => filasPorHora(this.citasAnalizadas()));
  filasDia = computed(() => filasPorDia(this.citasAnalizadas()));
  tarjetas = computed(() => tarjetasHorario(this.citasAnalizadas()));

  documento = computed(() =>
    documentoHorario({
      citas: this.citasAnalizadas(),
      desde: this.desde(),
      hasta: this.hasta(),
      medico: textoMedico(this.fuente(), this.idMedico()),
      soloEfectivas: this.soloEfectivas(),
    }),
  );

  puedeExportar = computed(
    () => this.citasAnalizadas().length > 0 && !this.rangoInvalido() && !this.generando(),
  );

  colorCalor(valor: number): string {
    return COLORES_CALOR[nivelCalor(valor, this.mapa().maximo)];
  }

  colorTextoCalor(valor: number): string {
    return nivelCalor(valor, this.mapa().maximo) >= 3 ? '#FFFFFF' : '#262626';
  }

  exportar(): void {
    void this.generar(this.documento());
  }
}
