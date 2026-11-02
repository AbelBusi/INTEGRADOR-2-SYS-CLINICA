import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatosComprobante, nombreArchivoPdf } from '../../utils/comprobante.util';
import { generarPdfCita } from '../../utils/pdf-cita.util';

@Component({
  selector: 'app-pdf-cita-modal',
  standalone: true,
  templateUrl: './pdf-cita-modal.component.html',
})
export class PdfCitaModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) datos!: DatosComprobante;
  @Output() close = new EventEmitter<void>();

  url = signal<SafeResourceUrl | null>(null);
  cargando = signal(true);
  error = signal(false);

  private urlObjeto: string | null = null;

  constructor(private readonly sanitizer: DomSanitizer) {}

  async ngOnInit(): Promise<void> {
    try {
      const blob = await generarPdfCita(this.datos);

      this.urlObjeto = URL.createObjectURL(blob);
      this.url.set(
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `${this.urlObjeto}#toolbar=1&navpanes=0&view=FitH`,
        ),
      );
    } catch (error) {
      console.error(error);
      this.error.set(true);
    } finally {
      this.cargando.set(false);
    }
  }

  ngOnDestroy(): void {
    if (this.urlObjeto) {
      URL.revokeObjectURL(this.urlObjeto);
    }
  }

  descargar(): void {
    if (!this.urlObjeto) {
      return;
    }

    const enlace = document.createElement('a');

    enlace.href = this.urlObjeto;
    enlace.download = nombreArchivoPdf(this.datos);
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
  }

  onClose(): void {
    this.close.emit();
  }
}
