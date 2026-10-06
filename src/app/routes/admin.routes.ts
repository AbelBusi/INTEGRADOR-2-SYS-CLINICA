import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: ['ADMINISTRADOR'] },
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
        path: 'especialidades',
        loadComponent: () =>
          import('../features/clinica/especialidad/pages/lista-especialidad/lista-especialidad.component').then(
            (m) => m.ListaEspecialidadComponent,
          ),
      },
      {
        path: 'medicos',
        loadComponent: () =>
          import('../features/clinica/medicos/pages/lista-medico/lista-medico.component').then(
            (m) => m.ListaMedicoComponent,
          ),
      },
      {
        path: 'cargos',
        loadComponent: () =>
          import('../features/clinica/cargos/pages/lista-cargos/lista-cargo.component').then(
            (m) => m.ListaCargoComponent,
          ),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('../features/clinica/roles/pages/lista-roles/lista-rol.component').then(
            (m) => m.ListaRolComponent,
          ),
      },
      {
        path: 'empleados',
        loadComponent: () =>
          import('../features/clinica/empleados/pages/lista-empleado/lista-empleado.component').then(
            (m) => m.ListaEmpleadoComponent,
          ),
      },
      {
        path: 'pacientes',
        loadComponent: () =>
          import('../features/clinica/pacientes/pages/lista-paciente/lista-paciente.component').then(
            (m) => m.ListaPacienteComponent,
          ),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('../features/admin/roles/pages/lista-roles/lista-roles.component').then(
            (m) => m.ListaRolesComponent,
          ),
      },
      {
        path: 'usuarios',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../features/admin/usuarios/pages/lista-usuarios/lista-usuarios.component').then(
                (m) => m.ListaUsuariosComponent,
              ),
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('../features/admin/usuarios/pages/crear-usuario/crear-usuario.component').then(
                (m) => m.CrearUsuarioComponent,
              ),
          },
        ],
      },
    ],
  },
];
