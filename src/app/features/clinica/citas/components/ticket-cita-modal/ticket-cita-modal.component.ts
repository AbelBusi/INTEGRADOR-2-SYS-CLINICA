import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { DatosComprobante } from '../../utils/comprobante.util';
import { construirTicketHtml } from '../../utils/ticket.util';

@Component({
  selector: 'app-ticket-cita-modal',
  standalone: true,
  templateUrl: './ticket-cita-modal.component.html',
})
export class TicketCitaModalComponent implements AfterViewInit {
  @Input({ required: true }) datos!: DatosComprobante;
  @Output() close = new EventEmitter<void>();

  @ViewChild('marco') marco?: ElementRef<HTMLIFrameElement>;

  ngAfterViewInit(): void {
    const iframe = this.marco?.nativeElement;

    if (!iframe) {
      return;
    }

    iframe.addEventListener('load', () => {
      const documento = iframe.contentDocument;

      if (documento) {
        iframe.style.height = `${documento.documentElement.scrollHeight}px`;
      }
    });

    iframe.srcdoc = construirTicketHtml(this.datos);
  }

  imprimir(): void {
    const ventana = this.marco?.nativeElement.contentWindow;

    ventana?.focus();
    ventana?.print();
  }

  onClose(): void {
    this.close.emit();
  }
}
