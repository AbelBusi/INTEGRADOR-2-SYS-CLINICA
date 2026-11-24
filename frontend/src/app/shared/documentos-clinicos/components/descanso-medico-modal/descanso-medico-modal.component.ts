import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastService } from '../../../../core/services/toast.service';
import { CitaFila } from '../../../../features/clinica/citas/interface/cita.interface';
import { ESTABLECIMIENTO } from '../../constants/documento-clinico.constants';
import {
  DescansoMedico,
  DescansoMedicoContexto,
  ErroresDescanso,
} from '../../interface/descanso-medico.interface';
import { ArchivoGenerado } from '../../interface/documento-clinico.interface';
import { DescansoMedicoService } from '../../services/descanso-medico.service';
import {
  calcularDias,
  etiquetaMetodo,
  formatearFecha,
  formatearFechaHora,
  hoyIso,
  mensajeError,
  textoDias,
} from '../../utils/descanso-medico.util';
import { abrirEnPestana, descargarArchivo } from '../../utils/pdf-salida.util';
import { DescansoVerificacionModalComponent } from '../descanso-verificacion-modal/descanso-verificacion-modal.component';

@Component({
  selector: 'app-descanso-medico-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DescansoVerificacionModalComponent],
  templateUrl: './descanso-medico-modal.component.html',
})
export class DescansoMedicoModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) cita!: CitaFila;
  @Output() close = new EventEmitter<void>();

  private readonly service = inject(DescansoMedicoService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toast = inject(ToastService);

  readonly limiteJustificacion = 1000;
  readonly hoy = hoyIso();
  readonly establecimiento = ESTABLECIMIENTO.nombre;
  readonly logoUrl = ESTABLECIMIENTO.logoUrl;

  readonly formatearFecha = formatearFecha;
  readonly formatearFechaHora = formatearFechaHora;
  readonly textoDias = textoDias;
  readonly etiquetaMetodo = etiquetaMetodo;

  cargando = signal(true);
  errorCarga = signal<string | null>(null);
  contexto = signal<DescansoMedicoContexto | null>(null);

  fechaInicio = signal('');
  fechaFin = signal('');
  dias = signal<number | null>(null);
  justificacion = signal('');
  intentado = signal(false);

  verificando = signal(false);
  emitiendo = signal(false);
  errorVerificacion = signal<string | null>(null);
  errorEmision = signal<string | null>(null);

  archivo = signal<ArchivoGenerado | null>(null);
  generandoPdf = signal(false);
  errorPdf = signal<string | null>(null);

  descanso = computed(() => this.contexto()?.descanso ?? null);
  datos = computed(() => this.contexto()?.datos ?? null);
  puedeEmitir = computed(() => !this.descanso() && (this.contexto()?.puedeEmitir ?? false));
  bloqueado = computed(() => !this.descanso() && !this.puedeEmitir());

  diasCalculados = computed(() => calcularDias(this.fechaInicio(), this.fechaFin()));

  errores = computed<ErroresDescanso>(() => {
    const e: ErroresDescanso = {};
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    const dias = this.dias();
    const calculados = this.diasCalculados();

    if (!inicio) {
      e.fechaInicio = 'La fecha de inicio es obligatoria.';
    } else if (inicio < this.hoy) {
      e.fechaInicio = 'La fecha de inicio no puede ser anterior a hoy.';
    }

    if (!fin) {
      e.fechaFin = 'La fecha de fin es obligatoria.';
    } else if (inicio && fin < inicio) {
      e.fechaFin = 'La fecha de fin no puede ser anterior a la de inicio.';
    }

    if (dias === null || dias < 1) {
      e.dias = 'Indica la cantidad de días.';
    } else if (calculados !== null && dias !== calculados) {
      e.dias = `No corresponde al periodo indicado (${calculados}).`;
    }

    if (!this.justificacion().trim()) {
      e.justificacion = 'La justificación médica es obligatoria.';
    }

    return e;
  });

  formularioValido = computed(() => Object.keys(this.errores()).length === 0);

  vistaUrl = computed(() => {
    const archivo = this.archivo();
    return archivo ? this.sanitizer.bypassSecurityTrustResourceUrl(archivo.url) : null;
  });

  ngOnInit(): void {
    this.cargar();
  }

  ngOnDestroy(): void {
    this.service.liberar(this.archivo());
  }

  cargar(): void {
    this.cargando.set(true);
    this.errorCarga.set(null);

    this.service.obtenerContexto(this.cita.id).subscribe({
      next: (response) => {
        const contexto = response.object ?? null;
        this.contexto.set(contexto);
        this.cargando.set(false);

        if (contexto?.descanso) {
          void this.generarPdf(contexto.descanso);
        }
      },
      error: (error) => {
        console.error('Error al cargar el descanso médico:', error);
        this.errorCarga.set(
          mensajeError(error, 'No se pudo cargar la información del descanso médico.'),
        );
        this.cargando.set(false);
      },
    });
  }

  cambiarFechaInicio(valor: string): void {
    this.fechaInicio.set(valor);
    this.sugerirDias();
  }

  cambiarFechaFin(valor: string): void {
    this.fechaFin.set(valor);
    this.sugerirDias();
  }

  private sugerirDias(): void {
    const calculados = this.diasCalculados();

    if (calculados !== null) {
      this.dias.set(calculados);
    }
  }

  solicitarEmision(): void {
    this.intentado.set(true);
    this.errorEmision.set(null);

    if (!this.puedeEmitir() || !this.formularioValido()) {
      return;
    }

    this.errorVerificacion.set(null);
    this.verificando.set(true);
  }

  cancelarVerificacion(): void {
    if (!this.emitiendo()) {
      this.verificando.set(false);
    }
  }

  confirmar(codigo: string): void {
    if (this.emitiendo()) {
      return;
    }

    this.emitiendo.set(true);
    this.errorVerificacion.set(null);

    this.service
      .emitir(this.cita.id, {
        fechaInicio: this.fechaInicio(),
        fechaFin: this.fechaFin(),
        dias: this.dias() as number,
        justificacion: this.justificacion().trim(),
        codigoVerificacion: codigo,
      })
      .subscribe({
        next: (response) => {
          const descanso = response.object as DescansoMedico;

          this.contexto.update((c) =>
            c ? { ...c, descanso, puedeEmitir: false, motivoBloqueo: null } : c,
          );
          this.emitiendo.set(false);
          this.verificando.set(false);
          this.toast.success(response?.mensaje || 'Descanso médico generado con éxito');
          void this.generarPdf(descanso);
        },
        error: (error) => {
          this.emitiendo.set(false);
          const mensaje = mensajeError(error, 'No se pudo generar el descanso médico.');

          if (error?.status === 400) {
            this.errorVerificacion.set(mensaje);
            return;
          }

          this.verificando.set(false);
          this.errorEmision.set(mensaje);
          this.cargar();
        },
      });
  }

  async generarPdf(descanso: DescansoMedico): Promise<void> {
    this.generandoPdf.set(true);
    this.errorPdf.set(null);

    try {
      this.service.liberar(this.archivo());
      this.archivo.set(await this.service.generarPdf(descanso));
    } catch (error) {
      console.error('Error al generar el PDF del descanso médico:', error);
      this.archivo.set(null);
      this.errorPdf.set('No se pudo generar el PDF. Inténtalo de nuevo.');
    } finally {
      this.generandoPdf.set(false);
    }
  }

  descargar(): void {
    const archivo = this.archivo();

    if (archivo) {
      descargarArchivo(archivo.url, archivo.nombre);
    }
  }

  abrirEnNuevaPestana(): void {
    const archivo = this.archivo();

    if (archivo) {
      abrirEnPestana(archivo.url);
    }
  }

  cerrar(): void {
    if (!this.emitiendo()) {
      this.close.emit();
    }
  }
}
