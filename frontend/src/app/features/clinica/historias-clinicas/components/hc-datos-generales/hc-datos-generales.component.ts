import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OPCIONES_FACTOR_RH } from '../../constants/historia-clinica.constants';
import { HistoriaClinica } from '../../interface/historia-clinica.interface';
import {
  calcularEdad,
  camposPendientes,
  etiqueta,
  formatearFecha,
  formatearFechaHora,
  textoGenero,
} from '../../utils/historia-clinica.util';

@Component({
  selector: 'app-hc-datos-generales',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './hc-datos-generales.component.html',
})
export class HcDatosGeneralesComponent {
  @Input({ required: true }) historia!: HistoriaClinica;
  @Input() soloLectura = false;
  @Output() editar = new EventEmitter<void>();

  get pendientes(): string[] {
    return camposPendientes(this.historia);
  }

  get rh(): string {
    return etiqueta(OPCIONES_FACTOR_RH, this.historia.factorRh);
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
    return formatearFechaHora(this.historia.fechaCreacion);
  }

  get actualizada(): string {
    return formatearFechaHora(this.historia.fechaActualizacion);
  }
}
