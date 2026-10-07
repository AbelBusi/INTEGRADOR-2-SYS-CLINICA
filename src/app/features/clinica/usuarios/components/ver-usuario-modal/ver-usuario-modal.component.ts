import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import {
  DetallePersona,
  EmpleadoDetalle,
  PacienteDetalle,
  UsuarioFila,
} from '../../interface/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { dato, formatearFecha, formatearFechaHora } from '../../utils/formato.util';

@Component({
  selector: 'app-ver-usuario-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-usuario-modal.component.html',
})
export class VerUsuarioModalComponent implements OnChanges {
  @Input() usuario: UsuarioFila | null = null;
  @Output() close = new EventEmitter<void>();

  cargando = signal(false);
  detalle = signal<DetallePersona | null>(null);

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly toastService: ToastService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && this.usuario?.idRegistro) {
      this.cargar(this.usuario);
    }
  }

  get fotoUrl(): string | null {
    return this.usuarioService.obtenerUrlFoto(this.detalle()?.foto);
  }

  fechaHora(valor: UsuarioFila['fechaCreacion']): string {
    return formatearFechaHora(valor);
  }

  private cargar(usuario: UsuarioFila): void {
    const id = usuario.idRegistro as number;

    this.cargando.set(true);
    this.detalle.set(null);

    const peticion =
      usuario.tipo === 'PACIENTE'
        ? this.usuarioService.obtenerPaciente(id).pipe(map((r) => this.desdePaciente(r.object)))
        : this.usuarioService.obtenerEmpleado(id).pipe(map((r) => this.desdeEmpleado(r.object)));

    peticion.subscribe({
      next: (detalle) => {
        this.detalle.set(detalle);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudo cargar la información de la persona.');
        this.cargando.set(false);
        this.onClose();
      },
    });
  }

  private desdePaciente(d: PacienteDetalle): DetallePersona {
    return {
      nombreCompleto: `${d.nombre} ${d.apellidos}`,
      foto: null,
      tituloRegistro: 'Datos del paciente',
      personales: [
        { etiqueta: 'Documento', valor: `${d.codigoTipoDocumento} ${d.numeroDocumento}` },
        { etiqueta: 'Fecha de nacimiento', valor: formatearFecha(d.fechaNacimiento) },
        { etiqueta: 'Género', valor: dato(d.genero) },
        { etiqueta: 'Nacionalidad', valor: dato(d.nacionalidad) },
        { etiqueta: 'Teléfono', valor: dato(d.telefono) },
        { etiqueta: 'Correo', valor: dato(d.correo) },
        { etiqueta: 'Dirección', valor: dato(d.direccion) },
      ],
      registro: [
        { etiqueta: 'Entidad aseguradora', valor: dato(d.entidadAsegurado) },
        { etiqueta: 'Código asegurado', valor: dato(d.codigoAsegurado) },
      ],
    };
  }

  private desdeEmpleado(d: EmpleadoDetalle): DetallePersona {
    return {
      nombreCompleto: `${d.nombre} ${d.apellidos}`,
      foto: d.foto,
      tituloRegistro: 'Datos del empleado',
      personales: [
        { etiqueta: 'Documento', valor: `${d.codigoTipoDocumento} ${d.numeroDocumento}` },
        { etiqueta: 'Fecha de nacimiento', valor: formatearFecha(d.fechaNacimiento) },
        { etiqueta: 'Género', valor: dato(d.genero) },
        { etiqueta: 'Nacionalidad', valor: dato(d.nacionalidad) },
        { etiqueta: 'Teléfono', valor: dato(d.telefono) },
        { etiqueta: 'Correo', valor: dato(d.correo) },
        { etiqueta: 'Dirección', valor: dato(d.direccion) },
      ],
      registro: [
        { etiqueta: 'Cargo', valor: dato(d.cargo) },
        { etiqueta: 'Fecha de ingreso', valor: formatearFecha(d.fechaIngreso) },
        { etiqueta: 'Fecha de retiro', valor: d.fechaRetiro ? formatearFecha(d.fechaRetiro) : '—' },
      ],
    };
  }

  onClose(): void {
    this.close.emit();
  }
}
