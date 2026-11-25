import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { CustomTableComponent } from '../../../../../shared/components/custom-table/custom-table.component';
import { TableColumn } from '../../../../../shared/components/custom-table/table-column.interface';
import { SelloFirmaComponent } from '../../../../../shared/documentos-clinicos/components/sello-firma/sello-firma.component';
import { DescansoMedico } from '../../../../../shared/documentos-clinicos/interface/descanso-medico.interface';
import { DescansoMedicoService } from '../../../../../shared/documentos-clinicos/services/descanso-medico.service';
import {
  formatearFecha,
  formatearFechaHora,
  hashCorto,
  mensajeError,
  textoDias,
} from '../../../../../shared/documentos-clinicos/utils/descanso-medico.util';
import { DescansoCancelarModalComponent } from '../../components/descanso-cancelar-modal/descanso-cancelar-modal.component';
import { DescansoDetalleModalComponent } from '../../components/descanso-detalle-modal/descanso-detalle-modal.component';
import { DescansoHistorialModalComponent } from '../../components/descanso-historial-modal/descanso-historial-modal.component';

type FiltroEstado = 'todos' | 'vigente' | 'cancelado';

@Component({
  selector: 'app-lista-descansos-medicos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    SelloFirmaComponent,
    DescansoDetalleModalComponent,
    DescansoHistorialModalComponent,
    DescansoCancelarModalComponent,
  ],
  templateUrl: './lista-descansos-medicos.component.html',
})
export class ListaDescansosMedicosComponent implements OnInit {
  search = '';
  documentos: DescansoMedico[] = [];
  cargando = false;
  sortField = 'fechaEmision';
  filtroEstado: FiltroEstado = 'todos';

  documentoVer: DescansoMedico | null = null;
  documentoHistorial: DescansoMedico | null = null;
  documentoCancelar: DescansoMedico | null = null;

  readonly formatearFecha = formatearFecha;
  readonly formatearFechaHora = formatearFechaHora;
  readonly hashCorto = hashCorto;
  readonly textoDias = textoDias;

  columns: TableColumn<DescansoMedico>[] = [
    { header: 'Documento', field: 'numero', sortable: true, type: 'custom' },
    { header: 'Paciente', field: 'datos', type: 'custom' },
    { header: 'Periodo', field: 'fechaInicio', type: 'custom' },
    { header: 'Emitido', field: 'fechaEmision', sortable: true, type: 'custom' },
    { header: 'Huella de firma', field: 'hashContenido', type: 'custom' },
    { header: 'Estado', field: 'estado', type: 'custom' },
    { header: 'Acciones', field: 'id', type: 'custom', align: 'center' },
  ];

  constructor(
    private readonly descansoService: DescansoMedicoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;

    this.descansoService.listarMisDocumentos().subscribe({
      next: (response) => {
        this.documentos = response.object || [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar los documentos emitidos:', error);
        this.toastService.error(
          mensajeError(error, 'No se pudieron cargar los documentos emitidos.'),
        );
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get documentosFiltrados(): DescansoMedico[] {
    const term = this.search.trim().toLowerCase();

    return this.documentos.filter((doc) => {
      if (this.filtroEstado === 'vigente' && doc.estado !== 'VIGENTE') {
        return false;
      }

      if (this.filtroEstado === 'cancelado' && doc.estado !== 'CANCELADO') {
        return false;
      }

      if (!term) {
        return true;
      }

      return (
        doc.numero.toLowerCase().includes(term) ||
        doc.datos.pacienteNombre.toLowerCase().includes(term) ||
        doc.datos.pacienteDocumento.toLowerCase().includes(term) ||
        doc.hashContenido.toLowerCase().includes(term) ||
        doc.codigoDocumento.toLowerCase().includes(term)
      );
    });
  }

  get totalDocumentos(): number {
    return this.documentos.length;
  }

  get totalVigentes(): number {
    return this.documentos.filter((d) => d.estado === 'VIGENTE').length;
  }

  get totalCancelados(): number {
    return this.documentos.filter((d) => d.estado === 'CANCELADO').length;
  }

  handleSort(field: string): void {
    this.sortField = field;
  }

  copiarHuella(hash: string): void {
    navigator.clipboard
      .writeText(hash)
      .then(() => this.toastService.success('Huella SHA-256 copiada'))
      .catch(() => this.toastService.error('No se pudo copiar la huella'));
  }

  handleCancelado(actualizado: DescansoMedico): void {
    this.documentos = this.documentos.map((d) => (d.id === actualizado.id ? actualizado : d));
    this.documentoCancelar = null;
    this.cdr.detectChanges();
  }
}
