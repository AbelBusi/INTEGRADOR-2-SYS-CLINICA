import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';

import { ToastService } from '../../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { OPCIONES_TIPO_ANTECEDENTE_PERSONAL } from '../../constants/historia-clinica.constants';
import { AntecedentePersonal } from '../../interface/historia-clinica.interface';
import { AntecedentePersonalService } from '../../services/antecedente-personal.service';
import { etiqueta, mensajeError } from '../../utils/historia-clinica.util';
import { HcAntecedentePersonalFormModalComponent } from '../hc-antecedente-personal-form-modal/hc-antecedente-personal-form-modal.component';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

const COLUMNAS_BASE: TableColumn<AntecedentePersonal>[] = [
  { header: 'Tipo', field: 'tipo', type: 'custom' },
  { header: 'Descripción', field: 'descripcion', type: 'text' },
  { header: 'Año', field: 'anio', type: 'custom' },
  { header: 'Observación', field: 'observacion', type: 'custom' },
];

const COLUMNA_ACCIONES: TableColumn<AntecedentePersonal> = {
  header: 'Acciones',
  field: 'id',
  type: 'custom',
  align: 'center',
};

@Component({
  selector: 'app-hc-antecedentes-personales',
  standalone: true,
  imports: [
    CommonModule,
    CustomTableComponent,
    HcSeccionVaciaComponent,
    HcAntecedentePersonalFormModalComponent,
  ],
  templateUrl: './hc-antecedentes-personales.component.html',
})
export class HcAntecedentesPersonalesComponent implements OnChanges {
  @Input({ required: true }) idHistoria!: number;
  @Input() items: AntecedentePersonal[] = [];
  @Input() soloLectura = false;
  /** Se emite tras crear, editar o eliminar para que el contenedor recargue la historia. */
  @Output() cambio = new EventEmitter<void>();

  columns: TableColumn<AntecedentePersonal>[] = COLUMNAS_BASE;

  formAbierto = signal(false);
  registroEditar = signal<AntecedentePersonal | null>(null);
  procesando = signal(false);

  constructor(
    private readonly servicio: AntecedentePersonalService,
    private readonly toastService: ToastService,
  ) {}

  ngOnChanges(): void {
    this.columns = this.soloLectura ? COLUMNAS_BASE : [...COLUMNAS_BASE, COLUMNA_ACCIONES];
  }

  tipoTexto(item: AntecedentePersonal): string {
    return etiqueta(OPCIONES_TIPO_ANTECEDENTE_PERSONAL, item.tipo);
  }

  abrirCrear(): void {
    this.registroEditar.set(null);
    this.formAbierto.set(true);
  }

  abrirEditar(item: AntecedentePersonal): void {
    this.registroEditar.set(item);
    this.formAbierto.set(true);
  }

  alGuardar(): void {
    this.formAbierto.set(false);
    this.registroEditar.set(null);
    this.cambio.emit();
  }

  eliminar(item: AntecedentePersonal): void {
    if (this.procesando()) {
      return;
    }

    this.toastService
      .confirmar(
        'Eliminar antecedente personal',
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
