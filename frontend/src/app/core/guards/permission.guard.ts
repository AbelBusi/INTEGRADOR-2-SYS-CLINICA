import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ModoPermisos, PermisosService } from '../services/permisos.service';
import { ToastService } from '../services/toast.service';

export const permisoGuard: CanActivateFn = (route) => {
  const permisos = inject(PermisosService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const requeridos = (route.data['permisos'] as string[] | undefined) ?? [];
  const modo = (route.data['permisosModo'] as ModoPermisos | undefined) ?? 'alguno';
  const destino = (route.data['sinPermisoRedirect'] as string | undefined) ?? '/dashboard';

  if (permisos.evaluar(requeridos, modo)) {
    return true;
  }

  toastService.warning('No tienes permiso para acceder a esta sección.');

  return router.createUrlTree([destino]);
};
