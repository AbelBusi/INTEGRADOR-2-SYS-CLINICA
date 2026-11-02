import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, of } from 'rxjs';

import {
  CitaFila,
  MedicoInfo,
  PacienteInfo,
  UsuarioRegistro,
  infoEstado,
} from '../../interface/cita.interface';
import {
  DatosComprobante,
  dato,
  duracionMinutos,
  edadDesde,
  fechaCitaLarga,
  nombrePaciente,
  numeroCita,
} from '../../utils/comprobante.util';
import { CitaService } from '../../services/cita.service';
import { TicketCitaModalComponent } from '../ticket-cita-modal/ticket-cita-modal.component';
import { PdfCitaModalComponent } from '../pdf-cita-modal/pdf-cita-modal.component';

@Component({
  selector: 'app-ver-detalle-cita-modal',
  standalone: true,
  imports: [CommonModule, TicketCitaModalComponent, PdfCitaModalComponent],
  templateUrl: './ver-detalle-cita-modal.component.html',
})
export class VerDetalleCitaModalComponent implements OnChanges {
  @Input() cita: CitaFila | null = null;
  @Output() close = new EventEmitter<void>();

  citaActual = signal<CitaFila | null>(null);
  paciente = signal<PacienteInfo | null>(null);
  medico = signal<MedicoInfo | null>(null);
  registradoPor = signal<UsuarioRegistro | null>(null);
  emitido = signal(new Date());

  cargandoExtras = signal(false);
  verTicket = signal(false);
  verPdf = signal(false);

  datos = computed<DatosComprobante | null>(() => {
    const cita = this.citaActual();

    return cita
      ? {
          cita,
          paciente: this.paciente(),
          medico: this.medico(),
          registradoPor: this.registradoPor(),
          emitido: this.emitido(),
        }
      : null;
  });

  constructor(private readonly citaService: CitaService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cita'] && this.cita) {
      this.citaActual.set(this.cita);
      this.cargarExtras(this.cita);
    }
  }

  private cargarExtras(cita: CitaFila): void {
    this.cargandoExtras.set(true);
    this.paciente.set(null);
    this.medico.set(null);
    this.registradoPor.set(null);

    forkJoin({
      paciente: this.citaService.obtenerPaciente(cita.idPaciente).pipe(
        map((response) => response.object),
        catchError(() => of(null)),
      ),
      medico: this.citaService.obtenerMedico(cita.idMedico).pipe(
        map((response) => response.object),
        catchError(() => of(null)),
      ),
      usuario: this.citaService.obtenerUsuario(cita.idUsuario).pipe(
        map((response) => response.object),
        catchError(() => of(null)),
      ),
    }).subscribe(({ paciente, medico, usuario }) => {
      this.paciente.set(paciente);
      this.medico.set(medico);
      this.registradoPor.set(usuario);
      this.cargandoExtras.set(false);
    });
  }

  numero(cita: CitaFila): string {
    return numeroCita(cita.id);
  }

  estado(cita: CitaFila) {
    return infoEstado(cita.estado);
  }

  fechaLarga(cita: CitaFila): string {
    return fechaCitaLarga(cita);
  }

  duracion(cita: CitaFila): string {
    return `${duracionMinutos(cita)} min`;
  }

  nombreCompleto(cita: CitaFila): string {
    const datos = this.datos();
    return datos ? nombrePaciente(datos) : cita.paciente;
  }

  edad(): string {
    return edadDesde(this.paciente()?.fechaNacimiento);
  }

  valor(texto: string | null | undefined): string {
    return dato(texto);
  }

  abrirTicket(): void {
    this.emitido.set(new Date());
    this.verTicket.set(true);
  }

  abrirPdf(): void {
    this.emitido.set(new Date());
    this.verPdf.set(true);
  }

  onClose(): void {
    this.close.emit();
  }
}
