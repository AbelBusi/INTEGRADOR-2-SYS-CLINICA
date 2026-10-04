import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';


export const CLINICA_ROUTES: Routes = [
  {
    path: 'citas',
    children: [
      {
        path: '',
        canActivate: [authGuard],
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () =>
          import('../features/clinica/citas/pages/lista-citas/lista-citas-medicas-component').then(
            (m) => m.ListaCitaComponent,
          ),
      },
      {
        path: 'nuevo',
        canActivate: [authGuard],
        data: { roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
        loadComponent: () =>
          import('../features/clinica/citas/pages/crear-cita/crear-cita.component').then(
            (m) => m.CrearCitaComponent,
          ),
      },
      {
        path: 'por-doctor',
        canActivate: [authGuard],
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () =>
          import('../features/clinica/citas/pages/lista-citas/lista-citas-medicas-component').then(
            (m) => m.ListaCitaComponent,
          ),
      },
    ],
  },
  {
    path: 'historial-citas',
    canActivate: [authGuard],
    data: { roles: ['RECEPCIONISTA'] },
    loadComponent: () =>
      import('../features/clinica/citas/pages/historial-citas/historial-citas.component').then(
        (m) => m.HistorialCitasComponent,
      ),
  },
  {
    path: 'pacientes',
    children: [
      {
        path: '',
        canActivate: [authGuard],
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () =>
          import('../features/clinica/pacientes/pages/lista-pacientes/lista-pacientes.component').then(
            (m) => m.ListaPacientesComponent,
          ),
      },
      {
        path: 'nuevo',
        canActivate: [authGuard],
        data: { roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
        loadComponent: () =>
          import('../features/clinica/pacientes/pages/crear-paciente/crear-paciente.component').then(
            (m) => m.CrearPacienteComponent,
          ),
      },
    ],
  },
];
