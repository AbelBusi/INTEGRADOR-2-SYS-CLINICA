import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getAccessToken()) {
    router.navigate(['/login']);
    return false;
  }

  const rolesPermitidos = route.data['roles'] as string[] | undefined;

  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  if (rolesPermitidos.includes(authService.getRole())) {
    return true;
  }

  router.navigate(['/dashboard/inicio']);
  return false;
};
