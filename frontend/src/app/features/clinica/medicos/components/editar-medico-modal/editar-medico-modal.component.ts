import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, forkJoin } from 'rxjs';
import {
  CONSEJOS_REGIONALES,
  EspecialidadResumen,
  Medico,
  MedicoDetalle,
  MedicoForm,
  esperar,
  formularioAActualizarDto,
  formularioVacio,
} from '../../interface/medico.interface';
import { MedicoService } from '../../services/medico.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-medico-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-medico-modal.component.html',
})
export class EditarMedicoModalComponent implements OnChanges {
  @Input() medico: Medico | null = null;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onMedicoEditado = new EventEmitter<void>();

  medicoForm: MedicoForm = formularioVacio();
  detalle: MedicoDetalle | null = null;
  especialidades: EspecialidadResumen[] = [];

  cargandoDatos = false;
  consultando = false;
  guardando = false;

  constructor(
    private readonly medicoService: MedicoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['medico'] && this.medico) {
      this.cargarDatos(this.medico.id);
    }
  }

  get fotoUrl(): string | null {
    return this.medicoService.obtenerUrlFoto(this.detalle?.foto);
  }

  get consejos(): string[] {
    const guardado = this.detalle?.consejoRegional;
    return guardado && !CONSEJOS_REGIONALES.includes(guardado)
      ? [guardado, ...CONSEJOS_REGIONALES]
      : CONSEJOS_REGIONALES;
  }

  private cargarDatos(id: number): void {
    this.cargandoDatos = true;

    forkJoin({
      detalle: this.medicoService.obtenerPorId(id),
      especialidades: this.medicoService.listarEspecialidadesResumen(),
    }).subscribe({
      next: ({ detalle, especialidades }) => {
        this.especialidades = especialidades.object || [];
        this.detalle = detalle.object;
        this.llenarFormulario(detalle.object);
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los datos del médico.');
        this.cargandoDatos = false;
        this.handleClose();
      },
    });
  }

  private llenarFormulario(detalle: MedicoDetalle): void {
    this.medicoForm = {
      idEmpleado: detalle.idEmpleado,
      idEspecialidad: detalle.idEspecialidad,
      numeroColegiatura: detalle.numeroColegiatura || '',
      numeroEspecialidad: detalle.numeroEspecialidad || '',
      consejoRegional: detalle.consejoRegional || '',
    };
  }

  async consultarDatosGuardados(): Promise<void> {
    if (!this.medico?.id || this.consultando) {
      return;
    }

    this.consultando = true;
    this.cdr.detectChanges();

    try {
      const [respuesta] = await Promise.all([
        firstValueFrom(this.medicoService.obtenerPorId(this.medico.id)),
        esperar(800),
      ]);

      const guardado = respuesta.object;

      this.detalle = guardado;
      this.medicoForm = {
        ...this.medicoForm,
        numeroColegiatura: guardado.numeroColegiatura || '',
        numeroEspecialidad: guardado.numeroEspecialidad || '',
        consejoRegional: guardado.consejoRegional || '',
      };
    } catch (error) {
      console.error(error);
      this.toastService.error('No se pudieron consultar los datos guardados.');
    } finally {
      this.consultando = false;
      this.cdr.detectChanges();
    }
  }

  handleClose(): void {
    this.onClose.emit();
  }

  onSubmit(): void {
    const f = this.medicoForm;

    if (!this.medico?.id || this.guardando || this.consultando) {
      return;
    }

    if (!f.idEspecialidad || !f.numeroColegiatura.trim()) {
      this.toastService.warning('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.guardando = true;

    this.medicoService.actualizar(this.medico.id, formularioAActualizarDto(f)).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Médico actualizado con éxito');
        this.guardando = false;
        this.onMedicoEditado.emit();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'Hubo un error al actualizar el médico');
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
