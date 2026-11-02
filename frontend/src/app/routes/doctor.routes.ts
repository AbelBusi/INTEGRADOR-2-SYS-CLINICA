import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { permisoGuard } from '../core/guards/permission.guard';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: ['MEDICO'] },
    children: [
      {
        canActivate: [permisoGuard],
        path: 'medicos-misCitas',
        loadComponent: () =>
          import('../features/clinica/citas/pages/mis-citas-medico/mis-citas-medico.component').then(
            (m) => m.MisCitasMedicoComponent,
          ),
      },
    ],
  },
];
