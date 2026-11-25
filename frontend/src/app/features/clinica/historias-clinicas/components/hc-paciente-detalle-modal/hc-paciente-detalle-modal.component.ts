import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AtencionHistoria, HistoriaClinica } from '../../interface/historia-clinica.interface';
import { HcAuditoriaComponent } from '../hc-auditoria/hc-auditoria.component';
import { HcModalShellComponent } from '../hc-modal-shell/hc-modal-shell.component';
import { HcPanelAlergiasComponent } from '../hc-panel-alergias/hc-panel-alergias.component';
import { HcPanelAntecedentesFamiliaresComponent } from '../hc-panel-antecedentes-familiares/hc-panel-antecedentes-familiares.component';
import { HcPanelAntecedentesPersonalesComponent } from '../hc-panel-antecedentes-personales/hc-panel-antecedentes-personales.component';
import { HcPanelAtencionesComponent } from '../hc-panel-atenciones/hc-panel-atenciones.component';
import { HcPanelDiagnosticosComponent } from '../hc-panel-diagnosticos/hc-panel-diagnosticos.component';
import { HcPanelTratamientosComponent } from '../hc-panel-tratamientos/hc-panel-tratamientos.component';

export type SeccionPaciente =
  | 'atenciones'
  | 'tratamientos'
  | 'diagnosticos'
  | 'alergias'
  | 'personales'
  | 'familiares'
  | 'auditoria';

const TEXTOS: Record<SeccionPaciente, { titulo: string; icono: string; ancho: string }> = {
  atenciones: { titulo: 'Mis citas atendidas', icono: 'event_available', ancho: 'max-w-3xl' },
  tratamientos: { titulo: 'Mis tratamientos', icono: 'medication', ancho: 'max-w-3xl' },
  diagnosticos: { titulo: 'Mis diagnósticos', icono: 'fact_check', ancho: 'max-w-3xl' },
  alergias: { titulo: 'Mis alergias', icono: 'warning_amber', ancho: 'max-w-2xl' },
  personales: { titulo: 'Mis antecedentes personales', icono: 'history_edu', ancho: 'max-w-2xl' },
  familiares: { titulo: 'Antecedentes de mi familia', icono: 'family_restroom', ancho: 'max-w-2xl' },
  auditoria: { titulo: 'Registro de cambios', icono: 'history', ancho: 'max-w-3xl' },
};

/** Modal único del panel del paciente: muestra una sección de su historia (solo lectura). */
@Component({
  selector: 'app-hc-paciente-detalle-modal',
  standalone: true,
  imports: [
    CommonModule,
    HcModalShellComponent,
    HcPanelAtencionesComponent,
    HcPanelTratamientosComponent,
    HcPanelDiagnosticosComponent,
    HcPanelAlergiasComponent,
    HcPanelAntecedentesPersonalesComponent,
    HcPanelAntecedentesFamiliaresComponent,
    HcAuditoriaComponent,
  ],
  templateUrl: './hc-paciente-detalle-modal.component.html',
})
export class HcPacienteDetalleModalComponent {
  @Input({ required: true }) seccion!: SeccionPaciente;
  @Input({ required: true }) historia!: HistoriaClinica;
  @Input() atenciones: AtencionHistoria[] = [];
  @Input() cargandoAtenciones = false;
  @Input() errorAtenciones: string | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() reintentar = new EventEmitter<void>();

  get textos() {
    return TEXTOS[this.seccion];
  }
}
