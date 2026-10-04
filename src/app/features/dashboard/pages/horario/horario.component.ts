import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../../clinica/horarios/services/horario.service';
import { Agenda, Disponibilidad, nombreDia } from '../../../clinica/horarios/models/horario.model';
import { CatalogoService, ResumenItem } from '../../../../core/services/catalogo.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../auth/services/auth.service';
import { RecepcionistaService } from '../../../clinica/recepcionistas/services/recepcionista.service';
import { DoctorPortalService } from '../../../doctor/services/doctor-portal.service';
import { PacientePortalService } from '../../../paciente/services/paciente-portal.service';

interface CeldaEstado {
  estado: 'cita' | 'disponible' | 'libre';
  descripcion?: string;
}

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario.component.html',
})
export class HorarioComponent {
  private horarioService = inject(HorarioService);
  private catalogoService = inject(CatalogoService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private recepcionistaService = inject(RecepcionistaService);
  private doctorPortalService = inject(DoctorPortalService);
  private pacientePortalService = inject(PacientePortalService);

  esRecepcionista = false;
  esDoctor = false;
  esPaciente = false;
  esTrabajador = false;

  fecha = signal<string>('');
  horaInicio = signal<string>('');
  horaFin = signal<string>('');
  consultando = signal<boolean>(false);
  yaConsultado = signal<boolean>(false);
  doctoresDisp = signal<Disponibilidad[]>([]);
  recepcionistasDisp = signal<Disponibilidad[]>([]);

  tipo = signal<'DOCTOR' | 'RECEPCIONISTA'>('DOCTOR');
  personaId = signal<number>(0);
  doctores = signal<ResumenItem[]>([]);
  recepcionistas = signal<ResumenItem[]>([]);
  agenda = signal<Agenda>({ bloques: [], citas: [] });
  pivot = signal<Date>(new Date());

  nombreDia = nombreDia;
  readonly today: string = new Date().toISOString().split('T')[0];
  horas = Array.from({ length: 14 }, (_, i) => i + 7);

  constructor() {
    const rol = this.authService.getRole();
    this.esRecepcionista = rol === 'RECEPCIONISTA';
    this.esDoctor = rol === 'DOCTOR';
    this.esPaciente = rol === 'PACIENTE';
    this.esTrabajador = this.esRecepcionista || this.esDoctor || this.esPaciente;

    if (this.esRecepcionista) {
      this.recepcionistaService.actual().subscribe({
        next: (r) => {
          this.tipo.set('RECEPCIONISTA');
          this.personaId.set(r.id);
        },
      });
    } else if (this.esDoctor) {
      this.doctorPortalService.actual().subscribe({
        next: (d) => {
          this.tipo.set('DOCTOR');
          this.personaId.set(d.id);
        },
      });
    } else if (this.esPaciente) {
      this.pacientePortalService.misCitas().subscribe({
        next: (citas) => {
          this.agenda.set({
            bloques: [],
            citas: citas.map((c) => ({
              fecha: c.fecha,
              horaInicio: c.horaInicio,
              horaFin: c.horaSalida,
              descripcion: `${c.doctor} · ${c.especialidad}`,
            })),
          });
        },
      });
    } else {
      this.catalogoService.doctoresResumen().subscribe({ next: (d) => this.doctores.set(d) });
      this.catalogoService.recepcionistasResumen().subscribe({ next: (r) => this.recepcionistas.set(r) });
    }

    effect(() => {
      const id = this.personaId();
      const tipo = this.tipo();
      const dias = this.diasSemana();
      if (this.esPaciente) return;
      if (id && dias.length) {
        this.horarioService.agenda(tipo, id, dias[0].fecha, dias[dias.length - 1].fecha).subscribe({
          next: (a) => this.agenda.set(a),
          error: () => this.toastService.error('No se pudo cargar la agenda.'),
        });
      } else {
        this.agenda.set({ bloques: [], citas: [] });
      }
    });
  }

  get personas(): ResumenItem[] {
    return this.tipo() === 'DOCTOR' ? this.doctores() : this.recepcionistas();
  }

  onTipoChange(tipo: 'DOCTOR' | 'RECEPCIONISTA'): void {
    this.tipo.set(tipo);
    this.personaId.set(0);
  }

  diasSemana = computed(() => {
    const pivot = new Date(this.pivot());
    const dia = pivot.getDay();
    const diff = dia === 0 ? -6 : 1 - dia;
    const lunes = new Date(pivot);
    lunes.setDate(pivot.getDate() + diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(lunes);
      d.setDate(lunes.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return { fecha: `${yyyy}-${mm}-${dd}`, diaSemana: i + 1, num: d.getDate() };
    });
  });

  rangoSemana = computed(() => {
    const dias = this.diasSemana();
    const fmt = (f: string) =>
      new Date(f + 'T00:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
    return `${fmt(dias[0].fecha)} - ${fmt(dias[6].fecha)}`;
  });

  private aMin(t: string): number {
    const [h, m] = (t || '00:00').split(':');
    return Number(h) * 60 + Number(m);
  }

  celda(fecha: string, diaSemana: number, hora: number): CeldaEstado {
    const ini = hora * 60;
    const fin = (hora + 1) * 60;

    const cita = this.agenda().citas.find(
      (c) => c.fecha === fecha && this.aMin(c.horaInicio) < fin && this.aMin(c.horaFin) > ini,
    );
    if (cita) {
      return { estado: 'cita', descripcion: cita.descripcion };
    }

    const enBloque = this.agenda().bloques.some(
      (b) => b.diaSemana === diaSemana && this.aMin(b.horaInicio) < fin && this.aMin(b.horaFin) > ini,
    );
    return { estado: enBloque ? 'disponible' : 'libre' };
  }

  navegarSemana(semanas: number): void {
    const d = new Date(this.pivot());
    d.setDate(d.getDate() + semanas * 7);
    this.pivot.set(d);
  }

  irHoy(): void {
    this.pivot.set(new Date());
  }

  consultar(): void {
    if (!this.fecha() || !this.horaInicio() || !this.horaFin()) {
      this.toastService.warning('Seleccione fecha, hora de inicio y hora de fin.');
      return;
    }
    if (this.horaInicio() >= this.horaFin()) {
      this.toastService.warning('La hora de inicio debe ser menor a la hora de fin.');
      return;
    }
    this.consultando.set(true);
    this.horarioService.doctoresDisponibles(this.fecha(), this.horaInicio(), this.horaFin()).subscribe({
      next: (res) => {
        this.doctoresDisp.set(res);
        this.yaConsultado.set(true);
        this.consultando.set(false);
      },
      error: () => {
        this.toastService.error('No se pudo consultar la disponibilidad.');
        this.consultando.set(false);
      },
    });
    this.horarioService.recepcionistasDisponibles(this.fecha(), this.horaInicio(), this.horaFin()).subscribe({
      next: (res) => this.recepcionistasDisp.set(res),
    });
  }
}
