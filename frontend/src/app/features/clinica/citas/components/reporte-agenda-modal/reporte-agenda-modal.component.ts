import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { infoEstado, OPCIONES_ESTADO } from '../../interface/cita.interface';
import {
  citasDelDia,
  contar,
  documentoAgenda,
  tarjetasAgenda,
  textoEstado,
  textoMedico,
} from '../../utils/reporte-cita-extra.util';
import { fechaIsoTexto, isoLocal, opcionesMedico } from '../../utils/reporte-cita.util';
import { ReporteCitaBase } from '../reporte-cita-marco/reporte-cita.base';
import { ReporteCitaMarcoComponent } from '../reporte-cita-marco/reporte-cita-marco.component';
import { TarjetasReporteCitaComponent } from '../tarjetas-reporte-cita/tarjetas-reporte-cita.component';

@Component({
  selector: 'app-reporte-agenda-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReporteCitaMarcoComponent, TarjetasReporteCitaComponent],
  templateUrl: './reporte-agenda-modal.component.html',
})
export class ReporteAgendaModalComponent extends ReporteCitaBase {
  readonly opcionesEstado = OPCIONES_ESTADO;
  readonly fechaIsoTexto = fechaIsoTexto;

  fecha = signal(isoLocal(new Date()));
  idMedico = signal<number | 'todos'>('todos');
  estado = signal<number | 'todos'>('todos');

  medicos = computed(() => opcionesMedico(this.fuente()));

  citasDia = computed(() =>
    citasDelDia(this.fuente(), this.fecha(), this.idMedico(), this.estado()),
  );
  tarjetas = computed(() => tarjetasAgenda(contar(this.citasDia())));

  documento = computed(() =>
    documentoAgenda({
      citas: this.citasDia(),
      fecha: this.fecha(),
      medico: textoMedico(this.fuente(), this.idMedico()),
      estado: textoEstado(this.estado()),
      pendientes: this.pendientes(),
    }),
  );

  puedeExportar = computed(() => this.citasDia().length > 0 && !!this.fecha() && !this.generando());

  estadoInfo(estado: number) {
    return infoEstado(estado);
  }

  estaPendiente(id: number): boolean {
    return this.pendientes().has(id);
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
