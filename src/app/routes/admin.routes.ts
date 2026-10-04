import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      {
        path: 'horarios',
        loadComponent: () =>
          import('../features/clinica/horarios/pages/lista-horarios/lista-horarios.component').then(
            (m) => m.ListaHorariosComponent,
          ),
      },
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
        path: 'recepcionistas',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../features/clinica/recepcionistas/pages/lista-recepcionistas/lista-recepcionistas.component').then(
                (m) => m.ListaRecepcionistasComponent,
              ),
          },
          {
            path: 'nuevo',
            loadComponent: () =>
              import('../features/clinica/recepcionistas/pages/crear-recepcionista/crear-recepcionista.component').then(
                (m) => m.CrearRecepcionistaComponent,
              ),
          },
        ],
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
