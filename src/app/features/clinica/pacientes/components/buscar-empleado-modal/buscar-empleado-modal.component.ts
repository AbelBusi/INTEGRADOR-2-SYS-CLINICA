import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PacienteService } from '../../services/paciente.service';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  AccionEmpleado,
  EmpleadoBusqueda,
  TIPOS_DOCUMENTO_BUSQUEDA,
  TipoDocumentoBusqueda,
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

  tipoDocumento: TipoDocumentoBusqueda | null = null;
  numeroDocumento = '';

  buscando = false;
  procesando = false;
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

  get puedeBuscar(): boolean {
    return (
      !!this.tipoDocumento &&
      this.numeroDocumento.length === this.tipoDocumento.longitud &&
      !this.buscando &&
      !this.procesando
    );
  }

  get accion(): AccionEmpleado | null {
    return this.resultado ? (this.resultado.accion?.toUpperCase() as AccionEmpleado) : null;
  }

  get ocupado(): boolean {
    return this.buscando || this.procesando;
  }

  onTipoDocumentoChange(): void {
    this.numeroDocumento = '';
    this.limpiarResultado();
  }

  soloNumeros(event: KeyboardEvent): void {
    if (!/^[0-9]$/.test(event.key)) {
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

  ejecutarAccion(): void {
    if (!this.resultado || this.procesando) {
      return;
    }

    const accion = this.accion;
    if (accion !== 'DESACTIVADO' && accion !== 'REACTIVAR') {
      return;
    }

    // El id del registro sobre el que se actúa (ver nota de integración)
    const id = this.resultado.idEmpleado;
    const peticion =
      accion === 'DESACTIVADO'
        ? this.pacienteService.cambiarEstado(id, 'ACTIVO')
        : this.pacienteService.reactivarPorId(id);

    this.procesando = true;

    peticion.subscribe({
      next: (response) => {
        this.toastService.success(
          response?.mensaje ||
            (accion === 'DESACTIVADO'
              ? 'Paciente activado con éxito'
              : 'Paciente reactivado con éxito'),
        );
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
  }
}
