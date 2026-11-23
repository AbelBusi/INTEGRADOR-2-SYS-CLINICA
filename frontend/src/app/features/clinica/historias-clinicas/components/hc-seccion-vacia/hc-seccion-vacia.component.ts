import { Component, Input } from '@angular/core';

/** Aviso estándar de "información aún no registrada" para secciones sin datos. */
@Component({
  selector: 'app-hc-seccion-vacia',
  standalone: true,
  template: `
    <div class="flex items-start gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-4">
      <span class="material-icons text-[20px] text-gray-400">{{ icono }}</span>
      <div>
        <p class="text-sm font-semibold text-gray-700">{{ titulo }}</p>
        @if (detalle) {
          <p class="mt-0.5 text-xs text-gray-500">{{ detalle }}</p>
        }
      </div>
    </div>
  `,
})
export class HcSeccionVaciaComponent {
  @Input({ required: true }) titulo!: string;
  @Input() detalle = '';
  @Input() icono = 'info';
}
