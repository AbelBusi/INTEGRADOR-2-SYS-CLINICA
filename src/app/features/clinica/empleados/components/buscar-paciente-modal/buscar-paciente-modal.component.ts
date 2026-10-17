import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { EmpleadoService } from '../../services/empleado.service';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  AccionPaciente,
  CargoResumen,
  MensajeResponse,
  PacienteBusqueda,
  TIPOS_DOCUMENTO_BUSQUEDA,
  TipoDocumentoBusqueda,
} from '../../interface/empleado.interface';

const MAX_FOTO_MB = 2;

@Component({
  selector: 'app-buscar-paciente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-paciente-modal.component.html',
})
export class BuscarPacienteModalComponent implements OnDestroy {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEmpleadoActualizado = new EventEmitter<void>();

  readonly tiposDocumento = TIPOS_DOCUMENTO_BUSQUEDA;
  readonly maxFotoMb = MAX_FOTO_MB;

  tipoDocumento: TipoDocumentoBusqueda | null = null;
  numeroDocumento = '';

  // Datos para registrar como empleado
  cargos: CargoResumen[] = [];
  idCargo: number | null = null;
  foto: File | null = null;
  fotoPreview: string | null = null;
  cargandoCargos = false;

  buscando = false;
  procesando = false;
  resultado: PacienteBusqueda | null = null;
  errorBusqueda = '';

  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.liberarPreview();
  }

  get longitudDocumento(): number | null {
    return this.tipoDocumento?.longitud ?? null;
  }

  get ocupado(): boolean {
    return this.buscando || this.procesando;
  }

  get puedeBuscar(): boolean {
    return (
      !!this.tipoDocumento &&
      this.numeroDocumento.length === this.tipoDocumento.longitud &&
      !this.ocupado
    );
  }

  get puedeRegistrar(): boolean {
    return !!this.idCargo && !this.cargandoCargos && !this.ocupado;
  }

  get accion(): AccionPaciente | null {
    return this.resultado ? (this.resultado.accion?.toUpperCase() as AccionPaciente) : null;
  }

  get hayAccion(): boolean {
    return (
      this.accion === 'DESACTIVADO' || this.accion === 'REACTIVAR' || this.accion === 'REGISTRAR'
    );
  }

  onTipoDocumentoChange(): void {
    this.numeroDocumento = '';
    this.limpiarResultado();
  }

  soloNumeros(event: KeyboardEvent): void {
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !/\d/.test(event.key)) {
      event.preventDefault();
    }
  }

  onNumeroInput(): void {
    const max = this.longitudDocumento ?? 0;
    this.numeroDocumento = this.numeroDocumento.replace(/\D/g, '').slice(0, max);
    this.limpiarResultado();
  }

  buscar(): void {
    if (!this.puedeBuscar) {
      return;
    }

    this.buscando = true;
    this.limpiarResultado();

    this.empleadoService.buscarPorDocumento(this.numeroDocumento).subscribe({
      next: (response) => {
        this.resultado = response.object;
        this.buscando = false;

        if (this.accion === 'REGISTRAR') {
          this.cargarCargos();
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorBusqueda =
          error.status === 404
            ? 'No se encontró ningún paciente con ese número de documento.'
            : error.error?.mensaje || 'No se pudo realizar la búsqueda. Intenta nuevamente.';
        this.buscando = false;
        this.cdr.detectChanges();
      },
    });
  }

  private cargarCargos(): void {
    if (this.cargos.length > 0) {
      return;
    }

    this.cargandoCargos = true;

    this.empleadoService.listarCargosResumen().subscribe({
      next: (response) => {
        this.cargos = response.object || [];
        this.cargandoCargos = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los cargos.');
        this.cargandoCargos = false;
        this.cdr.detectChanges();
      },
    });
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith('image/')) {
      this.toastService.warning('El archivo seleccionado debe ser una imagen.');
      return;
    }

    if (archivo.size > MAX_FOTO_MB * 1024 * 1024) {
      this.toastService.warning(`La imagen no debe superar los ${MAX_FOTO_MB} MB.`);
      return;
    }

    this.liberarPreview();
    this.foto = archivo;
    this.fotoPreview = URL.createObjectURL(archivo);
  }

  quitarFoto(): void {
    this.liberarPreview();
    this.foto = null;
  }

  ejecutarAccion(): void {
    if (!this.resultado || this.procesando || !this.hayAccion) {
      return;
    }

    const accion = this.accion;
    let peticion: Observable<MensajeResponse<unknown>>;
    let mensajeOk: string;

    if (accion === 'REGISTRAR') {
      if (!this.puedeRegistrar) {
        this.toastService.warning('Seleccione un cargo para el empleado.');
        return;
      }
      if (this.resultado.idPaciente == null) {
        this.toastService.error('No se recibió el identificador del paciente.');
        return;
      }
      peticion = this.empleadoService.convertirPacienteEnEmpleado(
        this.resultado.idPaciente,
        { idCargo: this.idCargo as number },
        this.foto,
      );
      mensajeOk = 'Empleado agregado con éxito';
    } else {
      if (this.resultado.idEmpleado == null) {
        this.toastService.error('No se recibió el identificador del empleado.');
        return;
      }
      peticion =
        accion === 'DESACTIVADO'
          ? this.empleadoService.cambiarEstado(this.resultado.idEmpleado, 'ACTIVO')
          : this.empleadoService.reactivarPorId(this.resultado.idEmpleado);
      mensajeOk =
        accion === 'DESACTIVADO' ? 'Empleado activado con éxito' : 'Empleado reactivado con éxito';
    }

    this.procesando = true;

    peticion.subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || mensajeOk);
        this.procesando = false;
        this.onEmpleadoActualizado.emit();
        this.cerrar();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.mensaje || 'No se pudo completar la acción');
        this.procesando = false;
        this.cdr.detectChanges();
      },
    });
  }

  cerrar(): void {
    if (this.ocupado) {
      return;
    }
    this.tipoDocumento = null;
    this.numeroDocumento = '';
    this.limpiarResultado();
    this.onClose.emit();
  }

  private limpiarResultado(): void {
    this.resultado = null;
    this.errorBusqueda = '';
    this.idCargo = null;
    this.quitarFoto();
  }

  private liberarPreview(): void {
    if (this.fotoPreview) {
      URL.revokeObjectURL(this.fotoPreview);
      this.fotoPreview = null;
    }
  }
}
