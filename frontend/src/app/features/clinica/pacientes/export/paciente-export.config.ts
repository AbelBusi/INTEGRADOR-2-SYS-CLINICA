import { ExportModuleConfig } from '../../../../shared/export/interface/export.interface';
import { Paciente } from '../interface/paciente.interface';

export function crearPacienteExportConfig(
  getFilters: () => string[],
): ExportModuleConfig<Paciente> {
  return {
    title: 'Reporte de pacientes',
    fileBaseName: 'reporte-pacientes',
    sheetName: 'Pacientes',
    formats: ['pdf', 'excel', 'csv'],
    defaultScope: 'filtered',
    getFilters,
    columns: [
      { key: 'paciente', header: 'Paciente', value: (p) => p.paciente, width: 3 },
      { key: 'genero', header: 'Género', value: (p) => p.genero, width: 1.2 },
      { key: 'telefono', header: 'Teléfono', value: (p) => p.telefono, width: 1.4 },
      { key: 'entidadAsegurado', header: 'Entidad', value: (p) => p.entidadAsegurado, width: 1.2 },
      {
        key: 'codigoAsegurado',
        header: 'Código asegurado',
        value: (p) => p.codigoAsegurado,
        width: 1.8,
      },
      {
        key: 'estado',
        header: 'Estado',
        value: (p) => (p.estado === 1 ? 'Activo' : 'Desactivado'),
        width: 1.2,
      },
    ],
  };
}
