import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { infoEstado } from '../../interface/cita.interface';
import { MarcaAgenda } from '../../interface/reporte-medico.interface';
import { citasDelDia, filasPorHora } from '../../utils/reporte-cita-extra.util';
import { SERIES_ESTADO, fechaIsoTexto, isoLocal } from '../../utils/reporte-cita.util';
import {
  documentoAgendaMedico,
  marcasAgenda,
  tarjetasAgendaMedico,
  textoMarca,
} from '../../utils/reporte-medico.util';
import { GraficoBarrasCitaComponent } from '../grafico-barras-cita/grafico-barras-cita.component';
import { ReporteCitaBase } from '../reporte-cita-marco/reporte-cita.base';
import { ReporteCitaMarcoComponent } from '../reporte-cita-marco/reporte-cita-marco.component';
import { TarjetasReporteCitaComponent } from '../tarjetas-reporte-cita/tarjetas-reporte-cita.component';

@Component({
  selector: 'app-reporte-agenda-medico-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReporteCitaMarcoComponent,
    TarjetasReporteCitaComponent,
    GraficoBarrasCitaComponent,
  ],
  templateUrl: './reporte-agenda-medico-modal.component.html',
})
export class ReporteAgendaMedicoModalComponent extends ReporteCitaBase {
  readonly series = SERIES_ESTADO;
  readonly fechaIsoTexto = fechaIsoTexto;
  readonly textoMarca = textoMarca;

  fecha = signal(isoLocal(new Date()));
  incluirNoEfectivas = signal(false);
  ahora = signal(new Date());

  medico = computed(() => this.fuente()[0]?.medico ?? 'Médico');

  citasDia = computed(() =>
    this.fecha()
      ? citasDelDia(this.fuente(), this.fecha(), 'todos', 'todos').filter(
          (cita) => this.incluirNoEfectivas() || cita.estado === 1 || cita.estado === 3,
        )
      : [],
  );

  marcas = computed(() => marcasAgenda(this.citasDia(), this.pendientes(), this.ahora()));
  tarjetas = computed(() => tarjetasAgendaMedico(this.citasDia(), this.marcas()));
  filasHora = computed(() => filasPorHora(this.citasDia()));
  esHoy = computed(() => this.fecha() === isoLocal(this.ahora()));

  siguiente = computed(
    () =>
      this.citasDia().find((cita) => this.marcas().get(cita.id) === 'en_curso') ??
      this.citasDia().find((cita) => this.marcas().get(cita.id) === 'siguiente') ??
      null,
  );

  documento = computed(() =>
    documentoAgendaMedico({
      citas: this.citasDia(),
      fecha: this.fecha(),
      medico: this.medico(),
      marcas: this.marcas(),
      pendientes: this.pendientes(),
    }),
  );

  puedeExportar = computed(() => this.citasDia().length > 0 && !this.generando());

  estadoInfo(estado: number) {
    return infoEstado(estado);
  }

  marcaDe(id: number): MarcaAgenda | null {
    return this.marcas().get(id) ?? null;
  }

  desplazar(dias: number): void {
    const [anio, mes, dia] = (this.fecha() || isoLocal(new Date())).split('-').map(Number);
    this.fecha.set(isoLocal(new Date(anio, mes - 1, dia + dias)));
  }

  irAHoy(): void {
    this.fecha.set(isoLocal(new Date()));
  }

  exportar(): void {
    void this.generar(this.documento());
  }
}
