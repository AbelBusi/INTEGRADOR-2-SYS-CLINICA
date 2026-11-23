import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { OPCIONES_TIPO_ANTECEDENTE_PERSONAL } from '../../constants/historia-clinica.constants';
import {
  AntecedentePersonal,
  TipoAntecedentePersonal,
} from '../../interface/historia-clinica.interface';
import { AntecedentePersonalService } from '../../services/antecedente-personal.service';
import { mensajeError } from '../../utils/historia-clinica.util';
import { HcModalShellComponent } from '../hc-modal-shell/hc-modal-shell.component';

@Component({
  selector: 'app-hc-antecedente-personal-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HcModalShellComponent],
  templateUrl: './hc-antecedente-personal-form-modal.component.html',
})
export class HcAntecedentePersonalFormModalComponent implements OnInit {
  @Input({ required: true }) idHistoria!: number;
  /** null = crear; con valor = editar. */
  @Input() registro: AntecedentePersonal | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  readonly tipos = OPCIONES_TIPO_ANTECEDENTE_PERSONAL;
  guardando = false;

  form: {
    tipo: TipoAntecedentePersonal | null;
    descripcion: string;
    anio: number | null;
    observacion: string;
  } = { tipo: null, descripcion: '', anio: null, observacion: '' };

  constructor(
    private readonly servicio: AntecedentePersonalService,
    private readonly toastService: ToastService,
  ) {}

  get esEdicion(): boolean {
    return this.registro !== null;
  }

  ngOnInit(): void {
    if (this.registro) {
      this.form = {
        tipo: this.registro.tipo,
        descripcion: this.registro.descripcion,
        anio: this.registro.anio,
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
        'Actualizar antecedente personal',
        '¿Confirmas los cambios en este antecedente? La modificación queda auditada.',
      );
      if (!confirmar) {
        return;
      }
    }

    const dto = {
      tipo: this.form.tipo,
      descripcion,
      anio: this.form.anio ?? null,
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
