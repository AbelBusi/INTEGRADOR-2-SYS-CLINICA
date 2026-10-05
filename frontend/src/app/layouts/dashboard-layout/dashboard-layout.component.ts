import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.service';
import { environment } from '../../../environments/environment';
import { MENU_BASE, PAGE_TITLES } from './dashboard-menu.config';

interface UsuarioRolInfo {
  nombres: string;
  rol: string;
}

interface MensajeResponse {
  mensaje: string;
  object: UsuarioRolInfo;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  open = true;
  expandedItem: string | null = 'Inicio';

  usuarioInfo = signal<UsuarioRolInfo | null>(null);
  cargandoPerfil = signal<boolean>(true);

  inicialAvatar = computed(() => {
    const info = this.usuarioInfo();
    return info && info.nombres ? info.nombres.charAt(0).toUpperCase() : '?';
  });

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  pageInfo = computed(() => {
    const url = this.currentUrl();
    return (
      PAGE_TITLES[url] ?? { title: 'Panel administrativo', subtitle: 'Gestión del consultorio' }
    );
  });

  navItems = computed(() => {
    const rol = this.authService.getRole();

    const visibles = MENU_BASE.map((item) => ({
      ...item,
      sub: item.sub?.filter((subItem) => !subItem.roles || subItem.roles.includes(rol)),
    })).filter((item) => {
      if (item.roles && !item.roles.includes(rol)) return false;
      if (item.sub && item.sub.length === 0) return false;
      return true;
    });

    let grupoAnterior: string | undefined;

    return visibles.map((item) => {
      const encabezado = item.grupo && item.grupo !== grupoAnterior ? item.grupo : null;
      grupoAnterior = item.grupo;
      return { ...item, encabezado };
    });
  });


  ngOnInit(): void {
    this.obtenerPerfilUsuario();
  }

  private obtenerPerfilUsuario() {
    const userId = this.authService.getUserId();
    const token = this.authService.getAccessToken();

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<MensajeResponse>(`${environment.apiUrl}/usuarios/${userId}/rol`, { headers })
      .subscribe({
        next: (res) => {
          if (res && res.object) {
            this.usuarioInfo.set(res.object);
          }
          this.cargandoPerfil.set(false);
        },
        error: (err) => {
          console.error('Error al capturar datos del usuario', err);
          this.cargandoPerfil.set(false);
        },
      });
  }

  toggleSidebar() {
    this.open = !this.open;
    if (!this.open) this.expandedItem = null;
  }

  toggleMenu(label: string) {
    if (!this.open) this.open = true;
    this.expandedItem = this.expandedItem === label ? null : label;
  }

  logout() {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.limpiarSesionLocal();
      return;
    }
    this.http
      .post(
        `${environment.apiUrl}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .subscribe({
        next: () => this.limpiarSesionLocal(),
        error: () => this.limpiarSesionLocal(),
      });
  }

  private limpiarSesionLocal() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}
