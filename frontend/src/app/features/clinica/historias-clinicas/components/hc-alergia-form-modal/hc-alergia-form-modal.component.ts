import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { OPCIONES_TIPO_ALERGIA } from '../../constants/historia-clinica.constants';
import { Alergia, TipoAlergia } from '../../interface/historia-clinica.interface';
import { AlergiaService } from '../../services/alergia.service';
import { mensajeError } from '../../utils/historia-clinica.util';
import { HcModalShellComponent } from '../hc-modal-shell/hc-modal-shell.component';

@Component({
  selector: 'app-hc-alergia-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HcModalShellComponent],
  templateUrl: './hc-alergia-form-modal.component.html',
})
export class HcAlergiaFormModalComponent implements OnInit {
  @Input({ required: true }) idHistoria!: number;
  @Input() registro: Alergia | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  readonly tipos = OPCIONES_TIPO_ALERGIA;
  guardando = false;

  form: {
    sustancia: string;
    tipoAlergia: TipoAlergia | null;
    reaccion: string;
    observacion: string;
  } = { sustancia: '', tipoAlergia: null, reaccion: '', observacion: '' };

  constructor(
    private readonly servicio: AlergiaService,
    private readonly toastService: ToastService,
  ) {}

  get esEdicion(): boolean {
    return this.registro !== null;
  }

  ngOnInit(): void {
    if (this.registro) {
      this.form = {
        sustancia: this.registro.sustancia,
        tipoAlergia: this.registro.tipoAlergia,
        reaccion: this.registro.reaccion ?? '',
        observacion: this.registro.observacion ?? '',
      };
    }
  }

  async onSubmit(): Promise<void> {
    const sustancia = this.form.sustancia.trim();

    if (!this.form.tipoAlergia || !sustancia || this.guardando) {
      return;
    }

    if (this.esEdicion) {
      const confirmar = await this.toastService.confirmar(
        'Actualizar alergia',
        '¿Confirmas los cambios en esta alergia? La modificación queda auditada.',
      );
      if (!confirmar) {
        return;
      }
    }

    const dto = {
      sustancia,
      tipoAlergia: this.form.tipoAlergia,
      reaccion: this.form.reaccion.trim() || null,
      observacion: this.form.observacion.trim() || null,
    };

    this.guardando = true;

    const peticion = this.registro
      ? this.servicio.actualizar(this.idHistoria, this.registro.id, dto)
      : this.servicio.crear(this.idHistoria, dto);

    peticion.subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Alergia guardada con éxito');
        this.guardando = false;
        this.guardado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(mensajeError(error, 'No se pudo guardar la alergia'));
        this.guardando = false;
      },
    });
  }
}
