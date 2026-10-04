import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecepcionistaService } from '../../services/recepcionista.service';
import { RecepcionistaCrearDTO } from '../../models/recepcionista.model';
import { ConsultaDniComponent } from '../../../../../shared/components/consulta-dni/consulta-dni.component';
import { DatosPersonaReniec } from '../../../../../core/services/reniec.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-crear-recepcionista',
  standalone: true,
  imports: [CommonModule, FormsModule, ConsultaDniComponent],
  templateUrl: './crear-recepcionista.component.html',
})
export class CrearRecepcionistaComponent {
  private recepcionistaService = inject(RecepcionistaService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loading = false;
  isSaving = false;

  form: RecepcionistaCrearDTO = {
    codigoEmpleado: '',
    estado: 1,
    persona: {
      dni: '',
      nombre: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: 'Femenino',
      telefono: '',
      nacionalidad: 'Peruana',
      correo: '',
      estado: 1,
    },
  };

  generos = ['Masculino', 'Femenino', 'Otro'];

  onDatosReniec(datos: DatosPersonaReniec) {
    this.form.persona = {
      ...this.form.persona,
      dni: datos.dni,
      nombre: datos.nombre,
      apellidos: datos.apellidos,
    };
    this.toastService.success('Datos cargados desde RENIEC.');
  }

  handleSubmit() {
    if (
      !this.form.codigoEmpleado ||
      !this.form.persona.dni ||
      !this.form.persona.nombre ||
      !this.form.persona.apellidos
    ) {
      this.toastService.warning('Por favor, complete todos los campos obligatorios.');
      return;
    }

    this.loading = true;
    this.recepcionistaService.crear(this.form).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.isSaving = true;
        this.toastService.success(response?.mensaje || 'Recepcionista registrado correctamente.');
        setTimeout(() => this.router.navigate(['/dashboard/recepcionistas']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.isSaving = false;
        const mensajeError = err.error?.mensaje || 'No se pudo registrar el recepcionista.';
        this.toastService.error(mensajeError);
      },
    });
  }
}
