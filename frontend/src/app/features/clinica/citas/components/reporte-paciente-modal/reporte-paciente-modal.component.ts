import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { normalizar } from '../../../horarios/utils/calendario.util';
import { OPCIONES_ESTADO } from '../../interface/cita.interface';
import {
  documentoPaciente,
  filasGraficoPacientes,
  filasPacientes,
  tarjetasPaciente,
  textoEstado,
  textoMedico,
} from '../../utils/reporte-cita-extra.util';
import {
  SERIES_ESTADO,
  fechaIsoTexto,
  filtrarCitas,
  opcionesMedico,
} from '../../utils/reporte-cita.util';
import { FiltroRangoCitaComponent } from '../filtro-rango-cita/filtro-rango-cita.component';
import { GraficoBarrasCitaComponent } from '../grafico-barras-cita/grafico-barras-cita.component';
import { ReporteCitaBase } from '../reporte-cita-marco/reporte-cita.base';
import { ReporteCitaMarcoComponent } from '../reporte-cita-marco/reporte-cita-marco.component';
import { TarjetasReporteCitaComponent } from '../tarjetas-reporte-cita/tarjetas-reporte-cita.component';

@Component({
  selector: 'app-reporte-paciente-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReporteCitaMarcoComponent,
    FiltroRangoCitaComponent,
    TarjetasReporteCitaComponent,
    GraficoBarrasCitaComponent,
  ],
  templateUrl: './reporte-paciente-modal.component.html',
})
export class ReportePacienteModalComponent extends ReporteCitaBase {
  readonly opcionesEstado = OPCIONES_ESTADO;
  readonly series = SERIES_ESTADO;
  readonly fechaIsoTexto = fechaIsoTexto;

  idMedico = signal<number | 'todos'>('todos');
  estado = signal<number | 'todos'>('todos');
  busqueda = signal('');

  medicos = computed(() => opcionesMedico(this.fuente()));

  citasFiltradas = computed(() =>
    filtrarCitas(this.fuente(), {
      desde: this.desde(),
      hasta: this.hasta(),
      idMedico: this.idMedico(),
      estado: this.estado(),
    }),
  );

  filas = computed(() => {
    const termino = normalizar(this.busqueda().trim());
    const todas = filasPacientes(this.citasFiltradas());

    return termino ? todas.filter((fila) => normalizar(fila.paciente).includes(termino)) : todas;
  });

  tarjetas = computed(() => tarjetasPaciente(this.filas()));
  grafico = computed(() => filasGraficoPacientes(this.filas().slice(0, 10)));

  documento = computed(() =>
    documentoPaciente({
      filas: this.filas(),
      desde: this.desde(),
      hasta: this.hasta(),
      medico: textoMedico(this.fuente(), this.idMedico()),
      estado: textoEstado(this.estado()),
      busqueda: this.busqueda(),
    }),
  );

  puedeExportar = computed(
    () => this.filas().length > 0 && !this.rangoInvalido() && !this.generando(),
  );

  exportar(): void {
    void this.generar(this.documento());
  }
}
