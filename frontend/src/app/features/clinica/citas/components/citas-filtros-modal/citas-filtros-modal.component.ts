import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CitaService } from '../../services/cita.service';
import { CitaFiltroService } from '../../services/cita-filtro.service';
import { CitaFiltros, DIAS_SEMANA } from '../../interface/cita-filtro.interface';
import {
  EspecialidadResumen,
  MedicoResumen,
  OPCIONES_ESTADO,
} from '../../interface/cita.interface';

@Component({
  selector: 'app-citas-filtros-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-filtros-modal.component.html',
})
export class CitasFiltrosModalComponent implements OnInit {
  @Input() inicial: CitaFiltros = {};
  @Output() close = new EventEmitter<void>();
  @Output() aplicar = new EventEmitter<CitaFiltros>();
  @Output() limpiar = new EventEmitter<void>();

  readonly dias = DIAS_SEMANA;
  readonly opcionesEstado = OPCIONES_ESTADO;

  filtros: CitaFiltros = {};
  error = '';
  especialidades: EspecialidadResumen[] = [];
  medicos: MedicoResumen[] = [];

  constructor(
    private readonly citaService: CitaService,
    private readonly filtroService: CitaFiltroService,
  ) {}

  ngOnInit(): void {
    this.filtros = { ...this.inicial, estado: [...(this.inicial.estado ?? [])] };

    this.citaService.listarEspecialidadesResumen().subscribe({
      next: (r) => (this.especialidades = r.object || []),
      error: (e) => console.error('No se pudieron cargar las especialidades:', e),
    });

    if (this.filtros.idEspecialidad) {
      this.cargarMedicos(this.filtros.idEspecialidad);
    }
  }

  get cantidadActivos(): number {
    return this.filtroService.contarActivos(this.filtros);
  }

  cambiarEspecialidad(id: number | null): void {
    this.filtros.idEspecialidad = id;
    this.filtros.idMedico = null;
    this.medicos = [];
    if (id) {
      this.cargarMedicos(id);
    }
  }

  private cargarMedicos(idEspecialidad: number): void {
    this.citaService.listarMedicosPorEspecialidad(idEspecialidad).subscribe({
      next: (r) => (this.medicos = r.object || []),
      error: (e) => console.error('No se pudieron cargar los médicos:', e),
    });
  }

  estadoMarcado(valor: number): boolean {
    return (this.filtros.estado ?? []).includes(valor);
  }

  alternarEstado(valor: number): void {
    const actual = this.filtros.estado ?? [];
    this.filtros.estado = actual.includes(valor)
      ? actual.filter((e) => e !== valor)
      : [...actual, valor];
  }

  alternarEnAtencion(): void {
    this.filtros.enAtencion = !this.filtros.enAtencion;
  }

  limpiarTodo(): void {
    this.filtros = {};
    this.medicos = [];
    this.error = '';
    this.limpiar.emit();
  }

  handleClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    const mensaje = this.filtroService.validar(this.filtros);
    if (mensaje) {
      this.error = mensaje;
      return;
    }
    this.error = '';
    this.aplicar.emit({ ...this.filtros });
  }
}
