import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, finalize } from 'rxjs';
import {
  ElegibilidadResponse,
  IdentidadPaciente,
  PasoRegistro,
  RegistroCompletadoResponse,
} from '../../models/registro-paciente.model';
import { RegistroPacienteService } from '../../services/registro-paciente.service';
import { ToastService } from '../../../../core/services/toast.service';
import { extraerMensajeError } from '../../../../utils/mensaje-error.util';

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-paciente.component.html',
})
export class RegistroPacienteComponent {
  volver = output<void>();

  private readonly servicio = inject(RegistroPacienteService);
  private readonly toast = inject(ToastService);

  readonly tiposDocumento = [
    { codigo: 'DNI', etiqueta: 'DNI' },
    { codigo: 'CE', etiqueta: 'Carné de extranjería (CE)' },
    { codigo: 'PASAPORTE', etiqueta: 'Pasaporte' },
  ] as const;

  readonly pasos = [
    { id: 'identificacion', etiqueta: 'Documento' },
    { id: 'datos', etiqueta: 'Datos' },
    { id: 'correo', etiqueta: 'Correo' },
    { id: 'verificacion', etiqueta: 'Código' },
  ] as const;

  private readonly subtitulos: Record<PasoRegistro, string> = {
    identificacion: 'Ingrese su documento para validar que es paciente del establecimiento.',
    datos: 'Confirme sus datos personales tal como figuran en su documento.',
    correo: 'Verificaremos su correo electrónico antes de crear su cuenta.',
    verificacion: 'Ingrese el código de verificación que recibió.',
    exito: 'Registro completado.',
  };

  readonly fechaMaxima = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  readonly paso = signal<PasoRegistro>('identificacion');
  readonly cargando = signal<boolean>(false);

  readonly tipoDocumento = signal<string>('DNI');
  readonly numeroDocumento = signal<string>('');
  readonly nombres = signal<string>('');
  readonly apellidos = signal<string>('');
  readonly fechaNacimiento = signal<string>('');
  readonly correoNuevo = signal<string>('');
  readonly codigo = signal<string>('');

  readonly elegibilidad = signal<ElegibilidadResponse | null>(null);
  readonly correoEnviado = signal<string>('');
  readonly resultado = signal<RegistroCompletadoResponse | null>(null);

  readonly indicePaso = computed(() => this.pasos.findIndex((p) => p.id === this.paso()));
  readonly subtitulo = computed(() => this.subtitulos[this.paso()]);
  readonly tieneCorreo = computed(() => this.elegibilidad()?.tieneCorreo ?? false);

  readonly documentoValido = computed(() => {
    const numero = this.numeroDocumento().trim();
    return this.tipoDocumento() === 'DNI'
      ? /^\d{8}$/.test(numero)
      : /^[A-Za-z0-9]{6,15}$/.test(numero);
  });

  readonly datosValidos = computed(
    () =>
      this.nombres().trim().length > 0 &&
      this.apellidos().trim().length > 0 &&
      /^\d{4}-\d{2}-\d{2}$/.test(this.fechaNacimiento()) &&
      this.fechaNacimiento() < this.fechaMaxima,
  );

  readonly correoValido = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correoNuevo().trim()),
  );
  readonly codigoValido = computed(() => /^\d{6}$/.test(this.codigo().trim()));

  readonly longitudMaxima = computed(() => (this.tipoDocumento() === 'DNI' ? 8 : 15));

  onTipoChange(valor: string): void {
    this.tipoDocumento.set(valor);
    this.numeroDocumento.set('');
    this.elegibilidad.set(null);
  }

  onNumeroInput(valor: string): void {
    const limpio =
      this.tipoDocumento() === 'DNI'
        ? valor.replace(/\D/g, '')
        : valor.replace(/[^A-Za-z0-9]/g, '');
    this.numeroDocumento.set(limpio);
    this.elegibilidad.set(null);
  }

  onCodigoInput(valor: string): void {
    this.codigo.set(valor.replace(/\D/g, '').slice(0, 6));
  }

  private identidad(): IdentidadPaciente {
    return {
      tipoDocumento: this.tipoDocumento(),
      numeroDocumento: this.numeroDocumento().trim(),
      nombres: this.nombres().trim(),
      apellidos: this.apellidos().trim(),
      fechaNacimiento: this.fechaNacimiento(),
    };
  }

  consultar(event: Event): void {
    event.preventDefault();
    if (!this.documentoValido() || this.cargando()) return;

    this.ejecutar(
      this.servicio.consultarElegibilidad({
        tipoDocumento: this.tipoDocumento(),
        numeroDocumento: this.numeroDocumento().trim(),
      }),
      (resp) => {
        this.elegibilidad.set(resp);
        if (resp.estado === 'PUEDE_CREAR_CUENTA' || resp.estado === 'PUEDE_AGREGAR_ROL') {
          this.paso.set('datos');
        }
      },
    );
  }

  verificarDatos(event: Event): void {
    event.preventDefault();
    if (!this.datosValidos() || this.cargando()) return;

    this.ejecutar(this.servicio.verificarIdentidad(this.identidad()), (resp) => {
      this.elegibilidad.set(resp);
      this.paso.set('correo');
    });
  }

  enviarCodigo(): void {
    if (this.cargando()) return;

    const sinCorreoRegistrado = !this.tieneCorreo();
    if (sinCorreoRegistrado && !this.correoValido()) return;

    this.ejecutar(
      this.servicio.enviarCodigo({
        ...this.identidad(),
        correoNuevo: sinCorreoRegistrado ? this.correoNuevo().trim() : undefined,
      }),
      (resp) => {
        this.correoEnviado.set(resp.correoEnmascarado);
        this.codigo.set('');
        this.toast.info(resp.mensaje);
        this.paso.set('verificacion');
      },
    );
  }

  completar(event: Event): void {
    event.preventDefault();
    if (!this.codigoValido() || this.cargando()) return;

    this.ejecutar(
      this.servicio.completar({ ...this.identidad(), codigo: this.codigo().trim() }),
      (resp) => {
        this.resultado.set(resp);
        this.toast.success(
          resp.cuentaNueva ? 'Cuenta creada correctamente.' : 'Perfil habilitado correctamente.',
        );
        this.paso.set('exito');
      },
    );
  }

  volverACorreo(): void {
    this.codigo.set('');
    this.paso.set('correo');
  }

  volverADatos(): void {
    this.codigo.set('');
    this.correoNuevo.set('');
    this.paso.set('datos');
  }
  volverAIdentificacion(): void {
    this.codigo.set('');
    this.correoNuevo.set('');
    this.nombres.set('');
    this.apellidos.set('');
    this.fechaNacimiento.set('');
    this.elegibilidad.set(null);
    this.paso.set('identificacion');
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
