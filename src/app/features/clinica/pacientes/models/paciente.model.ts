import { PacienteInterface } from '../interface/paciente.interface';

export interface MensajeResponse<T=any> {
  mensaje: string;
  object: T;
}

export interface MensajeResponseSingle {
  mensaje: string;
  object: PacienteInterface;
}
