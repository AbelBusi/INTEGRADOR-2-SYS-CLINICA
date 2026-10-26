import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Cita, CitaDTO, MensajeResponse } from '../../interface/cita.interface';
import { CitaFormularioBase } from '../cita-form-modal/cita-formulario.base';
import { CitaFormularioComponent } from '../cita-form-modal/cita-formulario.component';

@Component({
  selector: 'app-cita-crear-modal',
  standalone: true,
  imports: [CommonModule, CitaFormularioComponent],
  templateUrl: './cita-crear-modal.component.html',
})
export class CitaCrearModalComponent extends CitaFormularioBase implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<Cita>();

  protected readonly mensajeExito = 'Cita registrada con éxito';

  ngOnInit(): void {
    this.iniciar();
  }

  protected idCitaExcluida(): number | null {
    return null;
  }

  protected enviar(dto: CitaDTO): Observable<MensajeResponse<Cita>> {
    return this.citaService.crear(dto);
  }

  protected alGuardar(cita: Cita): void {
    this.guardado.emit(cita);
  }

  onClose(): void {
    if (!this.guardando()) {
      this.close.emit();
    }
  }
}
