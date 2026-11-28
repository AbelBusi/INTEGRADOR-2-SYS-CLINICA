import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  GRUPOS_TERAPEUTICOS,
  IMAGEN_TAMANIO_MAXIMO,
  IMAGEN_TIPOS_PERMITIDOS,
  INDICACIONES_TERAPEUTICAS,
} from '../../constants/medicamento.constants';
import {
  GrupoTerapeutico,
  IndicacionTerapeutica,
  Medicamento,
  MedicamentoGuardar,
  MedicamentoSimilar,
} from '../../interface/medicamento.interface';
import { MedicamentoService } from '../../services/medicamento.service';
import { mensajeError, textoGrupo, urlImagen } from '../../utils/medicamento.util';

/** Crear (medicamento = null) o editar un medicamento. */
@Component({
  selector: 'app-medicamento-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicamento-form-modal.component.html',
})
export class MedicamentoFormModalComponent implements OnInit, OnDestroy {
  @Input() medicamento: Medicamento | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<Medicamento>();

  readonly grupos = GRUPOS_TERAPEUTICOS;
  readonly indicaciones = INDICACIONES_TERAPEUTICAS;
  readonly textoGrupo = textoGrupo;

  form = {
    nombre: '',
    principioActivo: '',
    concentracion: '',
    grupoTerapeutico: '' as GrupoTerapeutico | '',
    indicacionTerapeutica: '' as IndicacionTerapeutica | '',
    laboratorio: '',
    descripcion: '',
    requiereReceta: true,
  };

  guardando = signal(false);
  similares = signal<MedicamentoSimilar[]>([]);

  vistaPrevia = signal<string | null>(null);
  errorImagen = signal<string | null>(null);
  private imagenNueva: File | null = null;
  private quitarImagenActual = false;
  private urlTemporal: string | null = null;

  private readonly nombreEscrito$ = new Subject<string>();
  private suscripcion?: Subscription;

  constructor(
    private readonly servicio: MedicamentoService,
    private readonly toastService: ToastService,
  ) {}

  get esEdicion(): boolean {
    return this.medicamento !== null;
  }

  get hayImagen(): boolean {
    return this.vistaPrevia() !== null;
  }

  ngOnInit(): void {
    const m = this.medicamento;

    if (m) {
      this.form = {
        nombre: m.nombre,
        principioActivo: m.principioActivo ?? '',
        concentracion: m.concentracion ?? '',
        grupoTerapeutico: m.grupoTerapeutico,
        indicacionTerapeutica: m.indicacionTerapeutica ?? '',
        laboratorio: m.laboratorio ?? '',
        descripcion: m.descripcion ?? '',
        requiereReceta: m.requiereReceta,
      };
      this.vistaPrevia.set(urlImagen(m.foto));
    }

    // Avisa de nombres parecidos mientras se escribe: así "parcetamol" no entra al lado de "Paracetamol".
    this.suscripcion = this.nombreEscrito$
      .pipe(
        debounceTime(350),
        map((texto) => texto.trim()),
        distinctUntilChanged(),
        switchMap((texto) =>
          texto.length < 3
            ? of(null)
            : this.servicio.similares(texto, this.medicamento?.id).pipe(catchError(() => of(null))),
        ),
      )
      .subscribe((respuesta) => this.similares.set(respuesta?.object ?? []));
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
    this.liberarVistaPrevia();
  }

  alEscribirNombre(): void {
    this.nombreEscrito$.next(this.form.nombre);
  }

  /* ------------------------------ Imagen ------------------------------ */

  alElegirImagen(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;
    input.value = '';

    if (!archivo) {
      return;
    }

    if (!IMAGEN_TIPOS_PERMITIDOS.includes(archivo.type)) {
      this.errorImagen.set('La imagen debe ser JPG, PNG o WEBP.');
      return;
    }

    if (archivo.size > IMAGEN_TAMANIO_MAXIMO) {
      this.errorImagen.set('La imagen no puede superar los 2 MB.');
      return;
    }

    this.errorImagen.set(null);
    this.liberarVistaPrevia();

    this.imagenNueva = archivo;
    this.quitarImagenActual = false;
    this.urlTemporal = URL.createObjectURL(archivo);
    this.vistaPrevia.set(this.urlTemporal);
  }

  quitarImagen(): void {
    this.errorImagen.set(null);
    this.liberarVistaPrevia();
    this.imagenNueva = null;

    const fotoActual = this.medicamento?.foto ?? null;

    if (fotoActual) {
      // Había una imagen guardada: se quitará al guardar.
      this.quitarImagenActual = true;
    }

    this.vistaPrevia.set(null);
  }

  private liberarVistaPrevia(): void {
    if (this.urlTemporal) {
      URL.revokeObjectURL(this.urlTemporal);
      this.urlTemporal = null;
    }
  }

  /* ------------------------------ Guardar ------------------------------ */

  private valor(texto: string): string | null {
    const limpio = texto.trim().replace(/\s+/g, ' ');
    return limpio ? limpio : null;
  }

  guardar(): void {
    if (this.guardando() || !this.form.grupoTerapeutico || !this.form.nombre.trim()) {
      return;
    }

    const dto: MedicamentoGuardar = {
      nombre: this.form.nombre.trim().replace(/\s+/g, ' '),
      principioActivo: this.valor(this.form.principioActivo),
      concentracion: this.valor(this.form.concentracion),
      grupoTerapeutico: this.form.grupoTerapeutico,
      indicacionTerapeutica: this.form.indicacionTerapeutica || null,
      laboratorio: this.valor(this.form.laboratorio),
      descripcion: this.valor(this.form.descripcion),
      requiereReceta: this.form.requiereReceta,
    };

    this.guardando.set(true);

    const peticion = this.medicamento
      ? this.servicio.actualizar(
          this.medicamento.id,
          { ...dto, quitarImagen: this.quitarImagenActual },
          this.imagenNueva,
        )
      : this.servicio.crear(dto, this.imagenNueva);

    peticion.subscribe({
      next: (response) => {
        this.toastService.success(
          response?.mensaje ||
            (this.esEdicion ? 'Medicamento actualizado con éxito' : 'Medicamento creado con éxito'),
        );
        this.guardando.set(false);
        this.guardado.emit(response.object);
      },
      error: (error) => {
        console.error('Error al guardar el medicamento:', error);
        this.toastService.error(mensajeError(error, 'No se pudo guardar el medicamento.'));
        this.guardando.set(false);
      },
    });
  }
}
