import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaMedicaLeer } from '../../interface/cita.interface';

@Component({
  selector: 'app-detalle-cita-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-cita-modal.component.html',
})
export class DetalleCitaModalComponent {
  cita = input.required<CitaMedicaLeer>();
  close = output<void>();
  edit = output<CitaMedicaLeer>();

  iniciales = computed(() => {
    const c = this.cita();
    const primNom = c.nombrePaciente?.charAt(0) || '';
    const primAp = c.apellidosPaciente?.charAt(0) || '';
    return `${primNom}${primAp}`.toUpperCase();
  });

  fechaFormateada = computed(() => {
    const c = this.cita();
    if (!c.diaConsulta) return { diaNombre: '', diaNumero: '', mes: '' };

    const fecha = new Date(c.diaConsulta + 'T00:00:00');
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    return {
      diaNombre: dias[fecha.getDay()],
      diaNumero: fecha.getDate().toString(),
      mes: meses[fecha.getMonth()],
    };
  });

  horasFormateadas = computed(() => {
    const c = this.cita();
    return {
      inicio: c.horaInicio.slice(0, 5),
      fin: c.horaSalida.slice(0, 5),
    };
  });
}

