import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { HistoriaClinica } from '../../interface/historia-clinica.interface';
import {
  calcularEdad,
  formatearFecha,
  formatearFechaHora,
  grupoConRh,
  textoGenero,
} from '../../utils/historia-clinica.util';

/** Carátula del panel: identificación del paciente, grupo sanguíneo y observaciones generales. */
@Component({
  selector: 'app-hc-panel-caratula',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hc-panel-caratula.component.html',
})
export class HcPanelCaratulaComponent {
  @Input({ required: true }) historia!: HistoriaClinica;

  /** 'O+' cuando están el grupo y el Rh; vacío si falta alguno. */
  get grupoCompleto(): string {
    return grupoConRh(this.historia.grupoSanguineo, this.historia.factorRh);
  }

  get fechaNacimiento(): string {
    return formatearFecha(this.historia.paciente.fechaNacimiento);
  }

  get edad(): string {
    return calcularEdad(this.historia.paciente.fechaNacimiento);
  }

  get sexo(): string {
    return textoGenero(this.historia.paciente.genero);
  }

  get creada(): string {
    return formatearFecha(this.historia.fechaCreacion);
  }

  get actualizada(): string {
    return formatearFechaHora(this.historia.fechaActualizacion);
  }
}
