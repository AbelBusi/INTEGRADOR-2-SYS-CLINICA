import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { PacienteService } from '../../../clinica/pacientes/services/paciente.service';
import { EspecialidadService } from '../../../clinica/especialidad/services/especialidad.service';
import {
  ComunicadoService,
  Comunicado,
} from '../../../../core/services/comunicado.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pacienteService = inject(PacienteService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly comunicadoService = inject(ComunicadoService);

  esRecepcionista = false;
  esDoctor = false;
  esAdmin = false;
  esPaciente = false;

  cargando = signal(true);

  totalPacientes = signal(0);
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

    return this.accesosRapidos.filter((acceso) => !acceso.roles || acceso.roles.includes(rol));
  }

  ngOnInit(): void {
    const rol = this.authService.getRole();

    this.esRecepcionista = rol === 'RECEPCIONISTA';
    this.esDoctor = rol === 'DOCTOR';
    this.esAdmin = rol === 'ADMINISTRADOR';
    this.esPaciente = rol === 'PACIENTE';

    this.cargarComunicados();
    this.cargarDatos();
  }

  private cargarComunicados(): void {
    this.comunicadoService.listar().subscribe({
      next: (comunicados) => this.comunicados.set(comunicados),
    });
  }

  private cargarDatos(): void {
    this.pacienteService.listar().subscribe({
      next: (response) => {
        this.totalPacientes.set(response.object?.length ?? 0);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });

    this.especialidadService.listarActivos().subscribe({
      next: (response) => {
        this.totalEspecialidades.set(response.object?.length ?? 0);
      },
    });
  }
}
