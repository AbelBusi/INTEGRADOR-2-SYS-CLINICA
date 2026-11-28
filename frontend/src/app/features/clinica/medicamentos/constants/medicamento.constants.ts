import { GrupoTerapeutico, IndicacionTerapeutica } from '../interface/medicamento.interface';

/** Deben coincidir con los enums GrupoTerapeutico e IndicacionTerapeutica del backend. */
export const GRUPOS_TERAPEUTICOS: { valor: GrupoTerapeutico; texto: string }[] = [
  { valor: 'ANALGESICO_ANTIPIRETICO', texto: 'Analgésico / Antipirético' },
  { valor: 'AINE', texto: 'Antiinflamatorio no esteroideo (AINE)' },
  { valor: 'ANTIBIOTICO', texto: 'Antibiótico' },
  { valor: 'ANTIHISTAMINICO', texto: 'Antihistamínico / Antialérgico' },
  { valor: 'ANTIHIPERTENSIVO', texto: 'Antihipertensivo' },
  { valor: 'ANTIDIABETICO', texto: 'Antidiabético' },
  { valor: 'ANTIULCEROSO', texto: 'Antiulceroso / Protector gástrico' },
  { valor: 'ANTIESPASMODICO', texto: 'Antiespasmódico' },
  { valor: 'ANTIDIARREICO', texto: 'Antidiarreico / Rehidratante' },
  { valor: 'ANTITUSIVO', texto: 'Antitusivo / Expectorante' },
  { valor: 'BRONCODILATADOR', texto: 'Broncodilatador' },
  { valor: 'CORTICOIDE', texto: 'Corticoide' },
  { valor: 'ANTIFUNGICO', texto: 'Antifúngico' },
  { valor: 'ANTIPARASITARIO', texto: 'Antiparasitario' },
  { valor: 'ANTIVIRAL', texto: 'Antiviral' },
  { valor: 'ANSIOLITICO', texto: 'Ansiolítico / Sedante' },
  { valor: 'ANTICONVULSIVANTE', texto: 'Anticonvulsivante' },
  { valor: 'VITAMINA_SUPLEMENTO', texto: 'Vitamina / Suplemento' },
  { valor: 'HORMONAL', texto: 'Anticonceptivo / Hormonal' },
  { valor: 'ANESTESICO_LOCAL', texto: 'Anestésico local' },
  { valor: 'ANTISEPTICO', texto: 'Antiséptico / Desinfectante' },
  { valor: 'HIPOLIPEMIANTE', texto: 'Hipolipemiante' },
  { valor: 'DIURETICO', texto: 'Diurético' },
  { valor: 'ANTICOAGULANTE', texto: 'Anticoagulante / Antiagregante' },
  { valor: 'DESCONGESTIONANTE_NASAL', texto: 'Descongestionante nasal' },
  { valor: 'OTRO', texto: 'Otro' },
];

export const INDICACIONES_TERAPEUTICAS: { valor: IndicacionTerapeutica; texto: string }[] = [
  { valor: 'ALIVIO_DOLOR_FIEBRE', texto: 'Alivio del dolor y reducción de la fiebre' },
  { valor: 'ALIVIO_DOLOR_INFLAMACION', texto: 'Alivio del dolor y la inflamación' },
  { valor: 'INFECCIONES_BACTERIANAS', texto: 'Tratamiento de infecciones bacterianas' },
  { valor: 'ALERGIA', texto: 'Alivio de los síntomas de la alergia' },
  { valor: 'PRESION_ARTERIAL', texto: 'Control de la presión arterial elevada' },
  { valor: 'DIABETES', texto: 'Control de la glucosa en la diabetes' },
  { valor: 'ACIDEZ_GASTRICA', texto: 'Reducción de la acidez y protección del estómago' },
  { valor: 'COLICOS_ESPASMOS', texto: 'Alivio de cólicos y espasmos abdominales' },
  { valor: 'DIARREA_REHIDRATACION', texto: 'Tratamiento de la diarrea y reposición de líquidos' },
  { valor: 'TOS_SECRECIONES', texto: 'Alivio de la tos y fluidificación de secreciones' },
  {
    valor: 'DIFICULTAD_RESPIRATORIA',
    texto: 'Alivio de la dificultad respiratoria (asma, broncoespasmo)',
  },
  {
    valor: 'INFLAMACION_ALERGIA_SEVERA',
    texto: 'Control de procesos inflamatorios y alérgicos severos',
  },
  { valor: 'INFECCIONES_HONGOS', texto: 'Tratamiento de infecciones por hongos' },
  { valor: 'PARASITOSIS', texto: 'Tratamiento de parasitosis' },
  { valor: 'INFECCIONES_VIRALES', texto: 'Tratamiento de infecciones virales' },
  { valor: 'ANSIEDAD_SUENO', texto: 'Control de la ansiedad y trastornos del sueño' },
  { valor: 'CONVULSIONES', texto: 'Control de las convulsiones' },
  {
    valor: 'DEFICIENCIA_NUTRICIONAL',
    texto: 'Prevención y corrección de deficiencias nutricionales',
  },
  { valor: 'ANTICONCEPCION', texto: 'Control de la natalidad' },
  { valor: 'ANESTESIA_LOCAL', texto: 'Anestesia local' },
  { valor: 'DESINFECCION', texto: 'Desinfección de heridas y piel' },
  { valor: 'COLESTEROL', texto: 'Control del colesterol y los triglicéridos' },
  { valor: 'EDEMAS', texto: 'Eliminación de líquidos y control de edemas' },
  { valor: 'PREVENCION_COAGULOS', texto: 'Prevención de coágulos sanguíneos' },
  { valor: 'CONGESTION_NASAL', texto: 'Alivio de la congestión nasal' },
  { valor: 'OTRA', texto: 'Otra indicación' },
];

/** Datos de la imagen referencial (deben coincidir con las reglas del backend). */
export const IMAGEN_TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
export const IMAGEN_TAMANIO_MAXIMO = 2 * 1024 * 1024;
