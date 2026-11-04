import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';

import {
  ALTURA_HORA,
  DIAS_SEMANA,
  diaSemanaDeFecha,
  formatearMes,
  formatearRangoSemana,
  inicioSemana,
  sumarDias,
} from '../../../horarios/utils/calendario.util';
import { ColumnaSemanaMedico, TramoMedico } from '../../interface/reporte-medico.interface';
import { CitaService } from '../../services/cita.service';
import {
  aTramo,
  citasPorFecha,
  diasDelMes,
  documentoCalendario,
  minutosDeHora,
  resumenDia,
  tarjetasCalendario,
  totalesCalendario,
} from '../../utils/calendario-medico.util';
import { SERIES_ESTADO } from '../../utils/reporte-cita.util';
import { ReporteCitaBase } from '../reporte-cita-marco/reporte-cita.base';
import { ReporteCitaMarcoComponent } from '../reporte-cita-marco/reporte-cita-marco.component';
import { TarjetasReporteCitaComponent } from '../tarjetas-reporte-cita/tarjetas-reporte-cita.component';

type VistaMedico = 'semana' | 'mes';

const ANCHO_GUTTER = 56;
const ANCHO_COLUMNA = 104;

@Component({
  selector: 'app-calendario-medico-modal',
  standalone: true,
  imports: [CommonModule, ReporteCitaMarcoComponent, TarjetasReporteCitaComponent],
  templateUrl: './calendario-medico-modal.component.html',
})
export class CalendarioMedicoModalComponent extends ReporteCitaBase implements OnInit {
  private readonly citaService = inject(CitaService);

  readonly ALTURA = ALTURA_HORA;
  readonly nombresDia = DIAS_SEMANA;
  readonly plantilla = `${ANCHO_GUTTER}px repeat(7, minmax(${ANCHO_COLUMNA}px, 1fr))`;
  readonly anchoMinimo = ANCHO_GUTTER + 7 * ANCHO_COLUMNA;
  readonly hoy = new Date();
  readonly series = SERIES_ESTADO.filter((serie) => serie.estado === 1 || serie.estado === 3);

  tramos = signal<TramoMedico[]>([]);
  cargandoHorario = signal(true);
  errorHorario = signal<string | null>(null);
  vista = signal<VistaMedico>('semana');
  fechaRef = signal(new Date());

  medico = computed(() => this.fuente()[0]?.medico ?? 'Médico');
  mapaCitas = computed(() => citasPorFecha(this.fuente()));

  titulo = computed(() =>
    this.vista() === 'mes'
      ? formatearMes(this.fechaRef())
      : formatearRangoSemana(inicioSemana(this.fechaRef())),
  );

  diasMes = computed(() =>
    diasDelMes(this.fechaRef()).map((fecha) =>
      resumenDia(fecha, this.tramos(), this.mapaCitas(), this.hoy, this.fechaRef().getMonth()),
    ),
  );

  diasSemana = computed(() =>
    Array.from({ length: 7 }, (_, indice) =>
      resumenDia(
        sumarDias(inicioSemana(this.fechaRef()), indice),
        this.tramos(),
        this.mapaCitas(),
        this.hoy,
      ),
    ),
  );

  diasPeriodo = computed(() =>
    this.vista() === 'mes' ? this.diasMes().filter((dia) => dia.delMes) : this.diasSemana(),
  );

  totales = computed(() => totalesCalendario(this.diasPeriodo()));
  tarjetas = computed(() => tarjetasCalendario(this.totales()));

  horaDesde = computed(() => {
    const minutos = this.diasSemana().flatMap((dia) => [
      ...dia.tramos.map((tramo) => tramo.entradaMin),
      ...dia.citas.map((cita) => minutosDeHora(cita.inicio)),
    ]);

    return Math.max(0, Math.min(7, ...minutos.map((valor) => Math.floor(valor / 60))));
  });

  horaHasta = computed(() => {
    const minutos = this.diasSemana().flatMap((dia) => [
      ...dia.tramos.map((tramo) => tramo.salidaMin),
      ...dia.citas.map((cita) => minutosDeHora(cita.salida)),
    ]);

    return Math.min(24, Math.max(19, ...minutos.map((valor) => Math.ceil(valor / 60))));
  });

  horas = computed(() =>
    Array.from(
      { length: this.horaHasta() - this.horaDesde() },
      (_, indice) => this.horaDesde() + indice,
    ),
  );

  alturaTotal = computed(() => this.horas().length * ALTURA_HORA);

  lineaAhora = computed(() => {
    const minutos = this.hoy.getHours() * 60 + this.hoy.getMinutes();
    const desde = this.horaDesde() * 60;
    const hasta = this.horaHasta() * 60;

    return minutos >= desde && minutos <= hasta ? ((minutos - desde) * ALTURA_HORA) / 60 : null;
  });

  columnas = computed<ColumnaSemanaMedico[]>(() => {
    const base = this.horaDesde() * 60;

    return this.diasSemana().map((resumen) => ({
      resumen,
      dia: DIAS_SEMANA[diaSemanaDeFecha(resumen.fecha) - 1],
      horarios: resumen.tramos.map((tramo) => ({
        id: tramo.id,
        top: ((tramo.entradaMin - base) * ALTURA_HORA) / 60,
        alto: ((tramo.salidaMin - tramo.entradaMin) * ALTURA_HORA) / 60,
        texto: `${tramo.entrada} - ${tramo.salida}`,
      })),
      citas: resumen.citas.map((cita) => {
        const inicio = minutosDeHora(cita.inicio);
        const fin = minutosDeHora(cita.salida);

        return {
          cita,
          top: ((inicio - base) * ALTURA_HORA) / 60,
          alto: Math.max(((fin - inicio) * ALTURA_HORA) / 60 - 2, 22),
          color: SERIES_ESTADO.find((serie) => serie.estado === cita.estado)?.color ?? '#58595B',
        };
      }),
    }));
  });

  documento = computed(() =>
    documentoCalendario({
      medico: this.medico(),
      periodo: this.titulo(),
      dias: this.diasPeriodo(),
      tramos: this.tramos(),
    }),
  );

  puedeExportar = computed(
    () => (this.totales().citas > 0 || this.totales().disponibles > 0) && !this.generando(),
  );

  ngOnInit(): void {
    this.citaService.obtenerMiHorario().subscribe({
      next: (respuesta) => {
        this.tramos.set((respuesta.object?.horarios ?? []).map(aTramo));
        this.cargandoHorario.set(false);
      },
      error: (error) => {
        console.error('No se pudo cargar el horario del médico:', error);
        this.errorHorario.set(
          'No se pudo cargar tu horario de atención. Se muestran solo tus citas.',
        );
        this.cargandoHorario.set(false);
      },
    });
  }
  etiquetaHora(hora: number): string {
    return `${String(hora).padStart(2, '0')}:00`;
  }

  cambiarVista(vista: VistaMedico): void {
    this.vista.set(vista);
  }

  mover(direccion: 1 | -1): void {
    const fecha = this.fechaRef();

    this.fechaRef.set(
      this.vista() === 'mes'
        ? new Date(fecha.getFullYear(), fecha.getMonth() + direccion, 1)
        : sumarDias(fecha, 7 * direccion),
    );
  }

  irAHoy(): void {
    this.fechaRef.set(new Date());
  }

  irASemana(fecha: Date): void {
    this.fechaRef.set(fecha);
    this.vista.set('semana');
  }

  exportar(): void {
    void this.generar(this.documento());
  }
}
