import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorDetalle } from '../../interface/doctor.interface';
import { DoctorService } from '../../services/doctor.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { EspecialidadService } from '../../../especialidad/services/especialidad.service';

@Component({
  selector: 'app-editar-doctor-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-doctor-modal.component.html',
})
export class EditarDoctorModalComponent implements OnInit {
  private readonly doctorService = inject(DoctorService);
  private readonly toastService = inject(ToastService);
  private readonly especialidadService = inject(EspecialidadService);

  doctor = input.required<DoctorDetalle>();
  close = output<void>();
  save = output<any>();

  form = signal<any>({
    cpm: '',
    rne: '',
    consejoRegional: '',
    foto: 'default.jpg',
    estado: 1,
    especialidad: {
      id: null,
    },
    persona: {
      dni: '',
      nombre: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      telefono: '',
      nacionalidad: '',
      correo: '',
      estado: 1,
    },
  });

  guardando = signal<boolean>(false);

  generos = ['Masculino', 'Femenino', 'Otro'];
  especialidades: any[] = [];

  fechaMaxima = computed(() => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  });

  initials = computed(() => {
    const f = this.form();
    if (!f || !f.persona || !f.persona.nombre || !f.persona.apellidos) return 'DR';
    return `${f.persona.nombre[0] || ''}${f.persona.apellidos[0] || ''}`.toUpperCase();
  });

  ngOnInit(): void {
    this.cargarEspecialidades();

    const d = this.doctor();
    if (d) {
      this.form.set({
        cpm: d.cpm || '',
        rne: d.rne || '',
        consejoRegional: d.consejoRegional || '',
        foto: 'default.jpg',
        estado: d.estado || 1,
        especialidad: {
          id: (d.especialidad as any)?.id || null,
        },
        persona: {
          dni: d.persona?.dni || '',
          nombre: d.persona?.nombre || '',
          apellidos: d.persona?.apellidos || '',
          fechaNacimiento: d.persona?.fechaNacimiento || '',
          genero: d.persona?.genero || '',
          telefono: d.persona?.telefono || '',
          nacionalidad: d.persona?.nacionalidad || '',
          correo: d.persona?.correo || '',
          estado: 1,
        },
      });
    }
  }

  cargarEspecialidades(): void {
    this.especialidadService.listarResumen().subscribe({
      next: (res: any) => {
        // Tu API mapea el arreglo en la propiedad 'object'
        if (res && Array.isArray(res.object)) {
          this.especialidades = res.object;
        } else {
          this.especialidades = [];
          console.error('No se encontró la lista en res.object:', res);
        }

        const d = this.doctor();
        if (d && d.especialidad && !this.form().especialidad.id) {
          const idEncontrado = this.obtenerIdEspecialidad(d.especialidad.nombre);

          this.form.update((currentForm) => ({
            ...currentForm,
            especialidad: {
              ...currentForm.especialidad,
              id: idEncontrado,
            },
          }));
        }
      },
      error: () => {
        this.toastService.error('Error al cargar las especialidades.');
      },
    });
  }

  obtenerIdEspecialidad(nombre?: string): number | null {
    if (!nombre || !Array.isArray(this.especialidades)) return null;

    // Cambiado 'e.nombre' por 'e.nombreEspecialidad' y 'e.id' por 'e.idEspecialidad'
    const especialidad = this.especialidades.find(
      (e) => e.nombreEspecialidad?.toLowerCase() === nombre.toLowerCase(),
    );
    return especialidad ? especialidad.idEspecialidad : null;
  }


  handleClose(): void {
    this.close.emit();
  }

  handleSubmit(): void {
    if (this.guardando()) return;

    const payload = this.form();

    if (
      !payload.persona.nombre ||
      !payload.persona.apellidos ||
      !payload.persona.dni ||
      !payload.cpm ||
      !payload.consejoRegional ||
      !payload.especialidad.id ||
      !payload.persona.genero ||
      !payload.persona.fechaNacimiento
    ) {
      this.toastService.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (payload.persona.dni.length !== 8 || !/^\d+$/.test(payload.persona.dni)) {
      this.toastService.warning('El DNI debe contener exactamente 8 números.');
      return;
    }

    if (
      payload.persona.telefono &&
      (payload.persona.telefono.length !== 9 || !/^\d+$/.test(payload.persona.telefono))
    ) {
      this.toastService.warning('El teléfono debe contener exactamente 9 números.');
      return;
    }

    this.guardando.set(true);
    const idDoctor = this.doctor().id;

    payload.estado = 1;
    payload.persona.estado = 1;

    this.doctorService.actualizar(idDoctor, payload).subscribe({
      next: (doctorActualizado: any) => {
        this.guardando.set(false);
        this.toastService.success('Los datos del doctor fueron actualizados correctamente.');
        this.save.emit(doctorActualizado);
        this.close.emit();
      },
      error: (err: any) => {
        this.guardando.set(false);
        const mensajeError = err.error?.mensaje || 'No se pudieron guardar los cambios del doctor.';
        this.toastService.error(mensajeError);
      },
    });
  }
}
