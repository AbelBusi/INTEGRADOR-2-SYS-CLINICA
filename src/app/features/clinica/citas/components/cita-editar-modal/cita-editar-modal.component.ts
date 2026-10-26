import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { aMinutos, fechaDesdeISO, inicioSemana } from '../../../horarios/utils/calendario.util';
import {
  Cita,
  CitaDTO,
  CitaFila,
  DURACIONES,
  MensajeResponse,
} from '../../interface/cita.interface';
import {
  CitaFormularioBase,
  DIAS_POR_PAGINA,
  MAXIMO_PAGINAS,
} from '../cita-form-modal/cita-formulario.base';
import { CitaFormularioComponent } from '../cita-form-modal/cita-formulario.component';

@Component({
  selector: 'app-cita-editar-modal',
  standalone: true,
  imports: [CommonModule, CitaFormularioComponent],
  templateUrl: './cita-editar-modal.component.html',
})
export class CitaEditarModalComponent extends CitaFormularioBase implements OnInit {
  @Input({ required: true }) cita!: CitaFila;
  @Output() close = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<Cita>();

  protected readonly mensajeExito = 'Cita actualizada con éxito';

  ngOnInit(): void {
    this.iniciar();
  }

  protected idCitaExcluida(): number | null {
    return this.cita.id;
  }

  protected enviar(dto: CitaDTO): Observable<MensajeResponse<Cita>> {
    return this.citaService.actualizar(this.cita.id, dto);
  }

  protected alGuardar(cita: Cita): void {
    this.guardado.emit(cita);
  }

  onClose(): void {
    if (!this.guardando()) {
      this.close.emit();
    }
  }

  protected override alCargarDatos(): void {
    const cita = this.cita;

    this.paciente.set({
      idPaciente: cita.idPaciente,
      nombre: cita.paciente,
      tipoDocumento: '',
      numeroDocumento: '',
      genero: '',
    });
    this.fecha.set(cita.fecha);
    this.horaInicio.set(cita.inicio);
    this.horaSalida.set(cita.salida);
    this.motivo.set(cita.motivo);

    const duracion = aMinutos(cita.salida) - aMinutos(cita.inicio);
    if (DURACIONES.includes(duracion)) {
      this.duracion.set(duracion);
    }

    const diferencia = Math.floor(
      (fechaDesdeISO(cita.fecha).getTime() - inicioSemana(this.hoy).getTime()) /
        86400000 /
        DIAS_POR_PAGINA,
    );
    this.paginaAgenda.set(Math.min(Math.max(diferencia, 0), MAXIMO_PAGINAS));

    this.citaService.obtenerPaciente(cita.idPaciente).subscribe({
      next: (response) => {
        const p = response.object;

        if (this.paciente()?.idPaciente === cita.idPaciente) {
          this.paciente.set({
            idPaciente: p.id,
            nombre: `${p.nombre} ${p.apellidos}`.trim(),
            tipoDocumento: p.codigoTipoDocumento,
            numeroDocumento: p.numeroDocumento,
            genero: p.genero,
          });
        }
      },
      error: (error) => console.error(error),
    });

    this.idMedico.set(cita.idMedico);
    this.cargandoMedicos.set(true);
    this.cargandoHorario.set(true);

    this.citaService.obtenerMedico(cita.idMedico).subscribe({
      next: (response) => {
        const info = response.object;

        this.documentoMedico.set(info.numeroDocumento);
        this.idEspecialidad.set(info.idEspecialidad);
        this.cargarMedicos(info.idEspecialidad, { idMedico: cita.idMedico, nombre: cita.medico });
        this.cargarHorarios(cita.idMedico, info.idEmpleado);
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('No se pudieron cargar los datos del médico de la cita.');
        this.cargandoMedicos.set(false);
        this.cargandoHorario.set(false);
      },
    });
  }
}
