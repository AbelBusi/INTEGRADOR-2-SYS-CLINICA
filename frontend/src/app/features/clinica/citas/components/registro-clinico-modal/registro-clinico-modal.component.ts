import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-registro-clinico-modal',
  standalone: true,
  templateUrl: './registro-clinico-modal.component.html',
})
export class RegistroClinicoModalComponent {
  @Input({ required: true }) titulo!: string;
  @Input() subtitulo = '';
  @Input() icono = 'assignment';
  @Output() close = new EventEmitter<void>();
}
