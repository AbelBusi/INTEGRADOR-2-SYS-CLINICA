import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, output, signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { PasoRecuperacion, RecuperarClaveRequest } from '../../models/recuperacion-clave.model';
import { ToastService } from '../../../../core/services/toast.service';
import { RecuperacionClaveService } from '../../services/recuperacion-clave.service';
import { extraerMensajeError } from '../../../../utils/mensaje-error.util';
import { PasoNuevaClaveComponent } from './components/paso-nueva-clave/paso-nueva-clave.component';
import { PasoSolicitudComponent } from './components/paso-solicitud/paso-solicitud.component';
import { PasoVerificacionComponent } from './components/paso-verificacion/paso-verificacion.component';

@Component({
  selector: 'app-recuperar-clave',
  standalone: true,
  imports: [PasoSolicitudComponent, PasoVerificacionComponent, PasoNuevaClaveComponent],
  templateUrl: './recuperar-clave.component.html',
})
export class RecuperarClaveComponent {
  volver = output<void>();

  private readonly servicio = inject(RecuperacionClaveService);
  private readonly toast = inject(ToastService);

  readonly pasos = [
    { id: 'solicitud', etiqueta: 'Identidad' },
    { id: 'verificacion', etiqueta: 'Código' },
    { id: 'nueva-clave', etiqueta: 'Contraseña' },
  ] as const;

  private readonly subtitulos: Record<PasoRecuperacion, string> = {
    solicitud: 'Confirme sus datos para enviarle un código de verificación.',
    verificacion: 'Ingrese el código de verificación que recibió.',
    'nueva-clave': 'Defina su nueva contraseña de acceso.',
    exito: 'Proceso completado.',
  };

  readonly paso = signal<PasoRecuperacion>('solicitud');
  readonly cargando = signal<boolean>(false);
  readonly solicitudPrevia = signal<RecuperarClaveRequest | null>(null);

  readonly indicePaso = computed(() => this.pasos.findIndex((p) => p.id === this.paso()));
  readonly subtitulo = computed(() => this.subtitulos[this.paso()]);

  private usuario = '';
  private codigo = '';

  onSolicitar(dto: RecuperarClaveRequest): void {
    this.ejecutar(this.servicio.solicitarCodigo(dto), (resp) => {
      this.usuario = dto.usuario;
      this.solicitudPrevia.set(dto);
      this.toast.info(resp.mensaje);
      this.paso.set('verificacion');
    });
  }

  onVerificar(codigo: string): void {
    this.ejecutar(this.servicio.verificarCodigo({ usuario: this.usuario, codigo }), () => {
      this.codigo = codigo;
      this.paso.set('nueva-clave');
    });
  }

  onRestablecer(nuevaClave: string): void {
    this.ejecutar(
      this.servicio.restablecerClave({ usuario: this.usuario, codigo: this.codigo, nuevaClave }),
      () => {
        this.toast.success('Contraseña actualizada correctamente.');
        this.paso.set('exito');
      },
    );
  }

  volverASolicitud(): void {
    this.codigo = '';
    this.paso.set('solicitud');
  }

  private ejecutar<T>(peticion: Observable<T>, alExito: (resp: T) => void): void {
    this.cargando.set(true);

    peticion.pipe(finalize(() => this.cargando.set(false))).subscribe({
      next: alExito,
      error: (err: HttpErrorResponse) => {
        const mensaje = extraerMensajeError(err);
        if (mensaje) this.toast.error(mensaje);
      },
    });
  }
}
