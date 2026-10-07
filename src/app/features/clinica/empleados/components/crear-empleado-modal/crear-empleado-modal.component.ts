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
import { forkJoin } from 'rxjs';
import {
  CargoResumen,
  EmpleadoForm,
  GENEROS,
  TipoDocumentoResumen,
  formularioADto,
  formularioVacio,
  fechaMaximaNacimiento,
} from '../../interface/empleado.interface';
import { EmpleadoService } from '../../services/empleado.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ReniecService } from '../../../../../core/services/reniec.service'; // Adjust path as needed

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
  fechaMaxima = fechaMaximaNacimiento();
  imagen: File | null = null;
  previewUrl: string | null = null;
  cargandoCatalogos = false;
  guardando = false;
  consultandoDni = false;

  private readonly empleadoService = inject(EmpleadoService);
  private readonly toastService = inject(ToastService);
  private readonly reniecService = inject(ReniecService);
  private readonly cdr = inject(ChangeDetectorRef);


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

  get esDni(): boolean {
    const tipo = this.tiposDocumento.find(
      (t) => t.idTipoDocumento === this.empleadoForm.idTipoDocumento,
    );
    return tipo ? tipo.codigo.toUpperCase() === 'DNI' : false;
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

  buscarPorDni(): void {
    const dni = this.empleadoForm.numeroDocumento.trim();
    if (dni.length !== 8) {
      this.toastService.warning('El DNI debe tener 8 dígitos.');
      return;
    }

    this.consultandoDni = true;

    this.reniecService.consultarDni(dni).subscribe({
      next: (persona) => {
        this.consultandoDni = false;
        if (persona) {
          this.empleadoForm.nombre = persona.nombre;
          this.empleadoForm.apellidos = persona.apellidos;
          this.toastService.success('Datos obtenidos de RENIEC correctamente.');
        } else {
          this.toastService.warning('No se encontraron datos para el DNI ingresado.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.consultandoDni = false;
        console.error('Error al consultar DNI:', err);
        this.toastService.error('Ocurrió un error al consultar la RENIEC.');
        this.cdr.detectChanges();
      },
    });
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

  soloNumeros(event: KeyboardEvent): void {
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !/\d/.test(event.key)) {
      event.preventDefault();
    }
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
    this.consultandoDni = false;
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

    if (!f.fechaNacimiento) {
      this.toastService.warning('La fecha de nacimiento es obligatoria.');
      return;
    }

    if (f.fechaNacimiento > this.fechaMaxima) {
      this.toastService.warning('El empleado debe tener al menos 18 años.');
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
