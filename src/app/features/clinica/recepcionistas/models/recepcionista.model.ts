import { PersonaCrearDTO } from '../../pacientes/interface/paciente.interface';

export interface RecepcionistaLeer {
  id: number;
  codigoEmpleado: string;
  nombre: string;
  apellidos: string;
  genero: string;
  estado: number;
}

export interface PersonaLeer {
  id: number;
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  nacionalidad: string;
  correo: string;
}

export interface RecepcionistaDetalle {
  id: number;
  persona: PersonaLeer;
  codigoEmpleado: string;
  estado: number;
}

export interface RecepcionistaCrearDTO {
  persona: PersonaCrearDTO;
  codigoEmpleado: string;
  estado?: number;
}

export interface RecepcionistaActualizarDTO {
  persona: PersonaCrearDTO;
  codigoEmpleado: string;
  estado?: number;
}
