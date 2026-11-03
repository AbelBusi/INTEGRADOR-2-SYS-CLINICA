import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilaGrafico } from '../../interface/reporte-cita.interface';

@Component({
  selector: 'app-grafico-barras-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-barras-cita.component.html',
})
export class GraficoBarrasCitaComponent {
  @Input() set filas(valor: FilaGrafico[]) {
    this.datos.set(valor ?? []);
  }
  @Input() etiquetaVacia = 'Sin datos para mostrar.';

  datos = signal<FilaGrafico[]>([]);
  maximo = computed(() => Math.max(1, ...this.datos().map((fila) => fila.total)));

  ancho(valor: number): number {
    return (valor / this.maximo()) * 100;
  }
}
