import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { ADMIN_ROUTES } from './routes/admin.routes';
import { CLINICA_ROUTES } from './routes/clinica.routes';
import { DOCTOR_ROUTES } from './routes/doctor.routes';
import { PACIENTE_ROUTES } from './routes/paciente.routes';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },

      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/dashboard/pages/inicio/inicio.component').then(
            (m) => m.InicioComponent,
          ),
      },
      {
        path: 'horario',
        loadComponent: () =>
          import('./features/dashboard/pages/horario/horario.component').then(
            (m) => m.HorarioComponent,
          ),
      },

      ...ADMIN_ROUTES,
      ...CLINICA_ROUTES,
      ...DOCTOR_ROUTES,
      ...PACIENTE_ROUTES,

      {
        path: '**',
        loadComponent: () =>
          import('./features/shared/pages/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
