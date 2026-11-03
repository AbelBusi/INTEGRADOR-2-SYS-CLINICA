import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatoReporte } from '../../interface/reporte-cita.interface';

@Component({
  selector: 'app-reporte-cita-marco',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-cita-marco.component.html',
})
export class ReporteCitaMarcoComponent {
  @Input({ required: true }) titulo!: string;
  @Input() subtitulo = '';
  @Input() icono = 'bar_chart';
  @Input() formato: FormatoReporte = 'pdf';
  @Input() generando = false;
  @Input() puedeExportar = false;
  @Input() error: string | null = null;

  @Output() formatoChange = new EventEmitter<FormatoReporte>();
  @Output() exportar = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  readonly formatos: { valor: FormatoReporte; texto: string; icono: string }[] = [
    { valor: 'pdf', texto: 'PDF', icono: 'picture_as_pdf' },
    { valor: 'csv', texto: 'CSV', icono: 'table_view' },
  ];

  cerrar(): void {
    if (!this.generando) {
      this.close.emit();
    }
  }
}
