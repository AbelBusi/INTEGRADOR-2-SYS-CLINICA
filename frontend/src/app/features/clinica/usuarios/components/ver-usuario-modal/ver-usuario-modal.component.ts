import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioFila } from '../../interface/usuario.interface';

@Component({
  selector: 'app-ver-usuario-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-usuario-modal.component.html',
})
export class VerUsuarioModalComponent {
  @Input() usuario: UsuarioFila | null = null;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
