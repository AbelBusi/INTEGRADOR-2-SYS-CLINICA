import { infoEstado } from '../interface/cita.interface';
import {
  DatosComprobante,
  ENTIDAD,
  dato,
  documentoPaciente,
  duracionMinutos,
  fechaCitaLarga,
  fechaHoraCorta,
  nombrePaciente,
  numeroCita,
} from './comprobante.util';

function esc(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function construirTicketHtml(datos: DatosComprobante): string {
  const cita = datos.cita;
  const medico = datos.medico;

  const fila = (etiqueta: string, valor: string): string =>
    `<div class="fila"><span class="et">${esc(etiqueta)}</span><span class="val">${esc(valor)}</span></div>`;

  const bloque = (valor: string): string => `<div class="bloque">${esc(valor)}</div>`;

  const documento = documentoPaciente(datos);

  const lineasMedico = [
    bloque(cita.medico),
    fila('Especialidad', dato(medico?.especialidad)),
    medico?.numeroColegiatura ? fila('CMP', medico.numeroColegiatura) : '',
  ].join('');

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Ticket ${esc(numeroCita(cita.id))}</title>
<style>
  @page { size: 80mm auto; margin: 4mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { font-family: 'Courier New', Courier, monospace; font-size: 12px; line-height: 1.35; color: #111; background: #ececec; }
  .ticket { width: 302px; margin: 16px auto; padding: 18px 16px; background: #fff; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25); }
  .centro { text-align: center; }
  .titulo { font-size: 14px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .sub { font-size: 11px; color: #444; }
  .nro { font-size: 15px; font-weight: 700; letter-spacing: 1px; margin-top: 4px; }
  .sep { border-top: 1px dashed #555; margin: 10px 0; }
  .sec { font-weight: 700; margin-bottom: 3px; text-transform: uppercase; }
  .fila { display: flex; justify-content: space-between; gap: 8px; margin: 2px 0; }
  .et { color: #444; flex-shrink: 0; }
  .val { text-align: right; font-weight: 700; word-break: break-word; }
  .bloque { word-break: break-word; margin: 2px 0; font-weight: 700; }
  .texto { word-break: break-word; margin: 2px 0; }
  .pie { font-size: 11px; color: #333; }
  @media print {
    body { background: #fff; }
    .ticket { width: 100%; margin: 0; padding: 0; box-shadow: none; }
  }
</style>
</head>
<body>
  <div class="ticket">
    <div class="centro">
      <div class="titulo">${esc(ENTIDAD.nombre)}</div>
      <div class="sub">${esc(ENTIDAD.institucion)}</div>
    </div>

    <div class="sep"></div>

    <div class="centro">
      <div class="sec">Comprobante de cita médica</div>
      <div class="nro">N° ${esc(numeroCita(cita.id))}</div>
    </div>

    <div class="sep"></div>

    <div class="sec">Paciente</div>
    ${bloque(nombrePaciente(datos))}
    ${documento ? `<div class="texto">${esc(documento)}</div>` : ''}

    <div class="sep"></div>

    <div class="sec">Médico</div>
    ${lineasMedico}

    <div class="sep"></div>

    ${fila('Fecha', cita.fecha.split('-').reverse().join('/'))}
    <div class="texto">${esc(fechaCitaLarga(cita))}</div>
    ${fila('Hora', `${cita.inicio} - ${cita.salida}`)}
    ${fila('Duración', `${duracionMinutos(cita)} min`)}
    ${fila('Estado', infoEstado(cita.estado).texto.toUpperCase())}

    <div class="sep"></div>

    <div class="sec">Motivo</div>
    <div class="texto">${esc(cita.motivo)}</div>

    <div class="sep"></div>

    <div class="pie">
      <div>Emitido: ${esc(fechaHoraCorta(datos.emitido))}</div>
      ${datos.registradoPor ? `<div>Registró: ${esc(datos.registradoPor.usuario)}</div>` : ''}
    </div>

    <div class="sep"></div>

    <div class="centro pie">Conserve este comprobante</div>
  </div>
</body>
</html>`;
}
