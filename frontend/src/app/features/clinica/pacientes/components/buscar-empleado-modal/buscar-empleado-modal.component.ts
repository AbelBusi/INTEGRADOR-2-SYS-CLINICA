import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { environment } from '../../../../../../environments/environment';
import { PacienteService } from '../../services/paciente.service';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  AccionEmpleado,
  ENTIDAD_ASEGURADORA,
  EmpleadoBusqueda,
  MensajeResponse,
  TIPOS_DOCUMENTO_BUSQUEDA,
  TipoDocumentoBusqueda,
  esperar,
  generarCodigoAsegurado,
} from '../../interface/paciente.interface';

@Component({
  selector: 'app-buscar-empleado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-empleado-modal.component.html',
})
export class BuscarEmpleadoModalComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onPacienteActualizado = new EventEmitter<void>();

  readonly tiposDocumento = TIPOS_DOCUMENTO_BUSQUEDA;
  readonly simulacionSeguro = !environment.production;

  tipoDocumento: TipoDocumentoBusqueda | null = null;
  numeroDocumento = '';

  entidadAsegurado = ENTIDAD_ASEGURADORA;
  codigoAsegurado = '';

  buscando = false;
  procesando = false;
  consultandoSeguro = false;
  resultado: EmpleadoBusqueda | null = null;
  errorBusqueda = '';

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get longitudDocumento(): number | null {
    return this.tipoDocumento?.longitud ?? null;
  }

  get esDni(): boolean {
    return this.tipoDocumento?.codigo === 'DNI';
  }

  get puedeBuscar(): boolean {
    return (
      !!this.tipoDocumento &&
      this.numeroDocumento.length === this.tipoDocumento.longitud &&
      !this.ocupado
    );
  }

  get puedeConsultarSeguro(): boolean {
    return this.esDni && this.numeroDocumento.length === 8 && !this.ocupado;
  }

  get puedeRegistrar(): boolean {
    return !!this.entidadAsegurado.trim() && !!this.codigoAsegurado.trim() && !this.ocupado;
  }

  get accion(): AccionEmpleado | null {
    return this.resultado ? (this.resultado.accion?.toUpperCase() as AccionEmpleado) : null;
  }

  get hayAccion(): boolean {
    return (
      this.accion === 'DESACTIVADO' || this.accion === 'REACTIVAR' || this.accion === 'REGISTRAR'
    );
  }

  get ocupado(): boolean {
    return this.buscando || this.procesando || this.consultandoSeguro;
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

    this.pacienteService.buscarEmpleadoPorDocumento(this.numeroDocumento).subscribe({
      next: (response) => {
        this.resultado = response.object;
        this.buscando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorBusqueda =
          error.status === 404
            ? 'No se encontró ningún empleado con ese número de documento.'
            : error.error?.mensaje || 'No se pudo realizar la búsqueda. Intenta nuevamente.';
        this.buscando = false;
        this.cdr.detectChanges();
      },
    });
  }

  async consultarSeguro(): Promise<void> {
    if (!this.puedeConsultarSeguro) {
      this.toastService.warning('Ingrese primero un DNI válido de 8 dígitos.');
      return;
    }

    this.consultandoSeguro = true;
    this.cdr.detectChanges();

    await esperar(1400);

    this.entidadAsegurado = ENTIDAD_ASEGURADORA;
    this.codigoAsegurado = generarCodigoAsegurado();
    this.consultandoSeguro = false;

    this.toastService.success('Datos del seguro cargados.');
    this.cdr.detectChanges();
  }

  ejecutarAccion(): void {
    if (!this.resultado || this.procesando || !this.hayAccion) {
      return;
    }

    const accion = this.accion;
    const id = this.resultado.idPaciente;
    const idEmpleado = this.resultado.idEmpleado;
    let peticion: Observable<MensajeResponse<unknown>>;
    let mensajeOk: string;

    if (accion === 'REGISTRAR') {
      if (!this.puedeRegistrar) {
        this.toastService.warning('Complete los datos del seguro.');
        return;
      }
      peticion = this.pacienteService.convertirEmpleadoEnPaciente(idEmpleado, {
        entidadAsegurado: this.entidadAsegurado.trim(),
        codigoAsegurado: this.codigoAsegurado.trim(),
      });
      mensajeOk = 'Paciente agregado con éxito';
    } else if (accion === 'DESACTIVADO') {
      peticion = this.pacienteService.cambiarEstado(id, 'ACTIVO');
      mensajeOk = 'Paciente activado con éxito';
    } else {
      peticion = this.pacienteService.reactivarPorId(id);
      mensajeOk = 'Paciente reactivado con éxito';
    }

    this.procesando = true;

    peticion.subscribe({
      next: (response) => {
        this.toastService.success(response?.mensaje || mensajeOk);
        this.procesando = false;
        this.onPacienteActualizado.emit();
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
    this.entidadAsegurado = ENTIDAD_ASEGURADORA;
    this.codigoAsegurado = '';
  }
}
