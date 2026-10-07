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
import { forkJoin } from 'rxjs';
import {
  GENEROS,
  Paciente,
  PacienteDetalle,
  PacienteForm,
  TipoDocumentoResumen,
  NACIONALIDADES,
  fechaMaximaNacimiento,
  formularioAActualizarDto,
  formularioVacio,
} from '../../interface/paciente.interface';
import { PacienteService } from '../../services/paciente.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-paciente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-paciente-modal.component.html',
})
export class EditarPacienteModalComponent implements OnChanges {
  @Input() paciente: Paciente | null = null;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onPacienteEditado = new EventEmitter<void>();

  pacienteForm: PacienteForm = formularioVacio();
  tiposDocumento: TipoDocumentoResumen[] = [];
  generos = GENEROS;
  fechaMaxima = fechaMaximaNacimiento();
  nacionalidades = NACIONALIDADES;

  cargandoDatos = false;
  guardando = false;

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paciente'] && this.paciente) {
      this.cargarDatos(this.paciente.id);
    }
  }

  get longitudDocumento(): number | null {
    const tipo = this.tiposDocumento.find(
      (t) => t.idTipoDocumento === this.pacienteForm.idTipoDocumento,
    );
    return tipo ? tipo.longitud : null;
  }

  private cargarDatos(id: number): void {
    this.cargandoDatos = true;

    forkJoin({
      detalle: this.pacienteService.obtenerPorId(id),
      tipos: this.pacienteService.listarTiposDocumentoResumen(),
    }).subscribe({
      next: ({ detalle, tipos }) => {
        this.tiposDocumento = tipos.object || [];
        this.llenarFormulario(detalle.object);
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los datos del paciente.');
        this.cargandoDatos = false;
        this.handleClose();
      },
    });
  }

  private llenarFormulario(detalle: PacienteDetalle): void {
    this.pacienteForm = {
      idTipoDocumento: detalle.idTipoDocumento,
      numeroDocumento: detalle.numeroDocumento || '',
      nombre: detalle.nombre || '',
      apellidos: detalle.apellidos || '',
      fechaNacimiento: detalle.fechaNacimiento || '',
      genero: detalle.genero || '',
      telefono: detalle.telefono || '',
      direccion: detalle.direccion || '',
      correo: detalle.correo || '',
      nacionalidad: detalle.nacionalidad || '',
      entidadAsegurado: detalle.entidadAsegurado || '',
      codigoAsegurado: detalle.codigoAsegurado || '',
    };
  }

  onTipoDocumentoChange(): void {
    const longitud = this.longitudDocumento;
    if (longitud !== null) {
      this.pacienteForm.numeroDocumento = this.pacienteForm.numeroDocumento.slice(0, longitud);
    }
  }

  soloNumeros(event: KeyboardEvent): void {
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !/\d/.test(event.key)) {
      event.preventDefault();
    }
  }

  handleClose(): void {
    this.onClose.emit();
  }

  onSubmit(): void {
    const f = this.pacienteForm;

    if (!this.paciente?.id || this.guardando) {
      return;
    }

    if (
      !f.idTipoDocumento ||
      !f.numeroDocumento.trim() ||
      !f.nombre.trim() ||
      !f.apellidos.trim() ||
      !f.nacionalidad.trim() ||
      !f.codigoAsegurado.trim()
    ) {
      this.toastService.warning('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.guardando = true;

    this.pacienteService.actualizar(this.paciente.id, formularioAActualizarDto(f)).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Paciente actualizado con éxito');
        this.guardando = false;
        this.onPacienteEditado.emit();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'Hubo un error al actualizar el paciente');
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
