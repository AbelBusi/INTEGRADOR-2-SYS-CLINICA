import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiagnosticoDetalle } from '../../interface/atencion-clinica.interface';
import { etiquetaTipoDiagnostico } from '../../utils/atencion-clinica.util';
import { RegistroClinicoModalComponent } from '../registro-clinico-modal/registro-clinico-modal.component';
import { TratamientoSeccionComponent } from '../tratamiento-seccion/tratamiento-seccion.component';
import { IndicacionSeccionComponent } from '../indicacion-seccion/indicacion-seccion.component';
import { ExamenSeccionComponent } from '../examen-seccion/examen-seccion.component';
import { DerivacionSeccionComponent } from '../derivacion-seccion/derivacion-seccion.component';

type SeccionClinica = 'tratamientos' | 'indicaciones' | 'examenes' | 'derivaciones';

interface ResumenSeccion {
  clave: SeccionClinica;
  titulo: string;
  icono: string;
  total: number;
}

@Component({
  selector: 'app-diagnostico-panel',
  standalone: true,
  imports: [
    CommonModule,
    RegistroClinicoModalComponent,
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
  @Input() soloLectura = false;
  @Output() alternar = new EventEmitter<void>();
  @Output() cambio = new EventEmitter<void>();

  readonly etiquetaTipo = etiquetaTipoDiagnostico;

  seccionAbierta = signal<SeccionClinica | null>(null);

  get secciones(): ResumenSeccion[] {
    return [
      {
        clave: 'tratamientos',
        titulo: 'Tratamientos',
        icono: 'medication',
        total: this.detalle.tratamientos.length,
      },
      {
        clave: 'indicaciones',
        titulo: 'Indicaciones',
        icono: 'fact_check',
        total: this.detalle.indicaciones.length,
      },
      {
        clave: 'examenes',
        titulo: 'Exámenes solicitados',
        icono: 'science',
        total: this.detalle.examenesSolicitados.length,
      },
      {
        clave: 'derivaciones',
        titulo: 'Derivaciones',
        icono: 'call_split',
        total: this.detalle.derivaciones.length,
      },
    ];
  }

  get subtituloModal(): string {
    return `${this.detalle.diagnostico.codigo} · ${this.detalle.diagnostico.descripcion}`;
  }

  abrirSeccion(clave: SeccionClinica): void {
    this.seccionAbierta.set(clave);
  }

  cerrarSeccion(): void {
    this.seccionAbierta.set(null);
  }
}
