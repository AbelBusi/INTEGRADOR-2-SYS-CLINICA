import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { ModoPermisos, PermisosService } from '../services/permisos.service';

@Directive({
  selector: '[appTienePermiso]',
  standalone: true,
})
export class TienePermisoDirective implements OnChanges {
  private readonly plantilla = inject<TemplateRef<unknown>>(TemplateRef);
  private readonly contenedor = inject(ViewContainerRef);
  private readonly permisos = inject(PermisosService);

  private visible = false;

  @Input('appTienePermiso') requeridos: string | readonly string[] | null | undefined;
  @Input('appTienePermisoModo') modo: ModoPermisos = 'alguno';

  ngOnChanges(): void {
    const permitido = this.permisos.evaluar(this.requeridos, this.modo);

    if (permitido && !this.visible) {
      this.contenedor.createEmbeddedView(this.plantilla);
      this.visible = true;
    } else if (!permitido && this.visible) {
      this.contenedor.clear();
      this.visible = false;
    }
  }
}
