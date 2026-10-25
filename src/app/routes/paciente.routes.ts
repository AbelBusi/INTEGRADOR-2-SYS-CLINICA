import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { permisoGuard } from '../core/guards/permission.guard';

export const PACIENTE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: ['PACIENTE'] },
    children: [
      {
        canActivate: [permisoGuard],
        path: 'pacientes-misCitas',
        loadComponent: () =>
          import('../features/clinica/citas/pages/mis-citas-paciente/mis-citas-paciente.component').then(
            (m) => m.MisCitasPacienteComponent,
          ),
      },
    ],
  },
];
