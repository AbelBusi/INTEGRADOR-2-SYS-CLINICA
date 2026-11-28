import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LIMITE_DIAS_DESCANSO, MINUTOS_PARA_CANCELAR } from '../../utils/descanso-medico.util';

interface Politica {
  titulo: string;
  detalle: string;
  sustento: string;
}

/**
 * Texto de referencia, solo frontend. Los plazos son políticas internas del establecimiento y las leyes citadas
 * deben ser validadas por el área legal antes de pasar a producción.
 */
@Component({
  selector: 'app-descanso-politicas-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './descanso-politicas-modal.component.html',
})
export class DescansoPoliticasModalComponent {
  @Input() soloLectura = false;
  @Output() aceptar = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  readonly politicas: Politica[] = [
    {
      titulo: 'Un descanso vigente por atención médica',
      detalle:
        'Cada atención admite un único descanso médico vigente. Si se emitió por error, puede cancelarse dentro del plazo indicado y emitir uno nuevo mientras no pasen las 24 horas de la atención.',
      sustento:
        'Evita documentos vigentes duplicados o contradictorios sobre una misma evaluación clínica. Los descansos cancelados se conservan para trazabilidad.',
    },
    {
      titulo: 'Emisión dentro de las 24 horas',
      detalle:
        'El descanso solo puede generarse dentro de las 24 horas posteriores a la finalización de la atención. Vencido el plazo, el sistema no permite emitirlo.',
      sustento:
        'El descanso debe respaldarse en una evaluación reciente. Las emisiones tardías o retroactivas no reflejan el estado clínico observado durante la atención.',
    },
    {
      titulo: `Máximo ${LIMITE_DIAS_DESCANSO} días por descanso`,
      detalle: `El periodo no puede superar ${LIMITE_DIAS_DESCANSO} días calendario, debe iniciar hoy o en una fecha posterior, y la cantidad de días debe coincidir con el periodo (inicio y fin incluidos).`,
      sustento:
        'Es una política institucional: un reposo más prolongado requiere una nueva evaluación médica de seguimiento. No se emiten fechas pasadas para evitar la retroactividad.',
    },
    {
      titulo: 'Justificación médica obligatoria',
      detalle:
        'El médico debe explicar el motivo clínico del descanso. Queda registrada en la auditoría y no se muestra en la verificación pública.',
      sustento:
        'Cada descanso debe estar clínicamente sustentado y poder revisarse ante una auditoría o reclamo, sin exponer información de salud a terceros.',
    },
    {
      titulo: 'Confirmación electrónica del médico',
      detalle:
        'La emisión se confirma con un código de verificación. Los intentos con código incorrecto quedan registrados.',
      sustento:
        'Acredita que el médico responsable autoriza personalmente la emisión del documento.',
    },
    {
      titulo: `Cancelación dentro de ${MINUTOS_PARA_CANCELAR} minutos`,
      detalle: `Solo el médico emisor puede cancelar el descanso, con un motivo obligatorio y dentro de los ${MINUTOS_PARA_CANCELAR} minutos posteriores a su emisión. El documento no se elimina: permanece visible como cancelado.`,
      sustento:
        'La ventana breve permite corregir errores de emisión; pasado ese tiempo el documento es definitivo para preservar su integridad y trazabilidad.',
    },
    {
      titulo: 'Firma electrónica interna',
      detalle:
        'El documento incluye un sello, un identificador único y una huella SHA-256 generados por el sistema.',
      sustento:
        'Permiten detectar cualquier alteración. Es una firma electrónica interna del establecimiento y no constituye firma digital certificada en los términos de la Ley N.º 27269.',
    },
    {
      titulo: 'Auditoría y protección de datos',
      detalle:
        'Se registra quién emitió o canceló, cuándo, desde qué IP y con qué huella. Los registros no pueden modificarse ni eliminarse.',
      sustento:
        'Garantiza la trazabilidad. Los datos de salud son datos sensibles protegidos por la Ley N.º 29733; solo se usan para la atención y la verificación del documento.',
    },
    {
      titulo: 'Verificación pública mediante QR',
      detalle:
        'Cualquier persona puede escanear el QR del documento para comprobar si es auténtico y si sigue vigente. La página muestra datos parcialmente ocultos y ninguna información clínica.',
      sustento:
        'Permite a terceros, como un empleador, validar el documento sin exponer los datos personales del paciente.',
    },
  ];
}
