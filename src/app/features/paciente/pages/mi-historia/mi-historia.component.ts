import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientePortalService } from '../../services/paciente-portal.service';
import { PacienteActual } from '../../models/paciente-portal.model';
import { Atencion } from '../../../doctor/models/doctor-portal.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-mi-historia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-historia.component.html',
})
export class MiHistoriaComponent implements OnInit {
  private pacientePortalService = inject(PacientePortalService);
  private toastService = inject(ToastService);

  paciente = signal<PacienteActual | null>(null);
  atenciones = signal<Atencion[]>([]);
  cargando = signal(true);
  generando = signal(false);

  ngOnInit(): void {
    this.pacientePortalService.actual().subscribe({
      next: (p) => this.paciente.set(p),
      error: () => this.toastService.error('No se pudieron cargar tus datos.'),
    });
    this.pacientePortalService.miHistoria().subscribe({
      next: (data) => {
        this.atenciones.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.toastService.error('No se pudo cargar tu historia clínica.');
        this.cargando.set(false);
      },
    });
  }

  async descargarPdf(): Promise<void> {
    const p = this.paciente();
    if (!p) {
      this.toastService.warning('Aún se están cargando tus datos.');
      return;
    }

    this.generando.set(true);
    try {
      const jspdf = await import('jspdf');
      const doc = new jspdf.jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 40;
      let y = margin;

      const ensure = (h: number) => {
        if (y + h > pageH - margin) {
          doc.addPage();
          y = margin;
        }
      };

      doc.setFillColor(13, 107, 104);
      doc.rect(0, 0, pageW, 62, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('SaludConsultorio', margin, 32);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('Historia Clínica', margin, 50);
      doc.setFontSize(9);
      doc.text('Generado: ' + new Date().toLocaleDateString('es-PE'), pageW - margin, 50, { align: 'right' });

      y = 86;
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Datos del Paciente', margin, y);
      y += 18;
      doc.setFontSize(10);

      const datos: [string, string][] = [
        ['DNI', p.persona.dni],
        ['Nombres', `${p.persona.nombre} ${p.persona.apellidos}`],
        ['Fecha de nacimiento', p.persona.fechaNacimiento],
        ['Género', p.persona.genero],
        ['Teléfono', p.persona.telefono || '-'],
        ['Correo', p.persona.correo || '-'],
        ['Nacionalidad', p.persona.nacionalidad],
        ['Aseguradora', p.entidadAseguradora],
      ];
      datos.forEach(([k, v]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${k}:`, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(v), margin + 130, y);
        y += 16;
      });

      y += 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Historial de Atenciones', margin, y);
      y += 20;

      if (!this.atenciones().length) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text('No hay atenciones registradas.', margin, y);
      } else {
        this.atenciones().forEach((a) => {
          ensure(34);
          doc.setFillColor(240, 245, 244);
          doc.rect(margin, y - 12, pageW - 2 * margin, 20, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(13, 107, 104);
          doc.text(`${a.fechaAtencion}   ·   ${a.especialidad}   ·   ${a.doctor}`, margin + 6, y + 2);
          y += 24;

          doc.setTextColor(40, 40, 40);
          const campo = (label: string, val: string) => {
            if (!val) return;
            ensure(16);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(label, margin + 6, y);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(String(val), pageW - 2 * margin - 110);
            doc.text(lines, margin + 110, y);
            y += Math.max(14, lines.length * 12);
          };

          campo('Motivo:', a.motivo);
          campo('Diagnóstico:', a.diagnostico);
          campo('Observaciones:', a.observaciones);
          campo('Tratamiento:', a.tratamiento);
          campo('Recomendaciones:', a.recomendaciones);
          y += 10;
        });
      }

      doc.save(`historia-clinica-${p.persona.dni}.pdf`);
    } catch {
      this.toastService.error('No se pudo generar el PDF.');
    } finally {
      this.generando.set(false);
    }
  }
}
