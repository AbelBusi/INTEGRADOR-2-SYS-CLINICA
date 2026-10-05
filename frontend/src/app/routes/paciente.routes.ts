import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const PACIENTE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: ['PACIENTE'] },
    children: [
    ],
  },
];
