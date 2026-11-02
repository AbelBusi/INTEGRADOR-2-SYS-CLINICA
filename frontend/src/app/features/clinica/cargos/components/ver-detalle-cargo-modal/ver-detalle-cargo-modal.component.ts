import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cargo } from '../../interface/cargo.interface';

@Component({
  selector: 'app-ver-detalle-cargo-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-detalle-cargo-modal.component.html',
})
export class VerDetalleCargoModalComponent {
  @Input() cargo: cargo | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
