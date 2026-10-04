import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import {
  CargoResumen,
  EmpleadoForm,
  GENEROS,
  TipoDocumentoResumen,
  formularioADto,
  formularioVacio,
} from '../../interface/empleado.interface';
import { EmpleadoService } from '../../services/empleado.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-crear-empleado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-empleado-modal.component.html',
})
export class CrearEmpleadoModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEmpleadoCreado = new EventEmitter<void>();

  empleadoForm: EmpleadoForm = formularioVacio();
  cargos: CargoResumen[] = [];
  tiposDocumento: TipoDocumentoResumen[] = [];
  generos = GENEROS;
  hoy = new Date().toISOString().split('T')[0];

  imagen: File | null = null;
  previewUrl: string | null = null;
  cargandoCatalogos = false;
  guardando = false;

  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargandoCatalogos = true;

    forkJoin({
      cargos: this.empleadoService.listarCargosResumen(),
      tipos: this.empleadoService.listarTiposDocumentoResumen(),
    }).subscribe({
      next: ({ cargos, tipos }) => {
        this.cargos = cargos.object || [];
        this.tiposDocumento = tipos.object || [];
        this.cargandoCatalogos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los cargos y tipos de documento.');
        this.cargandoCatalogos = false;
        this.cdr.detectChanges();
      },
    });
  }

  get longitudDocumento(): number | null {
    const tipo = this.tiposDocumento.find(
      (t) => t.idTipoDocumento === this.empleadoForm.idTipoDocumento,
    );
    return tipo ? tipo.longitud : null;
  }

  onTipoDocumentoChange(): void {
    const longitud = this.longitudDocumento;
    if (longitud !== null) {
      this.empleadoForm.numeroDocumento = this.empleadoForm.numeroDocumento.slice(0, longitud);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.toastService.warning('Selecciona un archivo de imagen válido.');
      input.value = '';
      return;
    }

    this.imagen = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  quitarImagen(input: HTMLInputElement): void {
    this.imagen = null;
    this.previewUrl = null;
    input.value = '';
  }

  handleClose(): void {
    this.empleadoForm = formularioVacio();
    this.imagen = null;
    this.previewUrl = null;
    this.onClose.emit();
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    const f = this.empleadoForm;

    if (this.guardando) {
      return;
    }

    if (
      !f.idTipoDocumento ||
      !f.idCargo ||
      !f.numeroDocumento.trim() ||
      !f.nombre.trim() ||
      !f.apellidos.trim()
    ) {
      this.toastService.warning('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.guardando = true;

    this.empleadoService.crear(formularioADto(f), this.imagen).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Empleado agregado con éxito');
        this.guardando = false;
        this.onEmpleadoCreado.emit();
        this.handleClose();
      },
      error: (err) => {
        console.error('Error al guardar el empleado:', err);
        this.toastService.error(err.error?.mensaje || 'No se pudo registrar el empleado.');
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
