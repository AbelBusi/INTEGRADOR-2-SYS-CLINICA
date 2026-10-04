import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CitaService } from '../../../clinica/citas/services/cita.service';
import { DoctorService } from '../../../clinica/doctores/services/doctor.service';
import { PacienteService } from '../../../clinica/pacientes/services/paciente.service';
import { EspecialidadService } from '../../../clinica/especialidad/services/especialidad.service';
import { CitaMedica } from '../../../clinica/citas/models/cita.model';
import { CitaMedicaLeer } from '../../../clinica/citas/interface/cita.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { DoctorPortalService } from '../../../doctor/services/doctor-portal.service';
import { PacientePortalService } from '../../../paciente/services/paciente-portal.service';
import { PacienteCita } from '../../../paciente/models/paciente-portal.model';
import { ComunicadoService, Comunicado } from '../../../../core/services/comunicado.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  private citaService = inject(CitaService);
  private doctorService = inject(DoctorService);
  private pacienteService = inject(PacienteService);
  private especialidadService = inject(EspecialidadService);
  private authService = inject(AuthService);
  private doctorPortalService = inject(DoctorPortalService);
  private pacientePortalService = inject(PacientePortalService);
  private comunicadoService = inject(ComunicadoService);

  esRecepcionista = false;
  esDoctor = false;
  esAdmin = false;
  esPaciente = false;
  proximaCita = signal<PacienteCita | null>(null);

  cargando = signal(true);
  totalPacientes = signal(0);
  totalDoctores = signal(0);
  totalCitas = signal(0);
  citasHoy = signal(0);
  totalEspecialidades = signal(0);
  comunicados = signal<Comunicado[]>([]);

  accesosRapidos = [
    {
      titulo: 'Agendar cita',
      desc: 'Registrar consulta médica',
      icon: 'calendar_today',
      ruta: '/dashboard/citas/nuevo',
      color: 'bg-teal-600',
      roles: ['ADMINISTRADORXD', 'RECEPCIONISTA'],
    },
    {
      titulo: 'Historial de citas',
      desc: 'Ver tus citas registradas',
      icon: 'event',
      ruta: '/dashboard/historial-citas',
      color: 'bg-amber-600',
      roles: ['RECEPCIONISTA'],
    },
    {
      titulo: 'Mis citas',
      desc: 'Consulta y atiende tus citas',
      icon: 'event',
      ruta: '/dashboard/mis-citas',
      color: 'bg-teal-600',
      roles: ['DOCTOR'],
    },
    {
      titulo: 'Mis pacientes',
      desc: 'Tus pacientes',
      icon: 'groups',
      ruta: '/dashboard/mis-pacientes',
      color: 'bg-emerald-600',
      roles: ['DOCTOR'],
    },
    {
      titulo: 'Mi horario',
      desc: 'Consultar tu horario',
      icon: 'schedule',
      ruta: '/dashboard/horario',
      color: 'bg-sky-600',
      roles: ['RECEPCIONISTA', 'DOCTOR', 'PACIENTE'],
    },
    {
      titulo: 'Mis citas',
      desc: 'Estado de tus citas',
      icon: 'event',
      ruta: '/dashboard/mis-citas-paciente',
      color: 'bg-teal-600',
      roles: ['PACIENTE'],
    },
    {
      titulo: 'Mi historia clínica',
      desc: 'Tu historial médico',
      icon: 'history_edu',
      ruta: '/dashboard/mi-historia',
      color: 'bg-emerald-600',
      roles: ['PACIENTE'],
    },
    {
      titulo: 'Lista paciente',
      desc: 'Registrar paciente',
      icon: 'person_add',
      ruta: '/dashboard/pacientes',
      color: 'bg-[#58595B]',
      roles: ['ADMINISTRADOR', 'RECEPCIONISTA'],
    },
    {
      titulo: 'Lista doctor',
      desc: 'Alta de especialista',
      icon: 'medical_services',
      ruta: '/dashboard/doctores/nuevo',
      color: 'bg-[#D9182A]',
      roles: ['ADMINISTRADORXD'],
    },
    {
      titulo: 'Especialidades',
      desc: 'Gestionar áreas médicas',
      icon: 'local_hospital',
      ruta: '/dashboard/especialidades',
      color: 'bg-[#58595B]',
      roles: ['ADMINISTRADOR'],
    },
  ];

  get accesosVisibles() {
    const rol = this.authService.getRole();
    return this.accesosRapidos.filter((a) => !a.roles || a.roles.includes(rol));
  }

  ngOnInit(): void {
    const rol = this.authService.getRole();
    this.esRecepcionista = rol === 'RECEPCIONISTA';
    this.esDoctor = rol === 'DOCTOR';
    this.esAdmin = rol === 'ADMINISTRADOR';
    this.esPaciente = rol === 'PACIENTE';

    this.comunicadoService.listar().subscribe({ next: (c) => this.comunicados.set(c) });

    if (this.esPaciente) {
      this.pacientePortalService.misCitas().subscribe({
        next: (citas) => {
          this.totalCitas.set(citas.length);
          const hoy = new Date().toISOString().slice(0, 10);
          this.citasHoy.set(citas.filter((c) => c.estado === 1 && c.fecha === hoy).length);
          const proximas = citas
            .filter((c) => c.estado === 1 && c.fecha >= hoy)
            .sort((a, b) => a.fecha.localeCompare(b.fecha));
          this.proximaCita.set(proximas[0] ?? null);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
      return;
    }

    if (this.esRecepcionista) {
      this.citaService.mias().subscribe({
        next: (res) => {
          const data = res.object;
          const citas: any[] = Array.isArray(data) ? data : data ? [data] : [];
          this.totalCitas.set(citas.length);
          const hoy = new Date().toISOString().slice(0, 10);
          this.citasHoy.set(citas.filter((c) => c.diaConsulta === hoy).length);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
      return;
    }

    if (this.esDoctor) {
      forkJoin({
        pendientes: this.doctorPortalService.misCitas(1),
        atendidas: this.doctorPortalService.misCitas(2),
      }).subscribe({
        next: ({ pendientes, atendidas }) => {
          this.totalCitas.set(pendientes.length + atendidas.length);
          const hoy = new Date().toISOString().slice(0, 10);
          this.citasHoy.set(pendientes.filter((c) => c.fecha === hoy).length);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
      return;
    }

    forkJoin({
      pacientes: this.pacienteService.listarPacientes(),
      doctores: this.doctorService.listar(),
      citas: this.citaService.listar(),
      especialidades: this.especialidadService.listarActivos(),
    }).subscribe({
      next: ({ pacientes, doctores, citas, especialidades }) => {
        this.totalPacientes.set(pacientes.length);
        this.totalDoctores.set(doctores.length);
        this.totalCitas.set(8);
        this.totalEspecialidades.set(especialidades.object?.length ?? 0);

        const hoy = new Date().toISOString().slice(0, 10);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
