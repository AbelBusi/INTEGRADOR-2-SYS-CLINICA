import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { DescansoVerificacionModalComponent } from '../../../../../shared/documentos-clinicos/components/descanso-verificacion-modal/descanso-verificacion-modal.component';
import { DescansoMedico } from '../../../../../shared/documentos-clinicos/interface/descanso-medico.interface';
import { DescansoMedicoService } from '../../../../../shared/documentos-clinicos/services/descanso-medico.service';
import {
  formatearFecha,
  mensajeError,
  textoDias,
} from '../../../../../shared/documentos-clinicos/utils/descanso-medico.util';

@Component({
  selector: 'app-descanso-cancelar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DescansoVerificacionModalComponent],
  templateUrl: './descanso-cancelar-modal.component.html',
})
export class DescansoCancelarModalComponent {
  @Input({ required: true }) descanso!: DescansoMedico;
  @Output() close = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<DescansoMedico>();

  private readonly service = inject(DescansoMedicoService);
  private readonly toast = inject(ToastService);

  readonly limiteMotivo = 500;
  readonly formatearFecha = formatearFecha;
  readonly textoDias = textoDias;

  motivo = signal('');
  intentado = signal(false);
  verificando = signal(false);
  procesando = signal(false);
  errorVerificacion = signal<string | null>(null);
  errorGeneral = signal<string | null>(null);

  get motivoInvalido(): boolean {
    return !this.motivo().trim();
  }

  solicitar(): void {
    this.intentado.set(true);
    this.errorGeneral.set(null);

    if (this.motivoInvalido) {
      return;
    }

    this.errorVerificacion.set(null);
    this.verificando.set(true);
  }

  cancelarVerificacion(): void {
    if (!this.procesando()) {
      this.verificando.set(false);
    }
  }

  confirmar(codigo: string): void {
    if (this.procesando()) {
      return;
    }

    this.procesando.set(true);
    this.errorVerificacion.set(null);

    this.service
      .cancelar(this.descanso.id, { motivo: this.motivo().trim(), codigoVerificacion: codigo })
      .subscribe({
        next: (response) => {
          this.procesando.set(false);
          this.verificando.set(false);
          this.toast.success(response?.mensaje || 'Descanso médico cancelado con éxito');
          this.cancelado.emit(response.object as DescansoMedico);
        },
        error: (error) => {
          this.procesando.set(false);
          const mensaje = mensajeError(error, 'No se pudo cancelar el descanso médico.');

          if (error?.status === 400) {
            this.errorVerificacion.set(mensaje);
            return;
          }

          this.verificando.set(false);
          this.errorGeneral.set(mensaje);
        },
      });
  }

  cerrar(): void {
    if (!this.procesando()) {
      this.close.emit();
    }
  }
}
