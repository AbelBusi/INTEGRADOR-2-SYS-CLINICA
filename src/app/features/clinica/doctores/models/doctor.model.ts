export interface DoctorLeer {
  id: number;
  cpm: string;
  nombre: string;
  apellidos: string;
  especialidad: string;
  genero: string;
  estado: number;
}

export interface NombreDoctorResumen {
  idDoctor: number;
  nombreDoctor: string;
}

export interface DoctorCrearDTO {
  cpm: string;
  rne?: string;
  consejoRegional: string;
  foto: string;
  persona: {
    dni: string;
    nombre: string;
    apellidos: string;
    fechaNacimiento: string;
    genero: string;
    telefono?: string;
    nacionalidad: string;
    correo?: string;
    estado?: number;
  };
  especialidad: { id: number };
  estado?: number;
}
