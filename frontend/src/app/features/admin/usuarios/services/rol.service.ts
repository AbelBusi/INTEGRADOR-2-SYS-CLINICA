import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RolAdminService } from '../../roles/services/rol-admin.service';
import { Rol } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  private readonly rolAdmin = inject(RolAdminService);

  listar(): Observable<Rol[]> {
    return this.rolAdmin.listar();
  }
}
