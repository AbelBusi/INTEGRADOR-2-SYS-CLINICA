import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { roles: ['DOCTOR'] },
    children: [

    ],
  },
];
