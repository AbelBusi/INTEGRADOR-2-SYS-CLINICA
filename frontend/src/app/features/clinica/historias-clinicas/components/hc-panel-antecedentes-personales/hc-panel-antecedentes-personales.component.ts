import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { GRUPOS_ANTECEDENTE_PERSONAL } from '../../constants/historia-clinica.constants';
import { AntecedentePersonal } from '../../interface/historia-clinica.interface';
import { HcPanelSeccionComponent } from '../hc-panel/hc-panel-seccion.component';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

@Component({
  selector: 'app-hc-panel-antecedentes-personales',
  standalone: true,
  imports: [CommonModule, HcPanelSeccionComponent, HcSeccionVaciaComponent],
  templateUrl: './hc-panel-antecedentes-personales.component.html',
})
export class HcPanelAntecedentesPersonalesComponent {
  /** true cuando se muestra dentro de un modal (sin tarjeta propia). */
  @Input() sinMarco = false;
  @Input() items: AntecedentePersonal[] = [];

  /** Agrupados por tipo, en el orden clínico habitual; dentro de cada grupo, del año más reciente al más antiguo. */
  get grupos() {
    return GRUPOS_ANTECEDENTE_PERSONAL.map((g) => ({
      valor: g.valor,
      texto: g.texto,
      items: this.items
        .filter((i) => i.tipo === g.valor)
        .sort((a, b) => (b.anio ?? 0) - (a.anio ?? 0)),
    })).filter((g) => g.items.length > 0);
  }
}
