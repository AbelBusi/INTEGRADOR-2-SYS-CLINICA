import { Component, Input, computed, signal } from '@angular/core';

interface Marca {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'app-sello-firma',
  standalone: true,
  template: `
    <svg
      class="shrink-0"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 100 100"
      role="img"
      aria-label="Sello de firma electrónica interna"
    >
      <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#58595B" stroke-width="2.5" />

      @for (m of marcas(); track $index) {
        <line
          [attr.x1]="m.x1"
          [attr.y1]="m.y1"
          [attr.x2]="m.x2"
          [attr.y2]="m.y2"
          [attr.stroke]="color()"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      }

      <circle cx="50" cy="50" r="29" fill="none" stroke="#D9182A" stroke-width="1.6" />

      @if (esCancelado()) {
        <path
          d="M39 37 L61 59 M61 37 L39 59"
          fill="none"
          [attr.stroke]="color()"
          stroke-width="5"
          stroke-linecap="round"
        />
      } @else {
        <path
          d="M37 49 L46 58 L63 39"
          fill="none"
          [attr.stroke]="color()"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      }

      @if (size >= 48) {
        <text
          x="50"
          y="73"
          text-anchor="middle"
          font-size="6.2"
          font-weight="700"
          letter-spacing="0.6"
          fill="#58595B"
          font-family="Arial, sans-serif"
        >
          {{ esCancelado() ? 'CANCELADO' : 'FIRMADO' }}
        </text>
      }
    </svg>
  `,
})
export class SelloFirmaComponent {
  @Input() size = 64;

  @Input() set hash(valor: string | null | undefined) {
    this.hashSignal.set((valor ?? '').toLowerCase());
  }

  @Input() set cancelado(valor: boolean) {
    this.canceladoSignal.set(!!valor);
  }

  private readonly hashSignal = signal('');
  private readonly canceladoSignal = signal(false);

  readonly esCancelado = this.canceladoSignal.asReadonly();
  readonly color = computed(() => (this.canceladoSignal() ? '#D9182A' : '#0d6b68'));

  readonly marcas = computed<Marca[]>(() => {
    const hash = this.hashSignal();
    const total = 64;
    const resultado: Marca[] = [];

    for (let i = 0; i < total; i++) {
      const nibble = parseInt(hash.charAt(i) || '0', 16);
      const valor = Number.isNaN(nibble) ? 0 : nibble;
      const largo = 3 + (valor / 15) * 6;
      const exterior = 44;
      const interior = exterior - largo;
      const angulo = (i / total) * 2 * Math.PI - Math.PI / 2;
      const cos = Math.cos(angulo);
      const sen = Math.sin(angulo);

      resultado.push({
        x1: +(50 + interior * cos).toFixed(2),
        y1: +(50 + interior * sen).toFixed(2),
        x2: +(50 + exterior * cos).toFixed(2),
        y2: +(50 + exterior * sen).toFixed(2),
      });
    }

    return resultado;
  });
}
