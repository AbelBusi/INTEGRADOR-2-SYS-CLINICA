import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  OPCIONES_FACTOR_RH,
  OPCIONES_GRUPO_SANGUINEO,
} from '../../constants/historia-clinica.constants';
import {
  FactorRh,
  GrupoSanguineo,
  HistoriaClinica,
} from '../../interface/historia-clinica.interface';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { mensajeError } from '../../utils/historia-clinica.util';
import { HcModalShellComponent } from '../hc-modal-shell/hc-modal-shell.component';

/**
 * Doble propósito:
 *  - historia con valor  -> actualiza la información general (PUT).
 *  - historia = null     -> crea la historia clínica del paciente (POST), requiere idPaciente.
 * Todos los campos son opcionales: se permite guardar con información parcial.
 */
@Component({
  selector: 'app-hc-datos-generales-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HcModalShellComponent],
  templateUrl: './hc-datos-generales-form-modal.component.html',
})
export class HcDatosGeneralesFormModalComponent implements OnInit {
  @Input() historia: HistoriaClinica | null = null;
  @Input() idPaciente: number | null = null;
  @Input() nombrePaciente = '';
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardada = new EventEmitter<HistoriaClinica>();
  /** Otro médico modificó la historia mientras esta se editaba (409): el padre debe recargarla. */
  @Output() conflicto = new EventEmitter<void>();

  readonly grupos = OPCIONES_GRUPO_SANGUINEO;
  readonly factores = OPCIONES_FACTOR_RH;
  guardando = false;

  form: {
    grupoSanguineo: GrupoSanguineo | null;
    factorRh: FactorRh | null;
    observaciones: string;
  } = { grupoSanguineo: null, factorRh: null, observaciones: '' };

  constructor(
    private readonly servicio: HistoriaClinicaService,
    private readonly toastService: ToastService,
  ) {}

  get esCreacion(): boolean {
    return this.historia === null;
  }

  get subtitulo(): string {
    return this.historia?.paciente.nombreCompleto ?? this.nombrePaciente;
  }

  ngOnInit(): void {
    if (this.historia) {
      this.form = {
        grupoSanguineo: this.historia.grupoSanguineo,
        factorRh: this.historia.factorRh,
        observaciones: this.historia.observaciones ?? '',
      };
    }
  }

  async onSubmit(): Promise<void> {
    if (this.guardando) {
      return;
    }

    if (this.historia) {
      const confirmar = await this.toastService.confirmar(
        'Actualizar información clínica',
        '¿Confirmas los cambios en la información general de la historia clínica? La modificación queda auditada.',
      );
      if (!confirmar) {
        return;
      }
      this.actualizar(this.historia);
      return;
    }

    if (this.idPaciente === null) {
      this.toastService.error('No se pudo identificar al paciente.');
      return;
    }

    this.crear(this.idPaciente);
  }

  private crear(idPaciente: number): void {
    this.guardando = true;

    this.servicio
      .crear({
        idPaciente,
        grupoSanguineo: this.form.grupoSanguineo,
        factorRh: this.form.factorRh,
        observaciones: this.form.observaciones.trim() || null,
      })
      .subscribe({
        next: (response) =>
          this.alExito(response.mensaje, response.object, 'Historia clínica creada con éxito'),
        error: (error) => this.alFallar(error, 'No se pudo crear la historia clínica'),
      });
  }

  private actualizar(historia: HistoriaClinica): void {
    this.guardando = true;

    // null = sin cambio (el backend conserva el valor); observaciones '' = limpiar el campo.
    this.servicio
      .actualizar(historia.id, {
        grupoSanguineo: this.form.grupoSanguineo,
        factorRh: this.form.factorRh,
        observaciones: this.form.observaciones.trim(),
        version: historia.version,
      })
      .subscribe({
        next: (response) =>
          this.alExito(response.mensaje, response.object, 'Historia clínica actualizada con éxito'),
        error: (error) => this.alFallar(error, 'No se pudo actualizar la historia clínica'),
      });
  }

  private alExito(mensaje: string, historia: HistoriaClinica, porDefecto: string): void {
    this.toastService.success(mensaje || porDefecto);
    this.guardando = false;
    this.guardada.emit(historia);
  }

  private alFallar(error: any, porDefecto: string): void {
    console.error(error);
    this.toastService.error(mensajeError(error, porDefecto));
    this.guardando = false;

    if (error?.status === 409 && this.historia) {
      this.conflicto.emit();
    }
  }
}
