import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';


export const CLINICA_ROUTES: Routes = [
  {
    path: 'citas',
    children: [

    ],
  },
  {
    path: 'pacientes',
    children: [
      {
        path: '',
        canActivate: [authGuard],
        data: { roles: ['ADMINISTRADOR'] },
        loadComponent: () =>
          import('../features/clinica/pacientes/pages/lista-paciente/lista-paciente.component').then(
            (m) => m.ListaPacienteComponent,
          ),
      },
      {
        path: 'nuevo',
        canActivate: [authGuard],
        data: { roles: ['ADMINISTRADOR', 'RECEPCIONISTA'] },
        loadComponent: () =>
          import('../features/clinica/pacientes/components/crear-paciente-modal/crear-paciente-modal.component').then(
            (m) => m.CrearPacienteModalComponent,
          ),
      },
    ],
  },
];
