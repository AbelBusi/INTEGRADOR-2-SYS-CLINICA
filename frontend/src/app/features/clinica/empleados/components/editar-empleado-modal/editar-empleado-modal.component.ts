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
  CargoResumen,
  Empleado,
  EmpleadoDetalle,
  EmpleadoForm,
  GENEROS,
  NACIONALIDADES,
  TipoDocumentoResumen,
  formularioADto,
  formularioVacio,
  fechaMaximaNacimiento,
} from '../../interface/empleado.interface';
import { EmpleadoService } from '../../services/empleado.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-editar-empleado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-empleado-modal.component.html',
})
export class EditarEmpleadoModalComponent implements OnChanges {
  @Input() empleado: Empleado | null = null;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEmpleadoEditado = new EventEmitter<void>();

  empleadoForm: EmpleadoForm = formularioVacio();
  cargos: CargoResumen[] = [];
  tiposDocumento: TipoDocumentoResumen[] = [];
  generos = GENEROS;
  nacionalidades = NACIONALIDADES;
  fechaMaxima = fechaMaximaNacimiento();

  fotoActual: string | null = null;
  imagen: File | null = null;
  previewUrl: string | null = null;
  cargandoDatos = false;
  guardando = false;

  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleado'] && this.empleado) {
      this.cargarDatos(this.empleado.id);
    }
  }

  soloLetras(event: KeyboardEvent): void {
    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  limpiarNombre(): void {
    this.empleadoForm.nombre = this.empleadoForm.nombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
  }

  limpiarApellidos(): void {
    this.empleadoForm.apellidos = this.empleadoForm.apellidos.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g,
      '',
    );
  }

  get fotoMostrada(): string | null {
    return this.previewUrl ?? this.empleadoService.obtenerUrlFoto(this.fotoActual);
  }

  get longitudDocumento(): number | null {
    const tipo = this.tiposDocumento.find(
      (t) => t.idTipoDocumento === this.empleadoForm.idTipoDocumento,
    );
    return tipo ? tipo.longitud : null;
  }

  private cargarDatos(id: number): void {
    this.cargandoDatos = true;

    forkJoin({
      detalle: this.empleadoService.obtenerPorId(id),
      cargos: this.empleadoService.listarCargosResumen(),
      tipos: this.empleadoService.listarTiposDocumentoResumen(),
    }).subscribe({
      next: ({ detalle, cargos, tipos }) => {
        this.cargos = cargos.object || [];
        this.tiposDocumento = tipos.object || [];
        this.llenarFormulario(detalle.object);
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los datos del empleado.');
        this.cargandoDatos = false;
        this.handleClose();
      },
    });
  }

  soloNumeros(event: KeyboardEvent): void {
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !/\d/.test(event.key)) {
      event.preventDefault();
    }
  }

  private llenarFormulario(detalle: EmpleadoDetalle): void {
    this.empleadoForm = {
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
      idCargo: detalle.idCargo,
    };
    this.fotoActual = detalle.foto;
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

  descartarNuevaImagen(input: HTMLInputElement): void {
    this.imagen = null;
    this.previewUrl = null;
    input.value = '';
  }

  handleClose(): void {
    this.onClose.emit();
  }

  onSubmit(): void {
    const f = this.empleadoForm;

    if (!this.empleado?.id || this.guardando) {
      return;
    }

    if (
      !f.idTipoDocumento ||
      !f.idCargo ||
      !f.numeroDocumento.trim() ||
      !f.nombre.trim() ||
      !f.apellidos.trim() ||
      !f.nacionalidad.trim()
    ) {
      this.toastService.warning('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.guardando = true;

    this.empleadoService.actualizar(this.empleado.id, formularioADto(f), this.imagen).subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || 'Empleado actualizado con éxito');
        this.guardando = false;
        this.onEmpleadoEditado.emit();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'Hubo un error al actualizar el empleado');
        this.guardando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
