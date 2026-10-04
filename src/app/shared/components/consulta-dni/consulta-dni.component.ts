import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatosPersonaReniec, ReniecService } from '../../../core/services/reniec.service';

@Component({
  selector: 'app-consulta-dni',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-dni.component.html',
})
export class ConsultaDniComponent {
  private reniecService = inject(ReniecService);

  @Input() dni = '';
  @Input() label = 'Número de DNI';
  @Input() autoConsultar = true;
  @Output() dniChange = new EventEmitter<string>();
  @Output() datosCargados = new EventEmitter<DatosPersonaReniec>();

  consultando = false;
  mensaje: { type: 'success' | 'error' | 'warning'; text: string } | null = null;

  onDniInput(value: string) {
    const soloDigitos = value.replace(/\D/g, '').slice(0, 8);
    this.dni = soloDigitos;
    this.dniChange.emit(soloDigitos);
    this.mensaje = null;
  }

  onDniBlur() {
    if (this.autoConsultar && this.dni.length === 8) {
      this.consultar();
    }
  }

  consultar() {
    if (!this.dni || this.dni.length !== 8) {
      this.mensaje = { type: 'warning', text: 'El DNI debe tener exactamente 8 dígitos.' };
      return;
    }

    this.consultando = true;
    this.mensaje = null;

    this.reniecService.consultarDni(this.dni).subscribe({
      next: (datos) => {
        this.consultando = false;
        if (datos) {
          this.datosCargados.emit(datos);
          this.mensaje = { type: 'success', text: 'Datos cargados desde RENIEC.' };
        } else {
          this.mensaje = { type: 'error', text: 'No se encontraron registros para el DNI ingresado.' };
        }
      },
      error: () => {
        this.consultando = false;
        this.mensaje = { type: 'error', text: 'Error al conectar con el servicio de RENIEC.' };
      },
    });
  }
}
