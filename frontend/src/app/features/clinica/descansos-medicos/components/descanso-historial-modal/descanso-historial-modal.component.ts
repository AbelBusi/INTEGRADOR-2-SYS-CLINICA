import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelloFirmaComponent } from '../../../../../shared/documentos-clinicos/components/sello-firma/sello-firma.component';
import {
  DescansoMedico,
  DescansoMedicoHistorial,
  EventoAuditoriaDescanso,
} from '../../../../../shared/documentos-clinicos/interface/descanso-medico.interface';
import { DescansoMedicoService } from '../../../../../shared/documentos-clinicos/services/descanso-medico.service';
import {
  formatearFecha,
  formatearFechaEvento,
  hashCorto,
  mensajeError,
  textoDias,
} from '../../../../../shared/documentos-clinicos/utils/descanso-medico.util';

interface MetaEvento {
  titulo: string;
  icono: string;
  fondo: string;
}

@Component({
  selector: 'app-descanso-historial-modal',
  standalone: true,
  imports: [CommonModule, SelloFirmaComponent],
  templateUrl: './descanso-historial-modal.component.html',
})
export class DescansoHistorialModalComponent implements OnInit {
  @Input({ required: true }) descanso!: DescansoMedico;
  @Output() close = new EventEmitter<void>();

  private readonly service = inject(DescansoMedicoService);

  readonly formatearFecha = formatearFecha;
  readonly formatearFechaEvento = formatearFechaEvento;
  readonly hashCorto = hashCorto;
  readonly textoDias = textoDias;

  cargando = signal(true);
  error = signal<string | null>(null);
  historial = signal<DescansoMedicoHistorial | null>(null);

  actual = computed(() => this.historial()?.descanso ?? this.descanso);
  eventos = computed(() => this.historial()?.eventos ?? []);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.service.historial(this.descanso.id).subscribe({
      next: (response) => {
        this.historial.set(response.object ?? null);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar el historial del descanso médico:', error);
        this.error.set(mensajeError(error, 'No se pudo cargar el historial del descanso médico.'));
        this.cargando.set(false);
      },
    });
  }

  meta(evento: EventoAuditoriaDescanso): MetaEvento {
    switch (evento.resultado) {
      case 'EMITIDO':
        return { titulo: 'Descanso médico emitido', icono: 'draw', fondo: 'bg-[#0d6b68]' };
      case 'CANCELADO':
        return { titulo: 'Descanso médico cancelado', icono: 'event_busy', fondo: 'bg-[#D9182A]' };
      default:
        return {
          titulo: 'Código de verificación incorrecto',
          icono: 'gpp_maybe',
          fondo: 'bg-amber-500',
        };
    }
  }

  descripcion(evento: EventoAuditoriaDescanso): string {
    const d = this.actual();

    switch (evento.resultado) {
      case 'EMITIDO':
        return `Descanso de ${textoDias(evento.dias)} (del ${formatearFecha(evento.fechaInicio)} al ${formatearFecha(evento.fechaFin)}) emitido para ${d.datos.pacienteNombre}.`;
      case 'CANCELADO':
        return 'El descanso médico fue cancelado. El documento se conserva con estado cancelado.';
      default:
        return (
          evento.observacion ||
          'Se intentó confirmar la operación con un código incorrecto; no se realizó ningún cambio.'
        );
    }
  }
}
