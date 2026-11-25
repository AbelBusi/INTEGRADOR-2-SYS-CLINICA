import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { OPCIONES_TIPO_ALERGIA } from '../../constants/historia-clinica.constants';
import { Alergia } from '../../interface/historia-clinica.interface';
import { etiqueta } from '../../utils/historia-clinica.util';
import { HcPanelSeccionComponent } from '../hc-panel/hc-panel-seccion.component';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

@Component({
  selector: 'app-hc-panel-alergias',
  standalone: true,
  imports: [CommonModule, HcPanelSeccionComponent, HcSeccionVaciaComponent],
  templateUrl: './hc-panel-alergias.component.html',
})
export class HcPanelAlergiasComponent {
  /** true cuando se muestra dentro de un modal (sin tarjeta propia). */
  @Input() sinMarco = false;
  @Input() items: Alergia[] = [];

  tipo(item: Alergia): string {
    return etiqueta(OPCIONES_TIPO_ALERGIA, item.tipoAlergia);
  }
}
