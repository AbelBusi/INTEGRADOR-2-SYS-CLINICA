import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, forkJoin } from 'rxjs';
import {
  CONSEJOS_REGIONALES,
  EmpleadoMedicoResumen,
  EspecialidadResumen,
  MedicoForm,
  consejoAleatorio,
  esperar,
  formularioACrearDto,
  formularioVacio,
  generarNumeroColegiatura,
  generarNumeroEspecialidad,
} from '../../interface/medico.interface';
import { MedicoService } from '../../services/medico.service';
import { ToastService } from '../../../../../core/services/toast.service';

const MAX_INTENTOS = 5;

@Component({
  selector: 'app-crear-medico-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-medico-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearMedicoModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onMedicoCreado = new EventEmitter<void>();

  // Inyección moderna de servicios
  private readonly medicoService = inject(MedicoService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  medicoForm: MedicoForm = formularioVacio();
  empleados: EmpleadoMedicoResumen[] = [];
  especialidades: EspecialidadResumen[] = [];
  consejos = CONSEJOS_REGIONALES;
  esDesarrollo = true;

  cargandoCatalogos = false;
  generando = false;
  guardando = false;

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si el modal se acaba de abrir, reiniciamos el formulario
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.medicoForm = formularioVacio();
    }
  }

  private cargarCatalogos(): void {
    this.cargandoCatalogos = true;

    forkJoin({
      empleados: this.medicoService.listarEmpleadosMedicos(),
      especialidades: this.medicoService.listarEspecialidadesResumen(),
    }).subscribe({
      next: ({ empleados, especialidades }) => {
        this.empleados = empleados.object || [];
        this.especialidades = especialidades.object || [];
        this.cargandoCatalogos = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar catálogos:', error);
        this.toastService.error('No se pudieron cargar los empleados y especialidades.');
        this.cargandoCatalogos = false;
        this.cdr.markForCheck();
      },
    });
  }

  async generarCodigosUnicos(): Promise<void> {
    if (this.generando) return;

    this.generando = true;
    this.cdr.markForCheck();

    try {
      let colegiatura = generarNumeroColegiatura();
      let especialidad = generarNumeroEspecialidad();

      for (let intento = 0; intento < MAX_INTENTOS; intento++) {
        const [respuesta] = await Promise.all([
          firstValueFrom(this.medicoService.verificarDisponibilidad(colegiatura, especialidad)),
          intento === 0 ? esperar(900) : Promise.resolve(),
        ]);

        const { colegiaturaDisponible, especialidadDisponible } = respuesta.object;

        if (colegiaturaDisponible && especialidadDisponible) {
          this.medicoForm = {
            ...this.medicoForm,
            numeroColegiatura: colegiatura,
            numeroEspecialidad: especialidad,
            consejoRegional: consejoAleatorio(),
          };
          return;
        }

        if (!colegiaturaDisponible) colegiatura = generarNumeroColegiatura();
        if (!especialidadDisponible) especialidad = generarNumeroEspecialidad();
      }

      this.toastService.warning('No se pudo generar un código disponible. Inténtalo de nuevo.');
    } catch (error) {
      console.error('Error al verificar disponiblidad:', error);
      this.toastService.error('No se pudo consultar la disponibilidad de los códigos.');
    } finally {
      this.generando = false;
      this.cdr.markForCheck();
    }
  }

  handleClose(): void {
    if (this.guardando) return;
    this.medicoForm = formularioVacio();
    this.onClose.emit();
  }

  onSubmit(): void {
    const f = this.medicoForm;

    if (this.guardando || this.generando) return;

    if (!f.idEmpleado || !f.idEspecialidad || !f.numeroColegiatura.trim()) {
      this.toastService.warning('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.guardando = true;

    this.medicoService.crear(formularioACrearDto(f)).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Médico agregado con éxito');
        this.guardando = false;
        this.onMedicoCreado.emit();
        this.handleClose();
      },
      error: (err) => {
        console.error('Error al guardar el médico:', err);
        this.toastService.error(err.error?.mensaje || 'No se pudo registrar el médico.');
        this.guardando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
