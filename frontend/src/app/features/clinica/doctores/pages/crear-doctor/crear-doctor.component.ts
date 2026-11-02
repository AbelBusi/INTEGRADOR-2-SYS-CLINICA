import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { CatalogoService, ResumenItem } from '../../../../../core/services/catalogo.service';
import { ReniecService } from '../../../../../core/services/reniec.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-crear-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-doctor.component.html',
})
export class CrearDoctorComponent implements OnInit {
  private readonly doctorService = inject(DoctorService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly reniecService = inject(ReniecService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  especialidades: ResumenItem[] = [];
  loading = false;
  isSaving = false;

  form = {
    cpm: '',
    rne: '',
    consejoRegional: 'CMP Lima',
    foto: 'default.jpg',
    dni: '',
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: 'Masculino',
    telefono: '',
    nacionalidad: 'Peruana',
    correo: '',
    especialidadId: 0,
    estado: 1,
  };

  ngOnInit(): void {
    this.catalogoService.especialidadesResumen().subscribe({
      next: (data) => (this.especialidades = data),
    });
  }

  handleConsultarDNI() {
    const dniDestino = this.form.dni;

    if (!dniDestino || dniDestino.length !== 8) {
      this.toastService.warning('El DNI debe tener exactamente 8 dígitos.');
      return;
    }

    this.loading = true;

    this.reniecService.consultarDni(dniDestino).subscribe({
      next: (datosMapeados) => {
        this.loading = false;
        if (datosMapeados) {
          this.form.nombre = datosMapeados.nombre;
          this.form.apellidos = datosMapeados.apellidos;
          this.toastService.success('Datos cargados desde RENIEC.');
        } else {
          this.toastService.error('No se encontraron registros para el DNI ingresado.');
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        const msgError = err.error?.mensaje || 'Error al conectar con el servicio de RENIEC.';
        this.toastService.error(msgError);
      },
    });
  }

  handleSubmit() {
    if (
      !this.form.cpm ||
      !this.form.nombre ||
      !this.form.apellidos ||
      !this.form.dni ||
      !this.form.especialidadId
    ) {
      this.toastService.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this.loading = true;

    this.doctorService
      .crear({
        cpm: this.form.cpm,
        rne: this.form.rne || undefined,
        consejoRegional: this.form.consejoRegional,
        foto: this.form.foto,
        persona: {
          dni: this.form.dni,
          nombre: this.form.nombre,
          apellidos: this.form.apellidos,
          fechaNacimiento: this.form.fechaNacimiento,
          genero: this.form.genero,
          telefono: this.form.telefono,
          nacionalidad: this.form.nacionalidad,
          correo: this.form.correo,
          estado: 1,
        },
        especialidad: { id: this.form.especialidadId },
        estado: this.form.estado,
      })
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.isSaving = true;

          const mensajeExito = response?.mensaje || 'Doctor registrado correctamente.';
          this.toastService.success(mensajeExito);

          setTimeout(() => {
            this.router.navigate(['/dashboard/doctores']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          this.isSaving = false;
          console.error(err);

          const mensajeError = err.error?.mensaje || 'No se pudo registrar el doctor.';
          this.toastService.error(mensajeError);
        },
      });
  }
}
