import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';

import { ToastService } from '../../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import {
  OPCIONES_PARENTESCO,
  OPCIONES_TIPO_ANTECEDENTE_FAMILIAR,
} from '../../constants/historia-clinica.constants';
import { AntecedenteFamiliar } from '../../interface/historia-clinica.interface';
import { AntecedenteFamiliarService } from '../../services/antecedente-familiar.service';
import { etiqueta, mensajeError } from '../../utils/historia-clinica.util';
import { HcAntecedenteFamiliarFormModalComponent } from '../hc-antecedente-familiar-form-modal/hc-antecedente-familiar-form-modal.component';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

const COLUMNAS_BASE: TableColumn<AntecedenteFamiliar>[] = [
  { header: 'Tipo', field: 'tipo', type: 'custom' },
  { header: 'Parentesco', field: 'parentesco', type: 'custom' },
  { header: 'Descripción', field: 'descripcion', type: 'text' },
  { header: 'Observación', field: 'observacion', type: 'custom' },
];

const COLUMNA_ACCIONES: TableColumn<AntecedenteFamiliar> = {
  header: 'Acciones',
  field: 'id',
  type: 'custom',
  align: 'center',
};

@Component({
  selector: 'app-hc-antecedentes-familiares',
  standalone: true,
  imports: [
    CommonModule,
    CustomTableComponent,
    HcSeccionVaciaComponent,
    HcAntecedenteFamiliarFormModalComponent,
  ],
  templateUrl: './hc-antecedentes-familiares.component.html',
})
export class HcAntecedentesFamiliaresComponent implements OnChanges {
  @Input({ required: true }) idHistoria!: number;
  @Input() items: AntecedenteFamiliar[] = [];
  @Input() soloLectura = false;
  @Output() cambio = new EventEmitter<void>();

  columns: TableColumn<AntecedenteFamiliar>[] = COLUMNAS_BASE;

  formAbierto = signal(false);
  registroEditar = signal<AntecedenteFamiliar | null>(null);
  procesando = signal(false);

  constructor(
    private readonly servicio: AntecedenteFamiliarService,
    private readonly toastService: ToastService,
  ) {}

  ngOnChanges(): void {
    this.columns = this.soloLectura ? COLUMNAS_BASE : [...COLUMNAS_BASE, COLUMNA_ACCIONES];
  }

  tipoTexto(item: AntecedenteFamiliar): string {
    return etiqueta(OPCIONES_TIPO_ANTECEDENTE_FAMILIAR, item.tipo);
  }

  parentescoTexto(item: AntecedenteFamiliar): string {
    return etiqueta(OPCIONES_PARENTESCO, item.parentesco, '-');
  }

  abrirCrear(): void {
    this.registroEditar.set(null);
    this.formAbierto.set(true);
  }

  abrirEditar(item: AntecedenteFamiliar): void {
    this.registroEditar.set(item);
    this.formAbierto.set(true);
  }

  alGuardar(): void {
    this.formAbierto.set(false);
    this.registroEditar.set(null);
    this.cambio.emit();
  }

  eliminar(item: AntecedenteFamiliar): void {
    if (this.procesando()) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar antecedente familiar',
        `¿Estás seguro de que deseas eliminar "${item.descripcion}"? El registro se conserva en la auditoría.`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.procesando.set(true);

        this.servicio.eliminar(this.idHistoria, item.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Antecedente eliminado con éxito');
            this.procesando.set(false);
            this.cambio.emit();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(mensajeError(error, 'No se pudo eliminar el antecedente'));
            this.procesando.set(false);
          },
        });
      });
  }
}
