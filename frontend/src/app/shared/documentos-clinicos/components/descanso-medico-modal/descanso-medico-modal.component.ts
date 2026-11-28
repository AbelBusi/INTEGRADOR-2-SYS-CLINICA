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
import { DescansoCancelarModalComponent } from '../../../../features/clinica/descansos-medicos/components/descanso-cancelar-modal/descanso-cancelar-modal.component';
import { ESTABLECIMIENTO } from '../../constants/documento-clinico.constants';
import {
  DescansoMedico,
  DescansoMedicoContexto,
  ErroresDescanso,
} from '../../interface/descanso-medico.interface';
import { ArchivoGenerado } from '../../interface/documento-clinico.interface';
import { DescansoMedicoService } from '../../services/descanso-medico.service';
import {
  LIMITE_DIAS_DESCANSO,
  MINUTOS_PARA_CANCELAR,
  calcularDias,
  etiquetaMetodo,
  formatearCuenta,
  formatearFecha,
  formatearFechaHora,
  hashCorto,
  hoyIso,
  mensajeError,
  sumarDias,
  textoDias,
} from '../../utils/descanso-medico.util';
import { abrirEnPestana, descargarArchivo } from '../../utils/pdf-salida.util';
import { DescansoPoliticasModalComponent } from '../descanso-politicas-modal/descanso-politicas-modal.component';
import { DescansoVerificacionModalComponent } from '../descanso-verificacion-modal/descanso-verificacion-modal.component';
import { SelloFirmaComponent } from '../sello-firma/sello-firma.component';

@Component({
  selector: 'app-descanso-medico-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DescansoVerificacionModalComponent,
    DescansoPoliticasModalComponent,
    DescansoCancelarModalComponent,
    SelloFirmaComponent,
  ],
  templateUrl: './descanso-medico-modal.component.html',
})
export class DescansoMedicoModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) cita!: CitaFila;
  @Output() close = new EventEmitter<void>();

  private readonly service = inject(DescansoMedicoService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toast = inject(ToastService);

  private temporizador: ReturnType<typeof setInterval> | null = null;

  readonly limiteJustificacion = 1000;
  readonly limiteDias = LIMITE_DIAS_DESCANSO;
  readonly minutosCancelacion = MINUTOS_PARA_CANCELAR;
  readonly hoy = hoyIso();
  readonly establecimiento = ESTABLECIMIENTO.nombre;
  readonly logoUrl = ESTABLECIMIENTO.logoUrl;

  readonly formatearFecha = formatearFecha;
  readonly formatearFechaHora = formatearFechaHora;
  readonly textoDias = textoDias;
  readonly etiquetaMetodo = etiquetaMetodo;
  readonly hashCorto = hashCorto;

  cargando = signal(true);
  errorCarga = signal<string | null>(null);
  contexto = signal<DescansoMedicoContexto | null>(null);

  fechaInicio = signal('');
  fechaFin = signal('');
  dias = signal<number | null>(null);
  justificacion = signal('');
  aceptaPoliticas = signal(false);
  intentado = signal(false);

  mostrarPoliticas = signal(false);
  mostrarCancelar = signal(false);
  verificando = signal(false);
  emitiendo = signal(false);
  errorVerificacion = signal<string | null>(null);
  errorEmision = signal<string | null>(null);

  archivo = signal<ArchivoGenerado | null>(null);
  generandoPdf = signal(false);
  errorPdf = signal<string | null>(null);

  reloj = signal(Date.now());
  recibidoEn = signal(Date.now());

  descanso = computed(() => this.contexto()?.descanso ?? null);
  datos = computed(() => this.contexto()?.datos ?? null);
  puedeEmitir = computed(() => !this.descanso() && (this.contexto()?.puedeEmitir ?? false));
  bloqueadoSinDescanso = computed(
    () => !!this.contexto() && !this.descanso() && !this.puedeEmitir(),
  );
  plazoVencido = computed(
    () => this.bloqueadoSinDescanso() && this.contexto()?.codigoBloqueo === 'PLAZO_VENCIDO',
  );

  segundosCancelar = computed(() => {
    const d = this.descanso();

    if (!d || d.estado !== 'VIGENTE' || d.segundosParaCancelar == null) {
      return 0;
    }

    const transcurridos = Math.floor((this.reloj() - this.recibidoEn()) / 1000);
    return Math.max(0, d.segundosParaCancelar - transcurridos);
  });
  puedeCancelar = computed(() => this.segundosCancelar() > 0);
  cuentaCancelar = computed(() => formatearCuenta(this.segundosCancelar()));

  diasCalculados = computed(() => calcularDias(this.fechaInicio(), this.fechaFin()));
  fechaMaxima = computed(() =>
    this.fechaInicio() ? sumarDias(this.fechaInicio(), this.limiteDias - 1) : '',
  );

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
    } else if (calculados !== null && calculados > this.limiteDias) {
      e.fechaFin = `El periodo no puede superar los ${this.limiteDias} días.`;
    }

    if (dias === null || dias < 1) {
      e.dias = 'Indica la cantidad de días.';
    } else if (dias > this.limiteDias) {
      e.dias = `No puede superar los ${this.limiteDias} días.`;
    } else if (calculados !== null && dias !== calculados) {
      e.dias = `No corresponde al periodo indicado (${calculados}).`;
    }

    if (!this.justificacion().trim()) {
      e.justificacion = 'La justificación médica es obligatoria.';
    }

    if (!this.aceptaPoliticas()) {
      e.politicas = 'Debes aceptar las políticas y términos.';
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
    this.detenerReloj();
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
          this.iniciarReloj();
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

  private iniciarReloj(): void {
    this.detenerReloj();
    this.recibidoEn.set(Date.now());
    this.reloj.set(Date.now());

    this.temporizador = setInterval(() => {
      this.reloj.set(Date.now());

      if (this.segundosCancelar() <= 0) {
        this.detenerReloj();
      }
    }, 1000);
  }

  private detenerReloj(): void {
    if (this.temporizador !== null) {
      clearInterval(this.temporizador);
      this.temporizador = null;
    }
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

  alAceptarPoliticas(): void {
    this.aceptaPoliticas.set(true);
    this.mostrarPoliticas.set(false);
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
            c
              ? {
                  ...c,
                  descanso,
                  puedeEmitir: false,
                  motivoBloqueo: null,
                  codigoBloqueo: 'YA_EMITIDO',
                }
              : c,
          );
          this.emitiendo.set(false);
          this.verificando.set(false);
          this.iniciarReloj();
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

  alCancelarDescanso(cancelado: DescansoMedico): void {
    this.mostrarCancelar.set(false);
    this.detenerReloj();
    this.service.liberar(this.archivo());
    this.archivo.set(null);

    this.fechaInicio.set(cancelado.fechaInicio);
    this.fechaFin.set(cancelado.fechaFin);
    this.dias.set(cancelado.dias);
    this.justificacion.set(cancelado.justificacion);
    this.aceptaPoliticas.set(false);
    this.intentado.set(false);
    this.errorEmision.set(null);

    this.cargar();
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
