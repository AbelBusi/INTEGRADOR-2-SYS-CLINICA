import { infoEstado } from '../interface/cita.interface';
import {
  DatosComprobante,
  ENTIDAD,
  dato,
  documentoPaciente,
  duracionMinutos,
  edadDesde,
  fechaCitaLarga,
  fechaHoraCorta,
  nombrePaciente,
  numeroCita,
} from './comprobante.util';

type Rgb = [number, number, number];

const GRIS: Rgb = [88, 89, 91];
const ROJO: Rgb = [217, 24, 42];
const TEAL: Rgb = [13, 107, 104];

const COLOR_ESTADO: Record<number, Rgb> = {
  0: [120, 120, 120],
  1: TEAL,
  2: ROJO,
  3: GRIS,
  4: [180, 83, 9],
};

export async function generarPdfCita(datos: DatosComprobante): Promise<Blob> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();
  const margen = 16;
  const anchoUtil = ancho - margen * 2;
  const columna = anchoUtil / 2;
  const cita = datos.cita;
  const medico = datos.medico;
  const paciente = datos.paciente;

  let y = 0;

  const asegurarEspacio = (necesario: number): void => {
    if (y + necesario > alto - 26) {
      doc.addPage();
      y = 20;
    }
  };

  const seccion = (titulo: string): void => {
    asegurarEspacio(20);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...ROJO);
    doc.text(titulo.toUpperCase(), margen, y);
    y += 2;
    doc.setDrawColor(215, 215, 215);
    doc.setLineWidth(0.3);
    doc.line(margen, y, ancho - margen, y);
    y += 6;
  };

  const campos = (pares: Array<[string, string]>): void => {
    for (let i = 0; i < pares.length; i += 2) {
      const fila = pares.slice(i, i + 2);
      let altura = 0;

      asegurarEspacio(16);

      fila.forEach(([etiqueta, valor], j) => {
        const x = margen + j * columna;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(120, 120, 120);
        doc.text(etiqueta.toUpperCase(), x, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        const lineas = doc.splitTextToSize(dato(valor), columna - 6) as string[];
        doc.text(lineas, x, y + 5);

        altura = Math.max(altura, 5 + lineas.length * 4.6);
      });

      y += altura + 3;
    }
  };

  const campoAncho = (etiqueta: string, valor: string): void => {
    asegurarEspacio(20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(etiqueta.toUpperCase(), margen, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const lineas = doc.splitTextToSize(dato(valor), anchoUtil) as string[];
    doc.text(lineas, margen, y + 5);

    y += 5 + lineas.length * 4.6 + 3;
  };

  doc.setFillColor(...GRIS);
  doc.rect(0, 0, ancho, 34, 'F');
  doc.setFillColor(...GRIS);
  doc.rect(0, 34, ancho / 2, 2, 'F');
  doc.setFillColor(...ROJO);
  doc.rect(ancho / 2, 34, ancho / 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(ENTIDAD.nombre.toUpperCase(), margen, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(ENTIDAD.institucion, margen, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('COMPROBANTE DE CITA MEDICA', margen, 29);

  y = 48;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('N° DE CITA', margen, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text(numeroCita(cita.id), margen, y + 8);

  const estado = infoEstado(cita.estado).texto.toUpperCase();
  doc.setFontSize(9);
  const anchoPildora = doc.getTextWidth(estado) + 10;
  doc.setFillColor(...(COLOR_ESTADO[cita.estado] ?? GRIS));
  doc.roundedRect(ancho - margen - anchoPildora, y + 1, anchoPildora, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(estado, ancho - margen - anchoPildora / 2, y + 6.4, { align: 'center' });

  y += 14;

  seccion('Datos de la cita');
  campos([
    ['Fecha', fechaCitaLarga(cita)],
    ['Horario', `${cita.inicio} - ${cita.salida} (${duracionMinutos(cita)} min)`],
  ]);
  campoAncho('Motivo de la consulta', cita.motivo);

  seccion('Paciente');
  campos([
    ['Nombre completo', nombrePaciente(datos)],
    ['Documento', documentoPaciente(datos)],
    ['Edad', edadDesde(paciente?.fechaNacimiento)],
    ['Género', dato(paciente?.genero)],
    ['Teléfono', dato(paciente?.telefono)],
    ['Correo', dato(paciente?.correo)],
    ['Entidad aseguradora', dato(paciente?.entidadAsegurado)],
    ['Código asegurado', dato(paciente?.codigoAsegurado)],
  ]);

  seccion('Médico');
  campos([
    ['Nombre completo', cita.medico],
    ['Especialidad', dato(medico?.especialidad)],
    ['N° de colegiatura (CMP)', dato(medico?.numeroColegiatura)],
    ['N° de especialidad (RNE)', dato(medico?.numeroEspecialidad)],
    ['Consejo regional', dato(medico?.consejoRegional)],
    ['Cargo', dato(medico?.cargo)],
  ]);

  seccion('Registro');
  campos([
    ['Registrado por', datos.registradoPor?.nombreCompleto ?? `Usuario #${cita.idUsuario}`],
    ['Usuario', dato(datos.registradoPor?.usuario)],
  ]);

  asegurarEspacio(34);
  y += 20;

  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.3);
  doc.line(margen, y, margen + 70, y);
  doc.line(ancho - margen - 70, y, ancho - margen, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Paciente o representante', margen + 35, y + 5, { align: 'center' });
  doc.text('Responsable del registro', ancho - margen - 35, y + 5, { align: 'center' });

  const paginas = doc.getNumberOfPages();

  for (let pagina = 1; pagina <= paginas; pagina++) {
    doc.setPage(pagina);

    doc.setDrawColor(215, 215, 215);
    doc.setLineWidth(0.3);
    doc.line(margen, alto - 18, ancho - margen, alto - 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Documento generado el ${fechaHoraCorta(datos.emitido)} - ${ENTIDAD.nombre}`,
      margen,
      alto - 12,
    );
    doc.text(`Página ${pagina} de ${paginas}`, ancho - margen, alto - 12, { align: 'right' });
  }

  return doc.output('blob');
}
