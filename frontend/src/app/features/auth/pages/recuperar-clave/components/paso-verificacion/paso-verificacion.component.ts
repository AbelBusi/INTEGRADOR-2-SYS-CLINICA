import { Component, computed, input, output, signal } from '@angular/core';

const LONGITUD_CODIGO = 6;

@Component({
  selector: 'app-paso-verificacion',
  standalone: true,
  templateUrl: './paso-verificacion.component.html',
})
export class PasoVerificacionComponent {
  readonly cargando = input<boolean>(false);

  readonly verificar = output<string>();
  readonly volver = output<void>();

  readonly longitud = LONGITUD_CODIGO;
  readonly codigo = signal<string>('');

  readonly codigoCompleto = computed(() => this.codigo().length === LONGITUD_CODIGO);

  alEscribir(event: Event): void {
    const input = event.target as HTMLInputElement;
    const limpio = input.value.replace(/\D/g, '').slice(0, LONGITUD_CODIGO);
    input.value = limpio;
    this.codigo.set(limpio);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.codigoCompleto()) return;
    this.verificar.emit(this.codigo());
  }
}
