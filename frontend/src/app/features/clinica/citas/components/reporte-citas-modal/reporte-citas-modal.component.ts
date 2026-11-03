import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../../core/services/toast.service';
import { ESTABLECIMIENTO } from '../../../../../shared/documentos-clinicos/constants/documento-clinico.constants';
import { cargarImagenPdf } from '../../../../../shared/documentos-clinicos/utils/pdf-imagen.util';
import { generarCsvReporteCitas } from '../../generators/reporte-cita-csv.generator';
import { generarPdfReporteCitas } from '../../generators/reporte-cita-pdf.generator';
import { CitaFila, OPCIONES_ESTADO } from '../../interface/cita.interface';
import { FormatoReporte, RangoRapido } from '../../interface/reporte-cita.interface';
import { descargarBlob } from '../../utils/descarga-archivo.util';
import {
  RANGOS_RAPIDOS,
  SERIES_ESTADO,
  construirReporte,
  filasPorEstado,
  filasPorMedico,
  filasPorPunto,
  isoLocal,
  opcionesMedico,
  porcentaje,
  rangoFechas,
  tarjetasReporte,
} from '../../utils/reporte-cita.util';
import { GraficoBarrasCitaComponent } from '../grafico-barras-cita/grafico-barras-cita.component';
import { GraficoColumnasCitaComponent } from '../grafico-columnas-cita/grafico-columnas-cita.component';

@Component({
  selector: 'app-reporte-citas-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, GraficoBarrasCitaComponent, GraficoColumnasCitaComponent],
  templateUrl: './reporte-citas-modal.component.html',
})
export class ReporteCitasModalComponent {
  @Input({ required: true }) set citas(valor: CitaFila[]) {
    this.fuente.set(valor ?? []);
  }
  @Input() set idsPendientes(valor: ReadonlySet<number>) {
    this.pendientes.set(valor ?? new Set<number>());
  }
  @Output() close = new EventEmitter<void>();

  private readonly toastService = inject(ToastService);

  readonly opcionesEstado = OPCIONES_ESTADO;
  readonly rangos = RANGOS_RAPIDOS;
  readonly series = SERIES_ESTADO;
  readonly formatos: { valor: FormatoReporte; texto: string; icono: string }[] = [
    { valor: 'pdf', texto: 'PDF', icono: 'picture_as_pdf' },
    { valor: 'csv', texto: 'CSV', icono: 'table_view' },
  ];

  private readonly fuente = signal<CitaFila[]>([]);
  private readonly pendientes = signal<ReadonlySet<number>>(new Set<number>());

  desde = signal(rangoFechas('mes').desde);
  hasta = signal(rangoFechas('mes').hasta);
  rango = signal<RangoRapido>('mes');
  idMedico = signal<number | 'todos'>('todos');
  estado = signal<number | 'todos'>('todos');

  formato = signal<FormatoReporte>('pdf');
  incluirGraficos = signal(true);
  incluirDetalle = signal(false);
  generando = signal(false);
  errorExportacion = signal<string | null>(null);

  medicos = computed(() => opcionesMedico(this.fuente()));
  rangoInvalido = computed(() => !!this.desde() && !!this.hasta() && this.desde() > this.hasta());
  reporte = computed(() =>
    construirReporte(this.fuente(), this.pendientes(), {
      desde: this.desde(),
      hasta: this.hasta(),
      idMedico: this.idMedico(),
      estado: this.estado(),
    }),
  );
  hayDatos = computed(() => this.reporte().conteo.total > 0);
  tarjetas = computed(() => tarjetasReporte(this.reporte()));
  filasEstado = computed(() => filasPorEstado(this.reporte().conteo));
  filasMedico = computed(() => filasPorMedico(this.reporte().porMedico));
  filasDiaSemana = computed(() => filasPorPunto(this.reporte().porDiaSemana));
  tasaGlobal = computed(() =>
    porcentaje(this.reporte().conteo.atendidas, this.reporte().conteo.total),
  );
  puedeExportar = computed(() => this.hayDatos() && !this.rangoInvalido() && !this.generando());

  aplicarRango(clave: RangoRapido): void {
    const fechas = rangoFechas(clave);

    this.rango.set(clave);
    this.desde.set(fechas.desde);
    this.hasta.set(fechas.hasta);
  }

  cambiarDesde(valor: string): void {
    this.desde.set(valor);
    this.rango.set('personalizado');
  }

  cambiarHasta(valor: string): void {
    this.hasta.set(valor);
    this.rango.set('personalizado');
  }

  restablecer(): void {
    this.aplicarRango('mes');
    this.idMedico.set('todos');
    this.estado.set('todos');
  }

  cerrar(): void {
    if (!this.generando()) {
      this.close.emit();
    }
  }

  async exportar(): Promise<void> {
    if (!this.puedeExportar()) {
      return;
    }

    this.generando.set(true);
    this.errorExportacion.set(null);

    try {
      const reporte = this.reporte();
      const nombre = `reporte-citas_${isoLocal(new Date())}`;

      if (this.formato() === 'csv') {
        descargarBlob(generarCsvReporteCitas(reporte), `${nombre}.csv`);
      } else {
        const logo = await cargarImagenPdf(ESTABLECIMIENTO.logoUrl);
        const blob = await generarPdfReporteCitas(
          reporte,
          { graficos: this.incluirGraficos(), detalle: this.incluirDetalle() },
          logo,
          new Date(),
        );

        descargarBlob(blob, `${nombre}.pdf`);
      }

      this.toastService.success('Reporte generado con éxito');
    } catch (error) {
      console.error('Error al generar el reporte de citas:', error);
      this.errorExportacion.set('No se pudo generar el reporte. Inténtalo de nuevo.');
    } finally {
      this.generando.set(false);
    }
  }
}
