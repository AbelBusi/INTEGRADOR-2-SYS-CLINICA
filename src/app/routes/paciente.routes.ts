import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const PACIENTE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: ['PACIENTE'] },
    children: [
      {
        path: 'mis-citas-paciente',
        loadComponent: () =>
          import('../features/paciente/pages/mis-citas/mis-citas.component').then(
            (m) => m.MisCitasPacienteComponent,
          ),
      },
      {
        path: 'mi-historia',
        loadComponent: () =>
          import('../features/paciente/pages/mi-historia/mi-historia.component').then(
            (m) => m.MiHistoriaComponent,
          ),
      },
    ],
  },
];
