import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: ['DOCTOR'] },
    children: [
      {
        path: 'mis-citas',
        loadComponent: () =>
          import('../features/doctor/pages/mis-citas/mis-citas.component').then(
            (m) => m.MisCitasComponent,
          ),
      },
      {
        path: 'mis-pacientes',
        loadComponent: () =>
          import('../features/doctor/pages/mis-pacientes/mis-pacientes.component').then(
            (m) => m.MisPacientesComponent,
          ),
      },
    ],
  },
];
