import { ExportModuleConfig } from '../../../../shared/export/interface/export.interface';
import { ExamenMedico } from '../interface/examen-medico.interface';

export function crearExamenMedicoExportConfig(
  getFilters: () => string[],
): ExportModuleConfig<ExamenMedico> {
  return {
    title: 'Reporte de exámenes médicos',
    fileBaseName: 'reporte-examenes-medicos',
    sheetName: 'Exámenes médicos',
    formats: ['pdf', 'excel', 'csv'],
    defaultScope: 'filtered',
    getFilters,
    columns: [
      { key: 'nombre', header: 'Examen', value: (e) => e.nombre, width: 2.5 },
      { key: 'tipoExamen', header: 'Tipo', value: (e) => e.tipoExamen, width: 1.8 },
      { key: 'descripcion', header: 'Descripción', value: (e) => e.descripcion, width: 3.5 },
      {
        key: 'estado',
        header: 'Estado',
        value: (e) => (e.estado === 1 ? 'Activo' : 'Desactivado'),
        width: 1.2,
      },
    ],
  };
}
