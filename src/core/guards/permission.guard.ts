import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPermission = route.data['permiso'] as string;

  if (!requiredPermission) return true;

  const userPermissions = authService.getAuthorities();

  if (userPermissions.includes(requiredPermission)) {
    return true;
  }

  router.navigate(['/dashboard/inicio']);
  return false;
};
