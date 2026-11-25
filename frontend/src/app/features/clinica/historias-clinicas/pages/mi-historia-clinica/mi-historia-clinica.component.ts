import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  HcPacienteDetalleModalComponent,
  SeccionPaciente,
} from '../../components/hc-paciente-detalle-modal/hc-paciente-detalle-modal.component';
import { HcPanelCaratulaComponent } from '../../components/hc-panel-caratula/hc-panel-caratula.component';
import { AtencionHistoria, HistoriaClinica } from '../../interface/historia-clinica.interface';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { formatearFecha, mensajeError } from '../../utils/historia-clinica.util';
import { descargarHistoriaClinicaPdf } from '../../utils/historia-clinica-pdf.util';

/**
 * Panel del paciente con toda su historia clínica (solo lectura).
 * Solo accede a la propia: la identidad la determina el backend por JWT (/mi-historia).
 */
@Component({
  selector: 'app-mi-historia-clinica',
  standalone: true,
  imports: [CommonModule, HcPanelCaratulaComponent, HcPacienteDetalleModalComponent],
  templateUrl: './mi-historia-clinica.component.html',
})
export class MiHistoriaClinicaComponent implements OnInit {
  /** Sección abierta en el modal (null = ninguna). */
  seccionAbierta = signal<SeccionPaciente | null>(null);

  historia = signal<HistoriaClinica | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  sinHistoria = signal(false);

  atenciones = signal<AtencionHistoria[]>([]);
  cargandoAtenciones = signal(false);
  errorAtenciones = signal<string | null>(null);

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

  abrir(seccion: SeccionPaciente): void {
    this.seccionAbierta.set(seccion);
  }

  totalDiagnosticos(): number {
    return this.atenciones().reduce((n, a) => n + a.diagnosticos.length, 0);
  }

  totalTratamientos(): number {
    return this.atenciones().reduce(
      (n, a) => n + a.diagnosticos.reduce((m, d) => m + d.tratamientos.length, 0),
      0,
    );
  }

  readonly grupos = [
    {
      id: 'atencion',
      titulo: 'Mi atención médica',
      descripcion: 'Lo que ocurrió en tus consultas.',
    },
    {
      id: 'antecedentes',
      titulo: 'Mis antecedentes de salud',
      descripcion: 'Alergias y enfermedades previas, tuyas y de tu familia.',
    },
    {
      id: 'control',
      titulo: 'Control de la información',
      descripcion: 'Seguimiento de los cambios hechos a tu historia.',
    },
  ] as const;

  tarjetasDe(hc: HistoriaClinica, grupo: string) {
    return this.tarjetas(hc).filter((t) => t.grupo === grupo);
  }

  /** Tarjetas del panel: qué quiere ver el paciente, con un dato resumen de cada una. */
  tarjetas(hc: HistoriaClinica): {
    id: SeccionPaciente;
    titulo: string;
    pregunta: string;
    icono: string;
    grupo: 'atencion' | 'antecedentes' | 'control';
    cifra: string;
    unidad: string;
    detalle: string;
    alerta?: boolean;
  }[] {
    const cargando = this.cargandoAtenciones();
    const fallo = !!this.errorAtenciones();
    const dato = (n: number) => (cargando ? '…' : fallo ? '–' : `${n}`);
    const ultima = this.atenciones()[0];

    return [
      {
        id: 'atenciones',
        grupo: 'atencion',
        unidad: 'citas',
        titulo: 'Mis citas atendidas',
        pregunta: '¿Cuándo y con quién me atendí?',
        icono: 'event_available',
        cifra: dato(this.atenciones().length),
        detalle: ultima ? `Última: ${formatearFecha(ultima.fechaCita)}` : 'Aún sin atenciones',
      },
      {
        id: 'tratamientos',
        grupo: 'atencion',
        unidad: 'medicamentos',
        titulo: 'Mis tratamientos',
        pregunta: '¿Qué medicinas me recetaron?',
        icono: 'medication',
        cifra: dato(this.totalTratamientos()),
        detalle: 'Medicamentos recetados',
      },
      {
        id: 'diagnosticos',
        grupo: 'atencion',
        unidad: 'diagnósticos',
        titulo: 'Mis diagnósticos',
        pregunta: '¿Qué me han diagnosticado?',
        icono: 'fact_check',
        cifra: dato(this.totalDiagnosticos()),
        detalle: 'Registrados por mis médicos',
      },
      {
        id: 'alergias',
        grupo: 'antecedentes',
        unidad: 'alergias',
        titulo: 'Mis alergias',
        pregunta: '¿A qué soy alérgico?',
        icono: 'warning_amber',
        cifra: `${hc.alergias.length}`,
        detalle: hc.alergias.length ? 'Importante tenerlas presentes' : 'Ninguna registrada',
        alerta: hc.alergias.length > 0,
      },
      {
        id: 'personales',
        grupo: 'antecedentes',
        unidad: 'registros',
        titulo: 'Antecedentes personales',
        pregunta: '¿Qué enfermedades o cirugías he tenido?',
        icono: 'history_edu',
        cifra: `${hc.antecedentesPersonales.length}`,
        detalle: 'Mi historial de salud',
      },
      {
        id: 'familiares',
        grupo: 'antecedentes',
        unidad: 'registros',
        titulo: 'Antecedentes familiares',
        pregunta: '¿Qué enfermedades hay en mi familia?',
        icono: 'family_restroom',
        cifra: `${hc.antecedentesFamiliares.length}`,
        detalle: 'Condiciones en mi familia',
      },
      {
        id: 'auditoria',
        grupo: 'control',
        unidad: '',
        titulo: 'Registro de cambios',
        pregunta: '¿Quién modificó mi historia?',
        icono: 'history',
        cifra: '',
        detalle: 'Ver quién cambió qué y cuándo',
      },
    ];
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
