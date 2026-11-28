import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { SelloFirmaComponent } from '../../../../shared/documentos-clinicos/components/sello-firma/sello-firma.component';
import { ESTABLECIMIENTO } from '../../../../shared/documentos-clinicos/constants/documento-clinico.constants';
import { VerificacionDescanso } from '../../../../shared/documentos-clinicos/interface/descanso-medico.interface';
import {
  formatearFecha,
  formatearFechaHora,
  textoDias,
} from '../../../../shared/documentos-clinicos/utils/descanso-medico.util';
import { VerificacionDescansoService } from '../../services/verificacion-descanso.service';

@Component({
  selector: 'app-verificar-descanso',
  standalone: true,
  imports: [CommonModule, SelloFirmaComponent],
  templateUrl: './verificar-descanso.component.html',
})
export class VerificarDescansoComponent implements OnInit {
  private readonly ruta = inject(ActivatedRoute);
  private readonly service = inject(VerificacionDescansoService);

  readonly establecimiento = ESTABLECIMIENTO.nombre;
  readonly logoUrl = ESTABLECIMIENTO.logoUrl;
  readonly formatearFecha = formatearFecha;
  readonly formatearFechaHora = formatearFechaHora;
  readonly textoDias = textoDias;

  codigo = '';
  cargando = signal(true);
  error = signal<string | null>(null);
  resultado = signal<VerificacionDescanso | null>(null);
  consultadoEn = signal('');

  ngOnInit(): void {
    this.codigo = this.ruta.snapshot.paramMap.get('codigo') ?? '';
    this.verificar();
  }

  verificar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.service.verificar(this.codigo).subscribe({
      next: (response) => {
        this.resultado.set(response.object ?? null);
        this.consultadoEn.set(new Date().toLocaleString('es-PE'));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(
          'No se pudo realizar la verificación. Inténtalo nuevamente en unos minutos.',
        );
        this.cargando.set(false);
      },
    });
  }
}
