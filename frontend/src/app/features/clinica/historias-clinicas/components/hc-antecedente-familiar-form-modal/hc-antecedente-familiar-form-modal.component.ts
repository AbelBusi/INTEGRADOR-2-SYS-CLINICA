import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  OPCIONES_PARENTESCO,
  OPCIONES_TIPO_ANTECEDENTE_FAMILIAR,
} from '../../constants/historia-clinica.constants';
import {
  AntecedenteFamiliar,
  Parentesco,
  TipoAntecedenteFamiliar,
} from '../../interface/historia-clinica.interface';
import { AntecedenteFamiliarService } from '../../services/antecedente-familiar.service';
import { mensajeError } from '../../utils/historia-clinica.util';
import { HcModalShellComponent } from '../hc-modal-shell/hc-modal-shell.component';

@Component({
  selector: 'app-hc-antecedente-familiar-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HcModalShellComponent],
  templateUrl: './hc-antecedente-familiar-form-modal.component.html',
})
export class HcAntecedenteFamiliarFormModalComponent implements OnInit {
  @Input({ required: true }) idHistoria!: number;
  @Input() registro: AntecedenteFamiliar | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  readonly tipos = OPCIONES_TIPO_ANTECEDENTE_FAMILIAR;
  readonly parentescos = OPCIONES_PARENTESCO;
  guardando = false;

  form: {
    tipo: TipoAntecedenteFamiliar | null;
    parentesco: Parentesco | null;
    descripcion: string;
    observacion: string;
  } = { tipo: null, parentesco: null, descripcion: '', observacion: '' };

  constructor(
    private readonly servicio: AntecedenteFamiliarService,
    private readonly toastService: ToastService,
  ) {}

  get esEdicion(): boolean {
    return this.registro !== null;
  }

  ngOnInit(): void {
    if (this.registro) {
      this.form = {
        tipo: this.registro.tipo,
        parentesco: this.registro.parentesco,
        descripcion: this.registro.descripcion,
        observacion: this.registro.observacion ?? '',
      };
    }
  }

  async onSubmit(): Promise<void> {
    const descripcion = this.form.descripcion.trim();

    if (!this.form.tipo || !descripcion || this.guardando) {
      return;
    }

    if (this.esEdicion) {
      const confirmar = await this.toastService.confirmar(
        'Actualizar antecedente familiar',
        '¿Confirmas los cambios en este antecedente? La modificación queda auditada.',
      );
      if (!confirmar) {
        return;
      }
    }

    const dto = {
      tipo: this.form.tipo,
      parentesco: this.form.parentesco,
      descripcion,
      observacion: this.form.observacion.trim() || null,
    };

    this.guardando = true;

    const peticion = this.registro
      ? this.servicio.actualizar(this.idHistoria, this.registro.id, dto)
      : this.servicio.crear(this.idHistoria, dto);

    peticion.subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Antecedente guardado con éxito');
        this.guardando = false;
        this.guardado.emit();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(mensajeError(error, 'No se pudo guardar el antecedente'));
        this.guardando = false;
      },
    });
  }
}
