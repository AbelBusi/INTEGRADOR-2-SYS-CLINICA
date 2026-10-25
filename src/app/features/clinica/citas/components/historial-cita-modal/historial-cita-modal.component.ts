import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, of } from 'rxjs';

import { formatearFechaCorta } from '../../../horarios/utils/calendario.util';
import { CitaFila, HistorialCita, infoEstado } from '../../interface/cita.interface';
import { CitaService } from '../../services/cita.service';
import { NombresHistorial, describirEvento } from '../../utils/historial-cita.util';

type Resolucion = { tipo: 'medico' | 'paciente'; id: number; nombre: string } | null;

@Component({
  selector: 'app-historial-cita-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-cita-modal.component.html',
})
export class HistorialCitaModalComponent implements OnInit {
  @Input({ required: true }) cita!: CitaFila;
  @Output() close = new EventEmitter<void>();

  cargando = signal(true);
  error = signal(false);
  eventos = signal<HistorialCita[]>([]);
  nombres = signal<NombresHistorial>({ medico: {}, paciente: {} });

  eventosVista = computed(() => this.eventos().map((e) => describirEvento(e, this.nombres())));

  constructor(private readonly citaService: CitaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  estadoInfo(estado: number) {
    return infoEstado(estado);
  }

  fechaCorta(iso: string): string {
    return formatearFechaCorta(iso);
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);

    this.citaService.historial(this.cita.id).subscribe({
      next: (response) => {
        const lista = response.object || [];
        this.eventos.set(lista);
        this.cargando.set(false);
        this.resolverNombres(lista);
      },
      error: (error) => {
        console.error('Error al cargar el historial:', error);
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }

  // Reemplaza los IDs de médico y paciente por sus nombres. Si falla, queda "Médico N.º X".
  private resolverNombres(eventos: HistorialCita[]): void {
    const medicos = new Set<number>();
    const pacientes = new Set<number>();

    for (const evento of eventos) {
      for (const datos of [evento.datosAnteriores, evento.datosNuevos]) {
        if (!datos) {
          continue;
        }
        const idMedico = datos['idMedico'];
        const idPaciente = datos['idPaciente'];
        if (typeof idMedico === 'number') {
          medicos.add(idMedico);
        }
        if (typeof idPaciente === 'number') {
          pacientes.add(idPaciente);
        }
      }
    }

    const peticiones = [
      ...[...medicos].map((id) =>
        this.citaService.obtenerMedico(id).pipe(
          map((r): Resolucion => ({
            tipo: 'medico',
            id,
            nombre: `${r.object.nombre} ${r.object.apellidos}`.trim(),
          })),
          catchError(() => of<Resolucion>(null)),
        ),
      ),
      ...[...pacientes].map((id) =>
        this.citaService.obtenerPaciente(id).pipe(
          map((r): Resolucion => ({
            tipo: 'paciente',
            id,
            nombre: `${r.object.nombre} ${r.object.apellidos}`.trim(),
          })),
          catchError(() => of<Resolucion>(null)),
        ),
      ),
    ];

    if (peticiones.length === 0) {
      return;
    }

    forkJoin(peticiones).subscribe((resultados) => {
      const siguiente: NombresHistorial = { medico: {}, paciente: {} };
      for (const r of resultados) {
        if (r) {
          siguiente[r.tipo][r.id] = r.nombre;
        }
      }
      this.nombres.set(siguiente);
    });
  }
}
