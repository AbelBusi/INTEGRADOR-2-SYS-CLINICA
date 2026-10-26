import { ExportModuleConfig } from '../../../../shared/export/interface/export.interface';
import { Especialidad } from '../interface/especialidad.interface';

export function crearEspecialidadExportConfig(
  getFilters: () => string[],
): ExportModuleConfig<Especialidad> {
  return {
    title: 'Reporte de especialidades',
    fileBaseName: 'reporte-especialidades',
    sheetName: 'Especialidades',
    formats: ['pdf', 'excel', 'csv'],
    defaultScope: 'filtered',
    getFilters,
    columns: [
      { key: 'nombre', header: 'Especialidad', value: (e) => e.nombre, width: 2 },
      { key: 'descripcion', header: 'Descripción', value: (e) => e.descripcion, width: 5 },
      {
        key: 'estado',
        header: 'Estado',
        value: (e) => (e.estado === 1 ? 'Activo' : 'Desactivado'),
        width: 1.2,
      },
    ],
  };
}
