import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, catchError, filter, from, map, mergeMap, of, tap, toArray } from 'rxjs';

import { AtencionClinica } from '../../interface/atencion-clinica.interface';
import { CambioRango } from '../../interface/reporte-cita-extra.interface';
import { AtencionClinicaService } from '../../services/atencion-clinica.service';
import {
  documentoActividad,
  filasConteo,
  resumirActividad,
  tarjetasActividad,
} from '../../utils/actividad-clinica.util';
import { periodoTexto } from '../../utils/reporte-cita-extra.util';
import { filtrarCitas } from '../../utils/reporte-cita.util';
import { FiltroRangoCitaComponent } from '../filtro-rango-cita/filtro-rango-cita.component';
import { GraficoBarrasCitaComponent } from '../grafico-barras-cita/grafico-barras-cita.component';
import { ReporteCitaBase } from '../reporte-cita-marco/reporte-cita.base';
import { ReporteCitaMarcoComponent } from '../reporte-cita-marco/reporte-cita-marco.component';
import { TarjetasReporteCitaComponent } from '../tarjetas-reporte-cita/tarjetas-reporte-cita.component';

const LIMITE_ATENCIONES = 120;
const CONCURRENCIA = 4;

@Component({
  selector: 'app-reporte-actividad-clinica-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReporteCitaMarcoComponent,
    FiltroRangoCitaComponent,
    TarjetasReporteCitaComponent,
    GraficoBarrasCitaComponent,
  ],
  templateUrl: './reporte-actividad-clinica-modal.component.html',
})
export class ReporteActividadClinicaModalComponent
  extends ReporteCitaBase
  implements OnInit, OnDestroy
{
  private readonly atencionService = inject(AtencionClinicaService);
  private suscripcion: Subscription | null = null;

  readonly limite = LIMITE_ATENCIONES;

  cargando = signal(false);
  analizado = signal(false);
  desactualizado = signal(false);
  progreso = signal(0);
  fallidas = signal(0);
  atenciones = signal<AtencionClinica[]>([]);

  medico = computed(() => this.fuente()[0]?.medico ?? 'Médico');

  atendidas = computed(() =>
    filtrarCitas(this.fuente(), {
      desde: this.desde(),
      hasta: this.hasta(),
      idMedico: 'todos',
      estado: 3,
    }).sort((a, b) => `${b.fecha} ${b.inicio}`.localeCompare(`${a.fecha} ${a.inicio}`)),
  );

  aAnalizar = computed(() => this.atendidas().slice(0, LIMITE_ATENCIONES));
  truncado = computed(() => this.atendidas().length > LIMITE_ATENCIONES);

  porcentajeProgreso = computed(() =>
    this.aAnalizar().length > 0 ? Math.round((this.progreso() / this.aAnalizar().length) * 100) : 0,
  );

  resumen = computed(() => resumirActividad(this.atenciones()));
  tarjetas = computed(() => tarjetasActividad(this.resumen()));

  graficoDiagnosticos = computed(() => filasConteo(this.resumen().topDiagnosticos, '#58595B'));
  graficoMedicamentos = computed(() => filasConteo(this.resumen().topMedicamentos, '#0d6b68'));
  graficoExamenes = computed(() => filasConteo(this.resumen().topExamenes, '#58595B'));
  graficoEspecialidades = computed(() => filasConteo(this.resumen().topEspecialidades, '#D9182A'));
  graficoUrgencias = computed(() => filasConteo(this.resumen().urgencias, '#B5B6B8'));
  graficoTipos = computed(() => filasConteo(this.resumen().tiposDiagnostico, '#B5B6B8'));

  documento = computed(() =>
    documentoActividad({
      resumen: this.resumen(),
      periodo: periodoTexto(this.desde(), this.hasta()),
      medico: this.medico(),
      truncado: this.truncado(),
      limite: LIMITE_ATENCIONES,
    }),
  );

  puedeExportar = computed(
    () => this.atenciones().length > 0 && !this.cargando() && !this.generando(),
  );

  ngOnInit(): void {
    this.analizar();
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
  }

  cambiarRango(cambio: CambioRango): void {
    this.aplicarRango(cambio);
    this.desactualizado.set(true);
  }

  analizar(): void {
    if (this.rangoInvalido()) {
      return;
    }

    this.suscripcion?.unsubscribe();

    const citas = this.aAnalizar();

    this.progreso.set(0);
    this.fallidas.set(0);
    this.desactualizado.set(false);

    if (citas.length === 0) {
      this.atenciones.set([]);
      this.analizado.set(true);
      this.cargando.set(false);
      return;
    }

    this.cargando.set(true);

    this.suscripcion = from(citas)
      .pipe(
        mergeMap(
          (cita) =>
            this.atencionService.obtenerAtencion(cita.id).pipe(
              map((respuesta) => respuesta.object ?? null),
              catchError(() => {
                this.fallidas.update((valor) => valor + 1);
                return of(null);
              }),
              tap(() => this.progreso.update((valor) => valor + 1)),
            ),
          CONCURRENCIA,
        ),
        filter((atencion): atencion is AtencionClinica => atencion !== null),
        toArray(),
      )
      .subscribe((lista) => {
        this.atenciones.set(lista);
        this.analizado.set(true);
        this.cargando.set(false);
      });
  }

  exportar(): void {
    void this.generar(this.documento());
  }
}
