import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export type ModoPermisos = 'alguno' | 'todos';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  private readonly authService = inject(AuthService);

  private tokenEnCache: string | null | undefined = undefined;
  private codigosEnCache: ReadonlySet<string> = new Set();

  tiene(codigo: string): boolean {
    return this.codigos().has(codigo);
  }

  tieneAlguno(codigos: readonly string[]): boolean {
    const actuales = this.codigos();
    return codigos.some((codigo) => actuales.has(codigo));
  }

  tieneTodos(codigos: readonly string[]): boolean {
    const actuales = this.codigos();
    return codigos.every((codigo) => actuales.has(codigo));
  }

  evaluar(
    requeridos: string | readonly string[] | null | undefined,
    modo: ModoPermisos = 'alguno',
  ): boolean {
    const lista = typeof requeridos === 'string' ? [requeridos] : [...(requeridos ?? [])];

    if (lista.length === 0) {
      return true;
    }

    return modo === 'todos' ? this.tieneTodos(lista) : this.tieneAlguno(lista);
  }

  lista(): string[] {
    return [...this.codigos()];
  }

  private codigos(): ReadonlySet<string> {
    const token = this.authService.getAccessToken() ?? null;

    if (token !== this.tokenEnCache) {
      this.tokenEnCache = token;
      this.codigosEnCache = this.extraer(token);
    }

    return this.codigosEnCache;
  }

  private extraer(token: string | null): ReadonlySet<string> {
    if (!token) {
      return new Set();
    }

    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const binario = atob(payload);
      const json = decodeURIComponent(
        Array.from(binario, (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
      );
      const claims = JSON.parse(json) as { authorities?: unknown };
      const autoridades = Array.isArray(claims.authorities) ? claims.authorities : [];

      return new Set(autoridades.filter((valor): valor is string => typeof valor === 'string'));
    } catch {
      return new Set();
    }
  }
}
