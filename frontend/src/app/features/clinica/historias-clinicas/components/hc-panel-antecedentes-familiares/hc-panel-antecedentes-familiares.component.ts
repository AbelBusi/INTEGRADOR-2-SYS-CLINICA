import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import {
  GRUPOS_ANTECEDENTE_FAMILIAR,
  OPCIONES_PARENTESCO,
} from '../../constants/historia-clinica.constants';
import { AntecedenteFamiliar } from '../../interface/historia-clinica.interface';
import { etiqueta } from '../../utils/historia-clinica.util';
import { HcPanelSeccionComponent } from '../hc-panel/hc-panel-seccion.component';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

@Component({
  selector: 'app-hc-panel-antecedentes-familiares',
  standalone: true,
  imports: [CommonModule, HcPanelSeccionComponent, HcSeccionVaciaComponent],
  templateUrl: './hc-panel-antecedentes-familiares.component.html',
})
export class HcPanelAntecedentesFamiliaresComponent {
  @Input() items: AntecedenteFamiliar[] = [];

  get grupos() {
    return GRUPOS_ANTECEDENTE_FAMILIAR.map((g) => ({
      valor: g.valor,
      texto: g.texto,
      items: this.items.filter((i) => i.tipo === g.valor),
    })).filter((g) => g.items.length > 0);
  }

  parentesco(item: AntecedenteFamiliar): string {
    return etiqueta(OPCIONES_PARENTESCO, item.parentesco, 'Sin especificar');
  }
}
