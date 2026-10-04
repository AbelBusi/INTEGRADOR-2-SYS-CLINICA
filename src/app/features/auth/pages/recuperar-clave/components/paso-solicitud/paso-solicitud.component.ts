import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import {
  CanalRecuperacion,
  RecuperarClaveRequest,
} from '../../../../models/recuperacion-clave.model';

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_CELULAR = /^(\+?51[\s-]?)?9\d{2}[\s-]?\d{3}[\s-]?\d{3}$/;

@Component({
  selector: 'app-paso-solicitud',
  standalone: true,
  templateUrl: './paso-solicitud.component.html',
})
export class PasoSolicitudComponent implements OnInit {
  readonly cargando = input<boolean>(false);
  readonly inicial = input<RecuperarClaveRequest | null>(null);

  readonly enviar = output<RecuperarClaveRequest>();
  readonly cancelar = output<void>();

  readonly usuario = signal<string>('');
  readonly numeroDocumento = signal<string>('');
  readonly canal = signal<CanalRecuperacion>('CORREO');
  readonly destino = signal<string>('');
  readonly intentado = signal<boolean>(false);

  readonly canales: { valor: CanalRecuperacion; etiqueta: string; icono: string }[] = [
    { valor: 'CORREO', etiqueta: 'Correo', icono: 'mail' },
    { valor: 'SMS', etiqueta: 'SMS', icono: 'sms' },
  ];

  readonly esCorreo = computed(() => this.canal() === 'CORREO');

  readonly destinoValido = computed(() => {
    const valor = this.destino().trim();
    return this.esCorreo() ? REGEX_CORREO.test(valor) : REGEX_CELULAR.test(valor);
  });

  readonly formularioValido = computed(
    () => !!this.usuario().trim() && !!this.numeroDocumento().trim() && this.destinoValido(),
  );

  ngOnInit(): void {
    const previo = this.inicial();
    if (previo) {
      this.usuario.set(previo.usuario);
      this.numeroDocumento.set(previo.numeroDocumento);
      this.canal.set(previo.canal);
      this.destino.set(previo.destino);
    }
  }

  seleccionarCanal(canal: CanalRecuperacion): void {
    if (canal === this.canal()) return;
    this.canal.set(canal);
    this.destino.set('');
    this.intentado.set(false);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.intentado.set(true);

    if (!this.formularioValido()) return;

    this.enviar.emit({
      usuario: this.usuario().trim(),
      numeroDocumento: this.numeroDocumento().trim(),
      canal: this.canal(),
      destino: this.destino().trim(),
    });
  }
}
