import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuntoReporte } from '../../interface/reporte-cita.interface';
import { SERIES_ESTADO, maximoRedondeado } from '../../utils/reporte-cita.util';

@Component({
  selector: 'app-grafico-columnas-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-columnas-cita.component.html',
})
export class GraficoColumnasCitaComponent {
  @Input() set puntos(valor: PuntoReporte[]) {
    this.datos.set(valor ?? []);
  }
  @Input() altura = 176;
  @Input() etiquetaVacia = 'Sin datos para mostrar.';

  readonly series = SERIES_ESTADO;

  datos = signal<PuntoReporte[]>([]);
  maximo = computed(() =>
    maximoRedondeado(Math.max(0, ...this.datos().map((punto) => punto.conteo.total))),
  );

  altoColumna(total: number): number {
    return (total / this.maximo()) * 100;
  }
}
