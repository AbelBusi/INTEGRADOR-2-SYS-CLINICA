import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

import { ToastService } from '../../../../../core/services/toast.service';
import { HcAuditoriaComponent } from '../../components/hc-auditoria/hc-auditoria.component';
import { HcPanelAlergiasComponent } from '../../components/hc-panel-alergias/hc-panel-alergias.component';
import { HcPanelAntecedentesFamiliaresComponent } from '../../components/hc-panel-antecedentes-familiares/hc-panel-antecedentes-familiares.component';
import { HcPanelAntecedentesPersonalesComponent } from '../../components/hc-panel-antecedentes-personales/hc-panel-antecedentes-personales.component';
import { HcPanelAtencionesComponent } from '../../components/hc-panel-atenciones/hc-panel-atenciones.component';
import { HcPanelCaratulaComponent } from '../../components/hc-panel-caratula/hc-panel-caratula.component';
import { HcPanelSeccionComponent } from '../../components/hc-panel/hc-panel-seccion.component';
import { AtencionHistoria, HistoriaClinica } from '../../interface/historia-clinica.interface';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { mensajeError } from '../../utils/historia-clinica.util';
import { descargarHistoriaClinicaPdf } from '../../utils/historia-clinica-pdf.util';

/**
 * Panel del paciente con toda su historia clínica (solo lectura).
 * Solo accede a la propia: la identidad la determina el backend por JWT (/mi-historia).
 */
@Component({
  selector: 'app-mi-historia-clinica',
  standalone: true,
  imports: [
    CommonModule,
    HcPanelCaratulaComponent,
    HcPanelSeccionComponent,
    HcPanelAntecedentesPersonalesComponent,
    HcPanelAntecedentesFamiliaresComponent,
    HcPanelAlergiasComponent,
    HcPanelAtencionesComponent,
    HcAuditoriaComponent,
  ],
  templateUrl: './mi-historia-clinica.component.html',
})
export class MiHistoriaClinicaComponent implements OnInit {
  readonly indice = [
    { id: 'hc-datos', texto: 'Datos generales', icono: 'badge' },
    { id: 'hc-personales', texto: 'Antecedentes personales', icono: 'history_edu' },
    { id: 'hc-familiares', texto: 'Antecedentes familiares', icono: 'family_restroom' },
    { id: 'hc-alergias', texto: 'Alergias', icono: 'warning_amber' },
    { id: 'hc-atenciones', texto: 'Atenciones médicas', icono: 'medical_services' },
    { id: 'hc-auditoria', texto: 'Registro de cambios', icono: 'history' },
  ];

  historia = signal<HistoriaClinica | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  sinHistoria = signal(false);

  atenciones = signal<AtencionHistoria[]>([]);
  cargandoAtenciones = signal(false);
  errorAtenciones = signal<string | null>(null);

  auditoriaAbierta = signal(false);
  generandoPdf = signal(false);

  constructor(
    private readonly servicio: HistoriaClinicaService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarHistoria();
  }

  cargarHistoria(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.servicio.obtenerMiHistoria().subscribe({
      next: (response) => {
        this.historia.set(response.object);
        this.sinHistoria.set(false);
        this.cargando.set(false);
        this.cargarAtenciones();
      },
      error: (error) => {
        console.error('Error al cargar mi historia clínica:', error);
        if (error.status === 404) {
          this.sinHistoria.set(true);
          this.historia.set(null);
        } else {
          this.error.set(
            mensajeError(error, 'No se pudo cargar tu historia clínica. Inténtalo de nuevo.'),
          );
        }
        this.cargando.set(false);
      },
    });
  }

  cargarAtenciones(): void {
    this.cargandoAtenciones.set(true);
    this.errorAtenciones.set(null);

    this.servicio.obtenerTodasAtenciones(null).subscribe({
      next: (atenciones) => {
        this.atenciones.set(atenciones);
        this.cargandoAtenciones.set(false);
      },
      error: (error) => {
        console.error('Error al cargar las atenciones:', error);
        this.errorAtenciones.set(
          mensajeError(error, 'No se pudieron cargar tus atenciones médicas.'),
        );
        this.cargandoAtenciones.set(false);
      },
    });
  }

  irA(id: string): void {
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }

  verAuditoria(): void {
    this.auditoriaAbierta.set(true);
  }

  generarPdf(): void {
    const hc = this.historia();

    if (!hc || this.generandoPdf() || this.cargandoAtenciones()) {
      return;
    }

    if (this.errorAtenciones()) {
      this.toastService.error(
        'No se pudieron cargar las atenciones; reintenta antes de generar el PDF para no omitirlas.',
      );
      return;
    }

    this.generandoPdf.set(true);

    try {
      descargarHistoriaClinicaPdf(hc, this.atenciones());
    } catch (error) {
      console.error('Error al generar el PDF de la historia clínica:', error);
      this.toastService.error('No se pudo generar el PDF de la historia clínica.');
    } finally {
      this.generandoPdf.set(false);
    }
  }
}
