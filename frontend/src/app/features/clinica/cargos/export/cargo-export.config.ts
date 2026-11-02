import { ExportModuleConfig } from '../../../../shared/export/interface/export.interface';
import { cargo } from '../interface/cargo.interface';

export function crearCargoExportConfig(getFilters: () => string[]): ExportModuleConfig<cargo> {
  return {
    title: 'Reporte de cargos',
    fileBaseName: 'reporte-cargos',
    sheetName: 'Cargos',
    formats: ['pdf', 'excel', 'csv'],
    defaultScope: 'filtered',
    getFilters,
    columns: [
      { key: 'nombre', header: 'Cargo', value: (c) => c.nombre, width: 2 },
      { key: 'descripcion', header: 'Descripción', value: (c) => c.descripcion, width: 4 },
      {
        key: 'esPersonalMedico',
        header: '¿Es personal médico?',
        value: (c) => (c.esPersonalMedico ? 'Sí' : 'No'),
        align: 'center',
        width: 1.6,
      },
      {
        key: 'estado',
        header: 'Estado',
        value: (c) => (c.estado === 1 ? 'Activo' : 'Desactivado'),
        width: 1.2,
      },
    ],
  };
}
