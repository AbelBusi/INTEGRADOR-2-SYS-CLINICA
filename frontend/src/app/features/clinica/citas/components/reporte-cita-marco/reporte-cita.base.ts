import { Directive, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';

import { ToastService } from '../../../../../core/services/toast.service';
import { CitaFila } from '../../interface/cita.interface';
import { CambioRango, DocumentoReporte } from '../../interface/reporte-cita-extra.interface';
import { FormatoReporte, RangoRapido } from '../../interface/reporte-cita.interface';
import { ReporteCitaExportacionService } from '../../services/reporte-cita-exportacion.service';
import { rangoFechas } from '../../utils/reporte-cita.util';

@Directive()
export abstract class ReporteCitaBase {
  @Input({ required: true }) set citas(valor: CitaFila[]) {
    this.fuente.set(valor ?? []);
  }

  @Input() set idsPendientes(valor: ReadonlySet<number>) {
    this.pendientes.set(valor ?? new Set<number>());
  }

  @Output() close = new EventEmitter<void>();

  private readonly exportacion = inject(ReporteCitaExportacionService);
  private readonly toastService = inject(ToastService);

  protected readonly fuente = signal<CitaFila[]>([]);
  protected readonly pendientes = signal<ReadonlySet<number>>(new Set<number>());

  formato = signal<FormatoReporte>('pdf');
  generando = signal(false);
  errorExportacion = signal<string | null>(null);

  desde = signal(rangoFechas('mes').desde);
  hasta = signal(rangoFechas('mes').hasta);
  rango = signal<RangoRapido>('mes');

  rangoInvalido = computed(() => !!this.desde() && !!this.hasta() && this.desde() > this.hasta());

  aplicarRango(cambio: CambioRango): void {
    this.rango.set(cambio.rango);
    this.desde.set(cambio.desde);
    this.hasta.set(cambio.hasta);
  }

  cerrar(): void {
    if (!this.generando()) {
      this.close.emit();
    }
  }

  protected async generar(documento: DocumentoReporte | null): Promise<void> {
    if (!documento || this.generando()) {
      return;
    }

    this.generando.set(true);
    this.errorExportacion.set(null);

    try {
      await this.exportacion.exportar(documento, this.formato());
      this.toastService.success('Reporte generado con éxito');
    } catch (error) {
      console.error('Error al generar el reporte de citas:', error);
      this.errorExportacion.set('No se pudo generar el reporte. Inténtalo de nuevo.');
    } finally {
      this.generando.set(false);
    }
  }
}
