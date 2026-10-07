import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CambioClaveService } from '../../services/cambio-clave.services';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-cambiar-clave-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-clave-modal.component.html',
})
export class CambiarClaveModalComponent implements AfterViewInit {
  @Output() cambiado = new EventEmitter<void>();
  @Output() salir = new EventEmitter<void>();

  @ViewChild('primerCampo') primerCampo?: ElementRef<HTMLInputElement>;

  claveActual = signal('');
  nuevaClave = signal('');
  confirmacion = signal('');

  verActual = signal(false);
  verNueva = signal(false);
  guardando = signal(false);
  error = signal<string | null>(null);

  requisitos = computed(() => {
    const nueva = this.nuevaClave();

    return [
      { texto: 'Mínimo 8 caracteres', cumple: nueva.length >= 8 },
      { texto: 'Una letra mayúscula', cumple: /[A-Z]/.test(nueva) },
      { texto: 'Una letra minúscula', cumple: /[a-z]/.test(nueva) },
      { texto: 'Un número', cumple: /\d/.test(nueva) },
      {
        texto: 'Distinta a la contraseña temporal',
        cumple: nueva.length > 0 && nueva !== this.claveActual(),
      },
    ];
  });

  coincide = computed(
    () => this.confirmacion() !== '' && this.confirmacion() === this.nuevaClave(),
  );

  puedeGuardar = computed(
    () =>
      !this.guardando() &&
      this.claveActual() !== '' &&
      this.requisitos().every((requisito) => requisito.cumple) &&
      this.coincide(),
  );

  constructor(
    private readonly cambioClaveService: CambioClaveService,
    private readonly toastService: ToastService,
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.primerCampo?.nativeElement.focus());
  }

  guardar(): void {
    if (!this.puedeGuardar()) {
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.cambioClaveService
      .cambiar({ claveActual: this.claveActual(), nuevaClave: this.nuevaClave() })
      .subscribe({
        next: (response) => {
          this.toastService.success(response?.mensaje || 'Contraseña actualizada correctamente');
          this.guardando.set(false);
          this.cambiado.emit();
        },
        error: (error) => {
          console.error(error);
          this.error.set(
            error.error?.mensaje || error.error?.message || 'No se pudo actualizar la contraseña.',
          );
          this.guardando.set(false);
        },
      });
  }

  cerrarSesion(): void {
    this.salir.emit();
  }
}
