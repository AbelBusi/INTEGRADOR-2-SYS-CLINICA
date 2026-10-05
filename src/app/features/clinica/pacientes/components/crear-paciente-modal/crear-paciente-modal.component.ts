import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
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
