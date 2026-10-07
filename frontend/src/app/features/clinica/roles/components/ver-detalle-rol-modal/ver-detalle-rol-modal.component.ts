import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rol } from '../../interface/rol.interface';

@Component({
  selector: 'app-ver-detalle-rol-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-detalle-rol-modal.component.html',
})
export class VerDetalleRolModalComponent {
  @Input() rol: Rol | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
