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
import { ExamenMedicoBusqueda } from '../../../examen-medico/interface/examen-medico.interface';
import { ExamenMedicoService } from '../../../examen-medico/services/examen-medico.service';

const MIN_CARACTERES = 3;

@Component({
  selector: 'app-examen-catalogo-buscador',
  standalone: true,
  templateUrl: './examen-catalogo-buscador.component.html',
})
export class ExamenCatalogoBuscadorComponent implements OnInit {
  /** Valor actual de nombreExamen en el formulario padre. */
  @Input() valor = '';
  @Output() seleccionado = new EventEmitter<ExamenMedicoBusqueda>();
  @Output() limpiado = new EventEmitter<void>();

  private readonly examenMedicoService = inject(ExamenMedicoService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly busqueda$ = new Subject<string>();

  readonly minCaracteres = MIN_CARACTERES;

  texto = signal('');
  abierto = signal(false);
  buscando = signal(false);
  resultados = signal<ExamenMedicoBusqueda[]>([]);

  ngOnInit(): void {
    this.texto.set(this.valor ?? '');

    this.busqueda$
      .pipe(
        map((v) => v.trim()),
        filter((v) => v.length >= MIN_CARACTERES),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((v) =>
          this.examenMedicoService.buscar(v).pipe(
            catchError((error) => {
              console.error(error);
              this.toastService.error('No se pudo consultar el catálogo de exámenes.');
              return of({ mensaje: '', object: [] as ExamenMedicoBusqueda[] });
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

    // Si había un examen elegido y el médico modifica el texto, debe volver a elegir uno del catálogo.
    if (this.valor) {
      this.limpiado.emit();
    }
  }

  seleccionar(examen: ExamenMedicoBusqueda): void {
    this.texto.set(examen.nombre);
    this.abierto.set(false);
    this.resultados.set([]);
    this.seleccionado.emit(examen);
  }

  limpiar(): void {
    this.texto.set('');
    this.resultados.set([]);
    this.buscando.set(false);
    this.limpiado.emit();
  }
}
