import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';

import { ToastService } from '../../../../../core/services/toast.service';
import { AtencionHistoria, HistoriaClinica } from '../../interface/historia-clinica.interface';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { mensajeError } from '../../utils/historia-clinica.util';
import { descargarHistoriaClinicaPdf } from '../../utils/historia-clinica-pdf.util';
import { HcAlergiasComponent } from '../hc-alergias/hc-alergias.component';
import { HcAntecedentesFamiliaresComponent } from '../hc-antecedentes-familiares/hc-antecedentes-familiares.component';
import { HcAntecedentesPersonalesComponent } from '../hc-antecedentes-personales/hc-antecedentes-personales.component';
import { HcAuditoriaComponent } from '../hc-auditoria/hc-auditoria.component';
import { HcAtencionesComponent } from '../hc-atenciones/hc-atenciones.component';
import { HcDatosGeneralesFormModalComponent } from '../hc-datos-generales-form-modal/hc-datos-generales-form-modal.component';
import { HcDatosGeneralesComponent } from '../hc-datos-generales/hc-datos-generales.component';
import { HcModalShellComponent } from '../hc-modal-shell/hc-modal-shell.component';

type Pestana = 'datos' | 'personales' | 'familiares' | 'alergias' | 'atenciones' | 'auditoria';

/**
 * Modal de consulta de la historia clínica. Se reutiliza desde:
 *  - Historias Clínicas (lista)         -> [idPaciente]
 *  - Pacientes ("Ver historia clínica") -> [idPaciente] [nombrePaciente]
 *  - Mis citas del médico               -> [idPaciente] [nombrePaciente]
 *  - Portal del paciente                -> [miHistoria]="true"
 */
@Component({
  selector: 'app-ver-historia-clinica-modal',
  standalone: true,
  imports: [
    CommonModule,
    HcModalShellComponent,
    HcDatosGeneralesComponent,
    HcDatosGeneralesFormModalComponent,
    HcAntecedentesPersonalesComponent,
    HcAntecedentesFamiliaresComponent,
    HcAlergiasComponent,
    HcAtencionesComponent,
    HcAuditoriaComponent,
  ],
  templateUrl: './ver-historia-clinica-modal.component.html',
})
export class VerHistoriaClinicaModalComponent implements OnInit {
  /** Id del paciente cuya historia se consulta. Ignorado si miHistoria = true. */
  @Input() idPaciente: number | null = null;
  /** Nombre a mostrar mientras no exista historia (para el estado vacío). */
  @Input() nombrePaciente = '';
  /** true = el paciente autenticado consulta la suya (solo lectura, identidad por JWT). */
  @Input() miHistoria = false;

  @Output() cerrar = new EventEmitter<void>();
  /** Se emite al cerrar si hubo alguna creación o modificación, para refrescar listados. */
  @Output() historiaCambiada = new EventEmitter<void>();


  readonly pestanas: { id: Pestana; texto: string; icono: string }[] = [
    { id: 'datos', texto: 'Datos generales', icono: 'badge' },
    { id: 'personales', texto: 'Antecedentes personales', icono: 'history_edu' },
    { id: 'familiares', texto: 'Antecedentes familiares', icono: 'family_restroom' },
    { id: 'alergias', texto: 'Alergias', icono: 'warning_amber' },
    { id: 'atenciones', texto: 'Atenciones médicas', icono: 'medical_services' },
    { id: 'auditoria', texto: 'Auditoría', icono: 'history' },
  ];

  /** La auditoría se consulta solo desde el lado del médico; el paciente la ve en su panel. */
  pestanasVisibles(): { id: Pestana; texto: string; icono: string }[] {
    return this.miHistoria ? this.pestanas.filter((p) => p.id !== 'auditoria') : this.pestanas;
  }

  pestana = signal<Pestana>('datos');
  historia = signal<HistoriaClinica | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  sinHistoria = signal(false);

  atenciones = signal<AtencionHistoria[]>([]);
  cargandoAtenciones = signal(false);
  errorAtenciones = signal<string | null>(null);

  datosFormAbierto = signal(false);
  generandoPdf = signal(false);
  private huboCambios = false;

  subtitulo = computed(() => {
    const hc = this.historia();
    return hc ? `${hc.numeroHistoria} · ${hc.paciente.nombreCompleto}` : this.nombrePaciente;
  });

  constructor(
    private readonly servicio: HistoriaClinicaService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarHistoria(false);
    this.cargarAtenciones();
  }

  contador(id: Pestana): number | null {
    const hc = this.historia();
    if (!hc) {
      return null;
    }
    switch (id) {
      case 'personales':
        return hc.antecedentesPersonales.length;
      case 'familiares':
        return hc.antecedentesFamiliares.length;
      case 'alergias':
        return hc.alergias.length;
      case 'atenciones':
        return this.cargandoAtenciones() ? null : this.atenciones().length;
      default:
        return null;
    }
  }

  cargarHistoria(silencioso: boolean): void {
    if (!silencioso) {
      this.cargando.set(true);
    }
    this.error.set(null);

    const peticion = this.miHistoria
      ? this.servicio.obtenerMiHistoria()
      : this.idPaciente !== null
        ? this.servicio.obtenerPorPaciente(this.idPaciente)
        : null;

    if (!peticion) {
      this.error.set('No se indicó el paciente cuya historia clínica se desea consultar.');
      this.cargando.set(false);
      return;
    }

    peticion.subscribe({
      next: (response) => {
        this.historia.set(response.object);
        this.sinHistoria.set(false);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar la historia clínica:', error);
        if (error.status === 404) {
          this.sinHistoria.set(true);
          this.historia.set(null);
        } else {
          this.error.set(
            mensajeError(
              error,
              error.status === 403
                ? 'No tienes autorización para consultar esta historia clínica.'
                : 'No se pudo cargar la historia clínica. Inténtalo de nuevo.',
            ),
          );
        }
        this.cargando.set(false);
      },
    });
  }

  cargarAtenciones(): void {
    this.cargandoAtenciones.set(true);
    this.errorAtenciones.set(null);

    const idPaciente = this.miHistoria ? null : this.idPaciente;
    if (!this.miHistoria && idPaciente === null) {
      this.cargandoAtenciones.set(false);
      return;
    }

    this.servicio.obtenerTodasAtenciones(idPaciente).subscribe({
      next: (atenciones) => {
        this.atenciones.set(atenciones);
        this.cargandoAtenciones.set(false);
      },
      error: (error) => {
        console.error('Error al cargar las atenciones:', error);
        this.errorAtenciones.set(
          mensajeError(error, 'No se pudieron cargar las atenciones médicas.'),
        );
        this.cargandoAtenciones.set(false);
      },
    });
  }

  /** Tras crear/editar/eliminar un registro de la historia: recarga sin parpadeo. */
  alCambiar(): void {
    this.huboCambios = true;
    this.cargarHistoria(true);
  }

  alGuardarDatos(historia: HistoriaClinica): void {
    this.huboCambios = true;
    this.historia.set(historia);
    this.sinHistoria.set(false);
    this.error.set(null);
    this.datosFormAbierto.set(false);
    this.pestana.set('datos');
  }

  /** Otro médico guardó antes: se cierra el formulario y se muestran los datos vigentes. */
  alConflicto(): void {
    this.datosFormAbierto.set(false);
    this.cargarHistoria(true);
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

  alCerrar(): void {
    if (this.huboCambios) {
      this.historiaCambiada.emit();
    }
    this.cerrar.emit();
  }
}
