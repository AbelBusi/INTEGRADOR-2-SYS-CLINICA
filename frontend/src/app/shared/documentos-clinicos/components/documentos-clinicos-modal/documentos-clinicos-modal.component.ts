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
import { DomSanitizer } from '@angular/platform-browser';

import { CitaFila } from '../../../../features/clinica/citas/interface/cita.interface';
import { ANCHOS_TICKET, FORMATOS_DOCUMENTO } from '../../constants/documento-clinico.constants';
import {
  AnchoTicket,
  ArchivoGenerado,
  ContextoClinico,
  DocumentoDisponible,
  FormatoDocumento,
  TipoDocumentoClinico,
} from '../../interface/documento-clinico.interface';
import { DocumentoClinicoService } from '../../services/documento-clinico.service';
import { evaluarDisponibilidad } from '../../utils/contenido-documento.util';
import { fechaTexto } from '../../utils/documento-clinico.util';
import { abrirEnPestana, descargarArchivo, imprimirArchivo } from '../../utils/pdf-salida.util';

type AccionDocumento = 'vista' | 'descarga' | 'impresion';

@Component({
  selector: 'app-documentos-clinicos-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentos-clinicos-modal.component.html',
})
export class DocumentosClinicosModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) cita!: CitaFila;
  @Output() close = new EventEmitter<void>();

  private readonly documentoService = inject(DocumentoClinicoService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly formatos = FORMATOS_DOCUMENTO;
  readonly anchosTicket = ANCHOS_TICKET;

  contexto = signal<ContextoClinico | null>(null);
  cargando = signal(true);
  errorCarga = signal<string | null>(null);

  seleccion = signal<ReadonlySet<TipoDocumentoClinico>>(new Set());
  formato = signal<FormatoDocumento>('a4');
  anchoTicket = signal<AnchoTicket>(80);
  consolidado = signal(true);

  accion = signal<AccionDocumento | null>(null);
  errorGeneracion = signal<string | null>(null);
  archivos = signal<ArchivoGenerado[]>([]);
  indiceActivo = signal(0);

  procesando = computed(() => this.accion() !== null);
  documentos = computed(() => {
    const ctx = this.contexto();
    return ctx ? evaluarDisponibilidad(ctx) : [];
  });
  seleccionables = computed(() => this.documentos().filter((doc) => this.esSeleccionable(doc)));
  cantidadSeleccionada = computed(
    () => this.seleccionables().filter((doc) => this.seleccion().has(doc.tipo)).length,
  );
  todosSeleccionados = computed(
    () =>
      this.seleccionables().length > 0 &&
      this.cantidadSeleccionada() === this.seleccionables().length,
  );
  hayExcluidosPorFormato = computed(
    () =>
      this.formato() === 'ticket' &&
      this.documentos().some((doc) => doc.disponible && !doc.admiteTicket),
  );
  archivoActivo = computed(() => this.archivos()[this.indiceActivo()] ?? null);
  vistaUrl = computed(() => {
    const archivo = this.archivoActivo();
    return archivo ? this.sanitizer.bypassSecurityTrustResourceUrl(archivo.url) : null;
  });

  ngOnInit(): void {
    this.documentoService.cargarContexto(this.cita).subscribe({
      next: (contexto) => {
        this.contexto.set(contexto);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar los datos del documento:', error);
        this.errorCarga.set(
          error.error?.mensaje ||
            'No se pudo cargar la información de la atención. Inténtalo de nuevo.',
        );
        this.cargando.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.documentoService.liberar(this.archivos());
  }

  fechaCita(): string {
    return fechaTexto(this.cita.fecha);
  }

  esSeleccionable(documento: DocumentoDisponible): boolean {
    return documento.disponible && (this.formato() === 'a4' || documento.admiteTicket);
  }

  detalleDocumento(documento: DocumentoDisponible): string {
    if (!documento.disponible) {
      return documento.motivoNoDisponible;
    }

    if (!this.esSeleccionable(documento)) {
      return 'Solo disponible en formato A4.';
    }

    return documento.descripcion;
  }

  alternarDocumento(tipo: TipoDocumentoClinico): void {
    const nueva = new Set(this.seleccion());

    if (nueva.has(tipo)) {
      nueva.delete(tipo);
    } else {
      nueva.add(tipo);
    }

    this.seleccion.set(nueva);
    this.invalidar();
  }

  alternarTodos(): void {
    this.seleccion.set(
      this.todosSeleccionados() ? new Set() : new Set(this.seleccionables().map((doc) => doc.tipo)),
    );
    this.invalidar();
  }

  seleccionarFormato(formato: FormatoDocumento): void {
    this.formato.set(formato);

    const permitidos = new Set(this.seleccionables().map((doc) => doc.tipo));
    this.seleccion.set(new Set([...this.seleccion()].filter((tipo) => permitidos.has(tipo))));
    this.invalidar();
  }

  seleccionarAncho(ancho: AnchoTicket): void {
    this.anchoTicket.set(ancho);
    this.invalidar();
  }

  alternarConsolidado(): void {
    this.consolidado.set(!this.consolidado());
    this.invalidar();
  }

  seleccionarArchivo(indice: number): void {
    this.indiceActivo.set(indice);
  }

  cerrar(): void {
    if (!this.procesando()) {
      this.close.emit();
    }
  }

  async visualizar(): Promise<void> {
    await this.ejecutar('vista', () => undefined);
  }

  async descargar(): Promise<void> {
    await this.ejecutar('descarga', (archivo) => descargarArchivo(archivo.url, archivo.nombre));
  }

  async imprimir(): Promise<void> {
    await this.ejecutar('impresion', (archivo) => imprimirArchivo(archivo.url));
  }

  descargarTodos(): void {
    this.archivos().forEach((archivo, indice) => {
      setTimeout(() => descargarArchivo(archivo.url, archivo.nombre), indice * 300);
    });
  }

  abrirEnNuevaPestana(): void {
    const archivo = this.archivoActivo();

    if (archivo) {
      abrirEnPestana(archivo.url);
    }
  }

  private invalidar(): void {
    this.documentoService.liberar(this.archivos());
    this.archivos.set([]);
    this.indiceActivo.set(0);
    this.errorGeneracion.set(null);
  }

  private async ejecutar(
    accion: AccionDocumento,
    alTerminar: (archivo: ArchivoGenerado) => void,
  ): Promise<void> {
    const ctx = this.contexto();

    if (!ctx || this.cantidadSeleccionada() === 0 || this.procesando()) {
      return;
    }

    this.accion.set(accion);
    this.errorGeneracion.set(null);

    try {
      if (this.archivos().length === 0) {
        const archivos = await this.documentoService.generar(ctx, {
          tipos: this.seleccionables()
            .filter((doc) => this.seleccion().has(doc.tipo))
            .map((doc) => doc.tipo),
          formato: this.formato(),
          anchoTicket: this.anchoTicket(),
          consolidado: this.consolidado(),
        });

        this.archivos.set(archivos);
        this.indiceActivo.set(0);
      }

      const activo = this.archivoActivo();

      if (activo) {
        alTerminar(activo);
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      this.errorGeneracion.set(
        error instanceof Error && error.message
          ? error.message
          : 'No se pudo generar el PDF. Inténtalo de nuevo.',
      );
    } finally {
      this.accion.set(null);
    }
  }
}
