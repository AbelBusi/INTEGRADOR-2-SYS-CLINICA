import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TarjetaReporte } from '../../interface/reporte-cita.interface';

@Component({
  selector: 'app-tarjetas-reporte-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjetas-reporte-cita.component.html',
})
export class TarjetasReporteCitaComponent {
  @Input() tarjetas: TarjetaReporte[] = [];
  @Input() columnas: 4 | 6 = 4;
}
