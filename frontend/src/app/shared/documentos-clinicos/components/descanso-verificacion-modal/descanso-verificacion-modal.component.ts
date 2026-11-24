import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-descanso-verificacion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './descanso-verificacion-modal.component.html',
})
export class DescansoVerificacionModalComponent implements AfterViewInit {
  @Input() procesando = false;
  @Input() error: string | null = null;
  @Output() confirmar = new EventEmitter<string>();
  @Output() cancelar = new EventEmitter<void>();

  @ViewChild('campo') campo?: ElementRef<HTMLInputElement>;

  codigo = signal('');

  get completo(): boolean {
    return /^\d{6}$/.test(this.codigo());
  }

  ngAfterViewInit(): void {
    this.campo?.nativeElement.focus();
  }

  alEscribir(valor: string): void {
    const limpio = (valor ?? '').replace(/\D/g, '').slice(0, 6);
    this.codigo.set(limpio);

    if (this.campo) {
      this.campo.nativeElement.value = limpio;
    }
  }

  enviar(): void {
    if (this.completo && !this.procesando) {
      this.confirmar.emit(this.codigo());
    }
  }

  cerrar(): void {
    if (!this.procesando) {
      this.cancelar.emit();
    }
  }
}
