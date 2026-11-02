import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getAccessToken()) {
    return router.createUrlTree(['/login']);
  }

  const rolesPermitidos = route.data['roles'] as string[] | undefined;

  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  const rolesUsuario = authService.getRole();

  const tieneAcceso = rolesPermitidos.some((rol) =>
    rolesUsuario.includes(rol),
  );

  if (tieneAcceso) {
    return true;
  }

  return router.createUrlTree(['/dashboard/inicio']);
};
