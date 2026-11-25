import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { SelloFirmaComponent } from '../../../../../shared/documentos-clinicos/components/sello-firma/sello-firma.component';
import { DescansoMedico } from '../../../../../shared/documentos-clinicos/interface/descanso-medico.interface';
import { ArchivoGenerado } from '../../../../../shared/documentos-clinicos/interface/documento-clinico.interface';
import { DescansoMedicoService } from '../../../../../shared/documentos-clinicos/services/descanso-medico.service';
import {
  etiquetaMetodo,
  formatearFecha,
  formatearFechaHora,
  hashCorto,
  textoDias,
} from '../../../../../shared/documentos-clinicos/utils/descanso-medico.util';
import {
  abrirEnPestana,
  descargarArchivo,
} from '../../../../../shared/documentos-clinicos/utils/pdf-salida.util';

@Component({
  selector: 'app-descanso-detalle-modal',
  standalone: true,
  imports: [CommonModule, SelloFirmaComponent],
  templateUrl: './descanso-detalle-modal.component.html',
})
export class DescansoDetalleModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) descanso!: DescansoMedico;
  @Output() close = new EventEmitter<void>();

  private readonly service = inject(DescansoMedicoService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly formatearFecha = formatearFecha;
  readonly formatearFechaHora = formatearFechaHora;
  readonly hashCorto = hashCorto;
  readonly textoDias = textoDias;
  readonly etiquetaMetodo = etiquetaMetodo;

  archivo = signal<ArchivoGenerado | null>(null);
  generandoPdf = signal(false);
  errorPdf = signal<string | null>(null);

  vistaUrl = computed(() => {
    const archivo = this.archivo();
    return archivo ? this.sanitizer.bypassSecurityTrustResourceUrl(archivo.url) : null;
  });

  ngOnInit(): void {
    void this.generarPdf();
  }

  ngOnDestroy(): void {
    this.service.liberar(this.archivo());
  }

  async generarPdf(): Promise<void> {
    this.generandoPdf.set(true);
    this.errorPdf.set(null);

    try {
      this.service.liberar(this.archivo());
      this.archivo.set(await this.service.generarPdf(this.descanso));
    } catch (error) {
      console.error('Error al generar el PDF del descanso médico:', error);
      this.archivo.set(null);
      this.errorPdf.set('No se pudo generar el PDF. Inténtalo de nuevo.');
    } finally {
      this.generandoPdf.set(false);
    }
  }

  descargar(): void {
    const archivo = this.archivo();

    if (archivo) {
      descargarArchivo(archivo.url, archivo.nombre);
    }
  }

  abrirEnNuevaPestana(): void {
    const archivo = this.archivo();

    if (archivo) {
      abrirEnPestana(archivo.url);
    }
  }
}
