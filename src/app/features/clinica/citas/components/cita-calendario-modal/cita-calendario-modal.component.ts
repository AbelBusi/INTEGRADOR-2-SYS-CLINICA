import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../../horarios/services/horario.service';
import { Agenda } from '../../../horarios/models/horario.model';

interface Intervalo {
  inicio: number;
  fin: number;
}

@Component({
  selector: 'app-cita-calendario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cita-calendario-modal.component.html',
})
export class CitaCalendarioModalComponent {
  private readonly horarioService = inject(HorarioService);

  doctorId = input.required<number>();
  doctorNombre = input<string>('');
  especialidad = input<string>('');

  close = output<void>();
  seleccionar = output<{ fecha: string; horaInicio: string; horaFin: string }>();

  pivotMes = signal<Date>(new Date());
  fechaSel = signal<string>('');
  agenda = signal<Agenda>({ bloques: [], citas: [] });
  cargando = signal<boolean>(false);
  desde = signal<string>('');
  hasta = signal<string>('');

  readonly today: string = new Date().toISOString().split('T')[0];
  private readonly nombresDia = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  constructor() {
    effect(() => {
      const fecha = this.fechaSel();
      const id = this.doctorId();
      if (fecha && id) {
        this.cargando.set(true);
        this.desde.set('');
        this.hasta.set('');
        this.horarioService.agenda('DOCTOR', id, fecha, fecha).subscribe({
          next: (a) => {
            this.agenda.set(a);
            this.cargando.set(false);
          },
          error: () => this.cargando.set(false),
        });
      }
    });
  }

  mesLabel = computed(() =>
    this.pivotMes().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' }),
  );

  encabezadosDia = this.nombresDia;

  semanas = computed(() => {
    const pivot = this.pivotMes();
    const anio = pivot.getFullYear();
    const mes = pivot.getMonth();
    const primer = new Date(anio, mes, 1);
    const offset = (primer.getDay() + 6) % 7;
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();

    const celdas: ({ fecha: string; num: number; pasado: boolean } | null)[] = [];
    for (let i = 0; i < offset; i++) celdas.push(null);
    for (let d = 1; d <= diasEnMes; d++) {
      const mm = String(mes + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const fecha = `${anio}-${mm}-${dd}`;
      celdas.push({ fecha, num: d, pasado: fecha < this.today });
    }
    while (celdas.length % 7 !== 0) celdas.push(null);

    const filas: (typeof celdas)[] = [];
    for (let i = 0; i < celdas.length; i += 7) filas.push(celdas.slice(i, i + 7));
    return filas;
  });

  navegarMes(meses: number): void {
    const d = new Date(this.pivotMes());
    d.setMonth(d.getMonth() + meses);
    this.pivotMes.set(d);
  }

  seleccionarDia(fecha: string, pasado: boolean): void {
    if (pasado) return;
    this.fechaSel.set(fecha);
  }

  private aMin(t: string): number {
    const [h, m] = (t || '00:00').split(':');
    return Number(h) * 60 + Number(m);
  }

  private aHora(min: number): string {
    const h = String(Math.floor(min / 60)).padStart(2, '0');
    const m = String(min % 60).padStart(2, '0');
    return `${h}:${m}`;
  }

  private get diaSemanaSel(): number {
    const g = new Date(this.fechaSel() + 'T00:00:00').getDay();
    return g === 0 ? 7 : g;
  }

  libres = computed<Intervalo[]>(() => {
    if (!this.fechaSel()) return [];
    const dia = this.diaSemanaSel;
    const bloques = this.agenda()
      .bloques.filter((b) => b.diaSemana === dia)
      .map((b) => ({ inicio: this.aMin(b.horaInicio), fin: this.aMin(b.horaFin) }))
      .sort((a, b) => a.inicio - b.inicio);

    const citas = this.agenda()
      .citas.map((c) => ({ inicio: this.aMin(c.horaInicio), fin: this.aMin(c.horaFin) }))
      .sort((a, b) => a.inicio - b.inicio);

    const resultado: Intervalo[] = [];
    for (const b of bloques) {
      let cursor = b.inicio;
      for (const c of citas) {
        if (c.fin <= cursor || c.inicio >= b.fin) continue;
        if (c.inicio > cursor) resultado.push({ inicio: cursor, fin: Math.min(c.inicio, b.fin) });
        cursor = Math.max(cursor, c.fin);
      }
      if (cursor < b.fin) resultado.push({ inicio: cursor, fin: b.fin });
    }
    return resultado.filter((i) => i.fin - i.inicio >= 30);
  });

  citasDia = computed(() =>
    this.agenda()
      .citas.slice()
      .sort((a, b) => this.aMin(a.horaInicio) - this.aMin(b.horaInicio)),
  );

  desdeOpciones = computed<string[]>(() => {
    const marcas: string[] = [];
    for (const iv of this.libres()) {
      for (let m = iv.inicio; m <= iv.fin - 30; m += 30) marcas.push(this.aHora(m));
    }
    return marcas;
  });

  hastaOpciones = computed<string[]>(() => {
    const d = this.desde();
    if (!d) return [];
    const dm = this.aMin(d);
    const iv = this.libres().find((i) => i.inicio <= dm && dm < i.fin);
    if (!iv) return [];
    const marcas: string[] = [];
    for (let m = dm + 30; m <= iv.fin; m += 30) marcas.push(this.aHora(m));
    return marcas;
  });

  hora(valor: string): string {
    return (valor || '').slice(0, 5);
  }

  confirmar(): void {
    if (!this.fechaSel() || !this.desde() || !this.hasta()) return;
    this.seleccionar.emit({
      fecha: this.fechaSel(),
      horaInicio: this.desde(),
      horaFin: this.hasta(),
    });
    this.close.emit();
  }
}
