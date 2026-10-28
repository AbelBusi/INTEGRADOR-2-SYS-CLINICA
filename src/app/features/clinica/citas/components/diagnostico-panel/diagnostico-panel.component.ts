import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiagnosticoDetalle } from '../../interface/atencion-clinica.interface';
import { etiquetaTipoDiagnostico } from '../../utils/atencion-clinica.util';
import { TratamientoSeccionComponent } from '../tratamiento-seccion/tratamiento-seccion.component';
import { IndicacionSeccionComponent } from '../indicacion-seccion/indicacion-seccion.component';
import { ExamenSeccionComponent } from '../examen-seccion/examen-seccion.component';
import { DerivacionSeccionComponent } from '../derivacion-seccion/derivacion-seccion.component';

@Component({
  selector: 'app-diagnostico-panel',
  standalone: true,
  imports: [
    CommonModule,
    TratamientoSeccionComponent,
    IndicacionSeccionComponent,
    ExamenSeccionComponent,
    DerivacionSeccionComponent,
  ],
  templateUrl: './diagnostico-panel.component.html',
})
export class DiagnosticoPanelComponent {
  @Input({ required: true }) detalle!: DiagnosticoDetalle;
  @Input() expandido = false;
  @Output() alternar = new EventEmitter<void>();
  @Output() cambio = new EventEmitter<void>();

  readonly etiquetaTipo = etiquetaTipoDiagnostico;
}
