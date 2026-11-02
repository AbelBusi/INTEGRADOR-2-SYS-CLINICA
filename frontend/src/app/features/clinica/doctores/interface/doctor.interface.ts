export interface Doctor {
  id?: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  cmp: string;
  turno: 'Mañana' | 'Tarde' | 'Noche' | 'Completo';
  estado: 'activo' | 'inactivo';
  rating: number;
  pacientesAtendidos: number;
  telefono: string;
  email: string;
  diasAtencion: string[];
}

export interface DoctorEspecialidadResumen {
  id: number;
  nombres: string;
}

export interface Persona {
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

export interface Especialidad {
  id: number;
  nombre: string;
}

export interface DoctorDetalle {
  id: number;
  persona: Persona;
  cpm: string;
  rne: string;
  consejoRegional: string;
  especialidad: Especialidad;
  estado: number;
}

export interface PersonaActualizarDTO {
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  nacionalidad: string;
  correo: string;
  estado: number;
}

export interface EspecialidadRefDoctorDTO {
  id: number;
}

export interface DoctorActualizarDTO {
  cpm: string;
  rne: string;
  consejoRegional: string;
  foto: string;
  persona: PersonaActualizarDTO;
  especialidad: EspecialidadRefDoctorDTO;
  estado: number;
}
