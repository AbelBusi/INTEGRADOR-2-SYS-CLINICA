import { ExportModuleConfig } from '../../../../shared/export/interface/export.interface';
import { Medico } from '../interface/medico.interface';

export function crearMedicoExportConfig(getFilters: () => string[]): ExportModuleConfig<Medico> {
  return {
    title: 'Reporte de médicos',
    fileBaseName: 'reporte-medicos',
    sheetName: 'Médicos',
    formats: ['pdf', 'excel', 'csv'],
    defaultScope: 'filtered',
    getFilters,
    columns: [
      { key: 'nombreCompleto', header: 'Médico', value: (m) => m.nombreCompleto, width: 3 },
      { key: 'cargo', header: 'Cargo', value: (m) => m.cargo, width: 1.6 },
      { key: 'especialidad', header: 'Especialidad', value: (m) => m.especialidad, width: 2 },
      {
        key: 'numeroColegiatura',
        header: 'Colegiatura',
        value: (m) => m.numeroColegiatura,
        width: 1.3,
      },
      { key: 'telefono', header: 'Teléfono', value: (m) => m.telefono, width: 1.4 },
      {
        key: 'estado',
        header: 'Estado',
        value: (m) => (m.estado === 1 ? 'Activo' : 'Desactivado'),
        width: 1.2,
      },
    ],
  };
}
