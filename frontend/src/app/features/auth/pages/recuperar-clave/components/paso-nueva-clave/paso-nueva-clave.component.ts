import { Component, computed, input, output, signal } from '@angular/core';

const CLAVE_MIN = 6;
const CLAVE_MAX = 100;

@Component({
  selector: 'app-paso-nueva-clave',
  standalone: true,
  templateUrl: './paso-nueva-clave.component.html',
})
export class PasoNuevaClaveComponent {
  readonly cargando = input<boolean>(false);

  readonly restablecer = output<string>();

  readonly minimo = CLAVE_MIN;
  readonly maximo = CLAVE_MAX;

  readonly nuevaClave = signal<string>('');
  readonly confirmacion = signal<string>('');
  readonly mostrar = signal<boolean>(false);
  readonly intentado = signal<boolean>(false);

  readonly claveValida = computed(
    () => this.nuevaClave().length >= CLAVE_MIN && this.nuevaClave().length <= CLAVE_MAX,
  );
  readonly coinciden = computed(() => this.nuevaClave() === this.confirmacion());

  toggleMostrar(): void {
    this.mostrar.update((v) => !v);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.intentado.set(true);

    if (!this.claveValida() || !this.coinciden()) return;

    this.restablecer.emit(this.nuevaClave());
  }
}
