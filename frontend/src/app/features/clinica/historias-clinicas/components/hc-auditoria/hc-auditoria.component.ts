import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';

import { HistoriaClinica } from '../../interface/historia-clinica.interface';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import {
  EventoAuditoriaVista,
  construirEventoVista,
} from '../../utils/historia-clinica-auditoria.util';
import { mensajeError } from '../../utils/historia-clinica.util';
import { HcSeccionVaciaComponent } from '../hc-seccion-vacia/hc-seccion-vacia.component';

const TAMANIO_PAGINA = 15;

/**
 * Registro de cambios de la historia clínica (solo lectura). Se carga solo y pagina de a 15 eventos.
 *  - Médico:   [historia] -> auditoría de esa historia.
 *  - Paciente: [miHistoria]="true" -> auditoría de su propia historia (identidad por JWT).
 */
@Component({
  selector: 'app-hc-auditoria',
  standalone: true,
  imports: [CommonModule, HcSeccionVaciaComponent],
  templateUrl: './hc-auditoria.component.html',
})
export class HcAuditoriaComponent implements OnInit {
  /** Se usa para consultar (médico) y para resolver el nombre de los registros afectados. */
  @Input() historia: HistoriaClinica | null = null;
  @Input() miHistoria = false;

  eventos = signal<EventoAuditoriaVista[]>([]);
  total = signal(0);
  cargando = signal(false);
  error = signal<string | null>(null);
  hayMas = signal(false);

  private proxima = 0;

  constructor(private readonly servicio: HistoriaClinicaService) {}

  ngOnInit(): void {
    this.cargar(true);
  }

  cargar(reiniciar: boolean): void {
    if (this.cargando()) {
      return;
    }

    const pagina = reiniciar ? 0 : this.proxima;

    const peticion = this.miHistoria
      ? this.servicio.miAuditoria(pagina, TAMANIO_PAGINA)
      : this.historia
        ? this.servicio.auditoriaPorHistoria(this.historia.id, pagina, TAMANIO_PAGINA)
        : null;

    if (!peticion) {
      this.error.set('No se pudo identificar la historia clínica.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    peticion.subscribe({
      next: (response) => {
        const datos = response.object;
        const nuevos = (datos?.contenido ?? []).map((e) => construirEventoVista(e, this.historia));

        this.eventos.set(reiniciar ? nuevos : [...this.eventos(), ...nuevos]);
        this.total.set(datos?.totalElementos ?? 0);
        this.proxima = pagina + 1;
        this.hayMas.set(this.proxima < (datos?.totalPaginas ?? 0));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar el registro de cambios:', error);
        this.error.set(
          mensajeError(
            error,
            error.status === 403
              ? 'No tienes autorización para consultar el registro de cambios.'
              : 'No se pudo cargar el registro de cambios. Inténtalo de nuevo.',
          ),
        );
        this.cargando.set(false);
      },
    });
  }

  /** Icono y colores según la operación. */
  estiloIcono(operacion: string): { icono: string; clases: string } {
    switch (operacion) {
      case 'CREACION':
        return { icono: 'add', clases: 'bg-[#0d6b68]/10 text-[#0d6b68]' };
      case 'ELIMINACION':
        return { icono: 'delete', clases: 'bg-[#D9182A]/10 text-[#D9182A]' };
      default:
        return { icono: 'edit', clases: 'bg-gray-100 text-[#58595B]' };
    }
  }
}
