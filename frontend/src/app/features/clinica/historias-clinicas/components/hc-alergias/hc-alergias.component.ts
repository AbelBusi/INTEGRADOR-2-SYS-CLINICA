import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';

import { ToastService } from '../../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { OPCIONES_TIPO_ALERGIA } from '../../constants/historia-clinica.constants';
import { Alergia } from '../../interface/historia-clinica.interface';
import { AlergiaService } from '../../services/alergia.service';
import { etiqueta, mensajeError } from '../../utils/historia-clinica.util';
import { HcAlergiaFormModalComponent } from '../hc-alergia-form-modal/hc-alergia-form-modal.component';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

const COLUMNAS_BASE: TableColumn<Alergia>[] = [
  { header: 'Sustancia / alérgeno', field: 'sustancia', type: 'custom' },
  { header: 'Tipo', field: 'tipoAlergia', type: 'custom' },
  { header: 'Reacción', field: 'reaccion', type: 'custom' },
  { header: 'Observación', field: 'observacion', type: 'custom' },
];

const COLUMNA_ACCIONES: TableColumn<Alergia> = {
  header: 'Acciones',
  field: 'id',
  type: 'custom',
  align: 'center',
};

@Component({
  selector: 'app-hc-alergias',
  standalone: true,
  imports: [
    CommonModule,
    CustomTableComponent,
    HcSeccionVaciaComponent,
    HcAlergiaFormModalComponent,
  ],
  templateUrl: './hc-alergias.component.html',
})
export class HcAlergiasComponent implements OnChanges {
  @Input({ required: true }) idHistoria!: number;
  @Input() items: Alergia[] = [];
  @Input() soloLectura = false;
  @Output() cambio = new EventEmitter<void>();

  columns: TableColumn<Alergia>[] = COLUMNAS_BASE;

  formAbierto = signal(false);
  registroEditar = signal<Alergia | null>(null);
  procesando = signal(false);

  constructor(
    private readonly servicio: AlergiaService,
    private readonly toastService: ToastService,
  ) {}

  ngOnChanges(): void {
    this.columns = this.soloLectura ? COLUMNAS_BASE : [...COLUMNAS_BASE, COLUMNA_ACCIONES];
  }

  tipoTexto(item: Alergia): string {
    return etiqueta(OPCIONES_TIPO_ALERGIA, item.tipoAlergia);
  }

  abrirCrear(): void {
    this.registroEditar.set(null);
    this.formAbierto.set(true);
  }

  abrirEditar(item: Alergia): void {
    this.registroEditar.set(item);
    this.formAbierto.set(true);
  }

  alGuardar(): void {
    this.formAbierto.set(false);
    this.registroEditar.set(null);
    this.cambio.emit();
  }

  eliminar(item: Alergia): void {
    if (this.procesando()) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar alergia',
        `¿Estás seguro de que deseas eliminar la alergia a "${item.sustancia}"? El registro se conserva en la auditoría.`,
      )
      .then((confirmar) => {
        if (!confirmar) {
          return;
        }

        this.procesando.set(true);

        this.servicio.eliminar(this.idHistoria, item.id).subscribe({
          next: (response) => {
            this.toastService.success(response?.mensaje || 'Alergia eliminada con éxito');
            this.procesando.set(false);
            this.cambio.emit();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error(mensajeError(error, 'No se pudo eliminar la alergia'));
            this.procesando.set(false);
          },
        });
      });
  }
}
