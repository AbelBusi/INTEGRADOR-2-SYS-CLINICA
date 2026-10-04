import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../core/services/toast.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-pago-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[110] flex items-center justify-center"
    >
      <div
        class="bg-white rounded border border-gray-200 shadow-xl max-w-sm w-full overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center"
        >
          <h3 class="text-xs font-bold text-gray-700 uppercase tracking-widest">
            Código QR de Cobro
          </h3>
          <span
            class="text-[10px] font-bold text-[#0d6b68] bg-teal-50 px-2 py-0.5 rounded border border-teal-100 uppercase"
          >
            S/. {{ costo }}
          </span>
        </div>

        <div class="p-6 flex flex-col items-center justify-center">
          <p class="text-[11px] text-gray-500 text-center mb-4">
            Presente este código QR al paciente para que lo escanee con su celular y proceda con el
            pago en su cuenta de PayPal.
          </p>

          <div
            class="bg-white p-4 border border-gray-100 rounded shadow-inner flex items-center justify-center min-h-[220px] w-full"
          >
            <canvas #qrCanvas></canvas>
          </div>

          <div class="w-full gap-2 mt-6 pt-3 border-t border-gray-100 flex flex-col">
            <button
              type="button"
              (click)="onPagoExitoso.emit()"
              class="w-full bg-[#0d6b68] hover:bg-[#0a5250] text-white text-center text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-colors outline-none shadow-sm"
            >
              Confirmar Registro de Cita
            </button>

            <button
              type="button"
              (click)="cancelar.emit()"
              class="w-full text-center text-[10px] text-gray-400 hover:text-gray-600 font-bold uppercase tracking-widest transition-colors py-1.5 outline-none"
            >
              Cancelar Operación
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PagoModalComponent implements OnInit {
  @Input() costo!: number;
  @Output() onPagoExitoso = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  @ViewChild('qrCanvas', { static: true }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly toast = inject(ToastService);

  ngOnInit(): void {
    this.generarEnlaceCobroQr();
  }

  private generarEnlaceCobroQr(): void {
    const correoComercioSandbox = 'sb-rvdgl47716704@business.example.com';
    const linkPayPal = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(correoComercioSandbox)}&amount=${this.costo}&currency_code=USD&item_name=Pago%20de%20Cita%20Medica`;

    QRCode.toCanvas(
      this.qrCanvas.nativeElement,
      linkPayPal,
      {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      },
      (error) => {
        if (error) {
          this.toast.error('Error al generar la matriz del código QR');
        }
      },
    );
  }
}
