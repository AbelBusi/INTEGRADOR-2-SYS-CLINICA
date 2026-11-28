import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';

import { ToastService } from '../../../../../core/services/toast.service';
import { MedicamentoBusqueda } from '../../../medicamentos/interface/medicamento.interface';
import { MedicamentoService } from '../../../medicamentos/services/medicamento.service';
import { etiquetaMedicamento, textoGrupo, urlImagen } from '../../../medicamentos/utils/medicamento.util';

const MIN_CARACTERES = 3;

@Component({
  selector: 'app-medicamento-catalogo-buscador',
  standalone: true,
  templateUrl: './medicamento-catalogo-buscador.component.html',
})
export class MedicamentoCatalogoBuscadorComponent implements OnInit {
  /** Valor actual de nombreMedicamento en el formulario padre. */
  @Input() valor = '';
  @Output() seleccionado = new EventEmitter<MedicamentoBusqueda>();
  @Output() limpiado = new EventEmitter<void>();

  private readonly medicamentoService = inject(MedicamentoService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly busqueda$ = new Subject<string>();

  readonly minCaracteres = MIN_CARACTERES;
  readonly urlImagen = urlImagen;
  readonly textoGrupo = textoGrupo;
  readonly etiqueta = etiquetaMedicamento;

  texto = signal('');
  abierto = signal(false);
  buscando = signal(false);
  resultados = signal<MedicamentoBusqueda[]>([]);
  /** Fotos que fallaron al cargar: se muestra el icono en su lugar. */
  fotosRotas = signal<Set<number>>(new Set());

  ngOnInit(): void {
    this.texto.set(this.valor ?? '');

    this.busqueda$
      .pipe(
        map((v) => v.trim()),
        filter((v) => v.length >= MIN_CARACTERES),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((v) =>
          this.medicamentoService.buscar(v).pipe(
            catchError((error) => {
              console.error(error);
              this.toastService.error('No se pudo consultar el catálogo de medicamentos.');
              return of({ mensaje: '', object: [] as MedicamentoBusqueda[] });
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        this.resultados.set(response.object || []);
        this.buscando.set(false);
      });
  }

  alEscribir(valor: string): void {
    this.texto.set(valor);
    this.abierto.set(true);

    if (valor.trim().length >= MIN_CARACTERES) {
      this.buscando.set(true);
      this.busqueda$.next(valor);
    } else {
      this.buscando.set(false);
      this.resultados.set([]);
    }

    // Si ya había un medicamento elegido y se modifica el texto, debe volver a elegir uno del catálogo.
    if (this.valor) {
      this.limpiado.emit();
    }
  }

  seleccionar(medicamento: MedicamentoBusqueda): void {
    this.texto.set(this.etiqueta(medicamento));
    this.abierto.set(false);
    this.resultados.set([]);
    this.seleccionado.emit(medicamento);
  }

  limpiar(): void {
    this.texto.set('');
    this.resultados.set([]);
    this.buscando.set(false);
    this.limpiado.emit();
  }

  marcarFotoRota(id: number): void {
    this.fotosRotas.update((set) => new Set(set).add(id));
  }
}
