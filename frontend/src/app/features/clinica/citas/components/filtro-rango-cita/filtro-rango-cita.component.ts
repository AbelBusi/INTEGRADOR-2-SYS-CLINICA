import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CambioRango } from '../../interface/reporte-cita-extra.interface';
import { RangoRapido } from '../../interface/reporte-cita.interface';
import { RANGOS_RAPIDOS, rangoFechas } from '../../utils/reporte-cita.util';

@Component({
  selector: 'app-filtro-rango-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-rango-cita.component.html',
})
export class FiltroRangoCitaComponent {
  @Input() desde = '';
  @Input() hasta = '';
  @Input() rango: RangoRapido = 'mes';
  @Output() cambio = new EventEmitter<CambioRango>();

  readonly rangos = RANGOS_RAPIDOS;

  get invalido(): boolean {
    return !!this.desde && !!this.hasta && this.desde > this.hasta;
  }

  elegir(clave: RangoRapido): void {
    const fechas = rangoFechas(clave);
    this.cambio.emit({ rango: clave, desde: fechas.desde, hasta: fechas.hasta });
  }

  cambiarDesde(valor: string): void {
    this.cambio.emit({ rango: 'personalizado', desde: valor, hasta: this.hasta });
  }

  cambiarHasta(valor: string): void {
    this.cambio.emit({ rango: 'personalizado', desde: this.desde, hasta: valor });
  }
}
