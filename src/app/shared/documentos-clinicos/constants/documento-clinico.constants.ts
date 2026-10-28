import {
  AnchoTicket,
  DefinicionDocumento,
  Establecimiento,
  FormatoDocumento,
} from '../interface/documento-clinico.interface';

export type ColorPdf = [number, number, number];

export const ESTABLECIMIENTO: Establecimiento = {
  entidad: 'Ministerio de Salud',
  nombre: 'Centro de Salud Especializado José Olaya Balandra',
  logoUrl: '/login-portada/minsa.png',
  codigoIpress: '',
  direccion: '',
  telefono: '',
  correo: '',
  ruc: '',
  marcaDeAgua: true,
};

export const COLORES_PDF: Record<
  'rojo' | 'gris' | 'grisClaro' | 'borde' | 'texto' | 'suave' | 'blanco',
  ColorPdf
> = {
  rojo: [217, 24, 42],
  gris: [88, 89, 91],
  grisClaro: [244, 244, 245],
  borde: [200, 200, 202],
  texto: [38, 38, 38],
  suave: [115, 115, 118],
  blanco: [255, 255, 255],
};

export const DEFINICIONES_DOCUMENTOS: DefinicionDocumento[] = [
  {
    tipo: 'resumen',
    titulo: 'Resumen de atención médica',
    tituloPdf: 'Resumen de atención médica',
    descripcion: 'Motivo, diagnósticos y registros asociados a la atención.',
    icono: 'summarize',
    prefijo: 'RES',
    admiteTicket: false,
  },
  {
    tipo: 'diagnostico',
    titulo: 'Diagnóstico médico',
    tituloPdf: 'Diagnóstico médico',
    descripcion: 'Código, descripción, tipo y observaciones.',
    icono: 'assignment',
    prefijo: 'DX',
    admiteTicket: true,
  },
  {
    tipo: 'tratamientos',
    titulo: 'Tratamientos',
    tituloPdf: 'Tratamiento médico',
    descripcion: 'Medicamento, dosis, vía, frecuencia y duración.',
    icono: 'medication',
    prefijo: 'TRT',
    admiteTicket: true,
  },
  {
    tipo: 'indicaciones',
    titulo: 'Indicaciones médicas',
    tituloPdf: 'Indicaciones médicas',
    descripcion: 'Indicaciones, frecuencia y días de reposo.',
    icono: 'fact_check',
    prefijo: 'IND',
    admiteTicket: true,
  },
  {
    tipo: 'examenes',
    titulo: 'Exámenes médicos',
    tituloPdf: 'Exámenes médicos solicitados',
    descripcion: 'Exámenes solicitados con su motivo.',
    icono: 'science',
    prefijo: 'EXA',
    admiteTicket: true,
  },
  {
    tipo: 'derivaciones',
    titulo: 'Derivaciones o referencias',
    tituloPdf: 'Referencia / derivación a especialidad',
    descripcion: 'Especialidad de destino, urgencia y motivo.',
    icono: 'call_split',
    prefijo: 'REF',
    admiteTicket: true,
  },
];

export const MOTIVOS_NO_DISPONIBLE: Record<string, string> = {
  resumen: 'Requiere al menos un diagnóstico registrado.',
  diagnostico: 'No hay diagnósticos registrados.',
  tratamientos: 'No hay tratamientos registrados.',
  indicaciones: 'No hay indicaciones registradas.',
  examenes: 'No hay exámenes solicitados.',
  derivaciones: 'No hay derivaciones registradas.',
};

export const FORMATOS_DOCUMENTO: { valor: FormatoDocumento; texto: string; icono: string }[] = [
  { valor: 'a4', texto: 'A4', icono: 'description' },
  { valor: 'ticket', texto: 'Ticket térmico', icono: 'receipt_long' },
];

export const ANCHOS_TICKET: { valor: AnchoTicket; texto: string }[] = [
  { valor: 58, texto: '58 mm' },
  { valor: 80, texto: '80 mm' },
];

export const ETIQUETAS_TICKET = [
  'Paciente',
  'Documento',
  'Edad',
  'Sexo',
  'N° de atención',
  'Fecha de atención',
  'Médico tratante',
  'Colegiatura',
];
