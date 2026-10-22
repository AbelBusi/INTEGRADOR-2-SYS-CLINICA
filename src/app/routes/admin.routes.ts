import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { permisoGuard } from '../core/guards/permission.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'doctores',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../features/clinica/doctores/pages/lista-doctores/lista-doctores.component').then(
                (m) => m.ListaDoctoresComponent,
              ),
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('../features/clinica/doctores/pages/crear-doctor/crear-doctor.component').then(
                (m) => m.CrearDoctorComponent,
              ),
          },
        ],
      },
      {
        canActivate: [permisoGuard],
        path: 'especialidades',
        data: { permisos: ['ESPECIALIDAD_VER'] },
        loadComponent: () =>
          import('../features/clinica/especialidad/pages/lista-especialidad/lista-especialidad.component').then(
            (m) => m.ListaEspecialidadComponent,
          ),
      },
      {
        canActivate: [permisoGuard],
        path: 'medicos',
        data: { permisos: ['MEDICO_VER'] },
        loadComponent: () =>
          import('../features/clinica/medicos/pages/lista-medico/lista-medico.component').then(
            (m) => m.ListaMedicoComponent,
          ),
      },
      {
        canActivate: [permisoGuard],
        path: 'cargos',
        data: { permisos: ['CARGO_VER'] },
        loadComponent: () =>
          import('../features/clinica/cargos/pages/lista-cargos/lista-cargo.component').then(
            (m) => m.ListaCargoComponent,
          ),
      },
      {
        canActivate: [permisoGuard],
        path: 'roles',
        loadComponent: () =>
          import('../features/clinica/roles/pages/lista-roles/lista-rol.component').then(
            (m) => m.ListaRolComponent,
          ),
      },
      {
        canActivate: [permisoGuard],
        path: 'horarios',
        data: { permisos: ['HORARIO_VER'] },
        loadComponent: () =>
          import('../features/clinica/horarios/pages/agenda-horarios/agenda-horarios.component').then(
            (m) => m.AgendaHorariosComponent,
          ),
      },
      {
        canActivate: [permisoGuard],
        path: 'empleados',
        data: { permisos: ['EMPLEADO_VER'] },
        loadComponent: () =>
          import('../features/clinica/empleados/pages/lista-empleado/lista-empleado.component').then(
            (m) => m.ListaEmpleadoComponent,
          ),
      },
      {
        canActivate: [permisoGuard],
        path: 'pacientes',
        data: { permisos: ['PACIENTE_VER'] },
        loadComponent: () =>
          import('../features/clinica/pacientes/pages/lista-paciente/lista-paciente.component').then(
            (m) => m.ListaPacienteComponent,
          ),
      },
      {
        path: 'citas',
        loadComponent: () =>
          import('../features/clinica/citas/pages/lista-cita/lista-cita.component').then(
            (m) => m.ListaCitaComponent,
          ),
      },
      {
        canActivate: [permisoGuard],
        path: 'usuarios',
        data: { permisos: ['USUARIO_VER'] },
        loadComponent: () =>
          import('../features/clinica/usuarios/pages/gestion-usuarios/gestion-usuarios.component').then(
            (m) => m.GestionUsuariosComponent,
          ),
      },
      {
        canActivate: [permisoGuard],
        path: 'roles',
        data: { permisos: ['ROL_VER'] },
        loadComponent: () =>
          import('../features/admin/roles/pages/lista-roles/lista-roles.component').then(
            (m) => m.ListaRolesComponent,
          ),
      },
    ],
  },
];
