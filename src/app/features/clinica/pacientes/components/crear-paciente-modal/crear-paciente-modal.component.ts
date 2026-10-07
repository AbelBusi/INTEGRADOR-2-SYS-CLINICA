import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GENEROS,
  PacienteForm,
  TipoDocumentoResumen,
  fechaMaximaNacimiento,
  formularioACrearDto,
  formularioVacio,
} from '../../interface/paciente.interface';
import { PacienteService } from '../../services/paciente.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ReniecService } from '../../../../../core/services/reniec.service';

@Component({
  selector: 'app-crear-paciente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-paciente-modal.component.html',
})
export class CrearPacienteModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onPacienteCreado = new EventEmitter<void>();

  pacienteForm: PacienteForm = formularioVacio();
  tiposDocumento: TipoDocumentoResumen[] = [];
  generos = GENEROS;
  fechaMaxima = fechaMaximaNacimiento();

  cargandoCatalogos = false;
  guardando = false;
  consultandoReniec = false;

  private readonly reniecService = inject(ReniecService);

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargandoCatalogos = true;

    this.pacienteService.listarTiposDocumentoResumen().subscribe({
      next: (response) => {
        this.tiposDocumento = response.object || [];
        this.cargandoCatalogos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los tipos de documento.');
        this.cargandoCatalogos = false;
        this.cdr.detectChanges();
      },
    });
  }

  get longitudDocumento(): number | null {
    const tipo = this.tiposDocumento.find(
      (t) => t.idTipoDocumento === this.pacienteForm.idTipoDocumento,
    );
    return tipo ? tipo.longitud : null;
  }

  get esDni(): boolean {
    const tipo = this.tiposDocumento.find(
      (t) => t.idTipoDocumento === this.pacienteForm.idTipoDocumento,
    );
    return tipo?.codigo.toUpperCase() === 'DNI';
  }

  onTipoDocumentoChange(): void {
    const longitud = this.longitudDocumento;
    if (longitud !== null) {
      this.pacienteForm.numeroDocumento = this.pacienteForm.numeroDocumento.slice(0, longitud);
    }
  }

  consultarReniec(): void {
    const dni = this.pacienteForm.numeroDocumento.trim();

    if (!this.esDni || dni.length !== 8) {
      this.toastService.warning('Ingrese un DNI válido de 8 dígitos para consultar.');
      return;
    }

    this.consultandoReniec = true;

    this.reniecService.consultarDni(dni).subscribe({
      next: (datos) => {
        this.consultandoReniec = false;
        if (datos) {
          this.pacienteForm.nombre = datos.nombre;
          this.pacienteForm.apellidos = datos.apellidos;
          this.toastService.success('Datos de RENIEC cargados correctamente.');
        } else {
          this.toastService.warning('No se encontraron datos para el DNI ingresado.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.consultandoReniec = false;
        this.toastService.error('Ocurrió un error al consultar la RENIEC.');
        this.cdr.detectChanges();
      },
    });
  }

  soloNumeros(event: KeyboardEvent): void {
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !/\d/.test(event.key)) {
      event.preventDefault();
    }
  }

  handleClose(): void {
    this.pacienteForm = formularioVacio();
    this.onClose.emit();
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    const f = this.pacienteForm;

    if (this.guardando) {
      return;
    }

    if (
      !f.idTipoDocumento ||
      !f.numeroDocumento.trim() ||
      !f.nombre.trim() ||
      !f.apellidos.trim() ||
      !f.entidadAsegurado.trim() ||
      !f.codigoAsegurado.trim()
    ) {
      this.toastService.warning('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.guardando = true;

    this.pacienteService.crear(formularioACrearDto(f)).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Paciente agregado con éxito');
        this.guardando = false;
        this.onPacienteCreado.emit();
        this.handleClose();
      },
      error: (err) => {
        console.error('Error al guardar el paciente:', err);
        this.toastService.error(err.error?.mensaje || 'No se pudo registrar el paciente.');
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
