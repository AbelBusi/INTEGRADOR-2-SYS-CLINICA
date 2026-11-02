import { ExportModuleConfig } from '../../../../shared/export/interface/export.interface';
import { Empleado } from '../interface/empleado.interface';


export function crearEmpleadoExportConfig(
  getFilters: () => string[],
): ExportModuleConfig<Empleado> {
  return {
    title: 'Reporte de empleados',
    fileBaseName: 'reporte-empleados',
    sheetName: 'Empleados',
    formats: ['pdf', 'excel', 'csv'],
    defaultScope: 'filtered',
    getFilters,
    columns: [
      { key: 'nombreCompleto', header: 'Empleado', value: (e) => e.nombreCompleto, width: 3 },
      { key: 'numeroDocumento', header: 'Documento', value: (e) => e.numeroDocumento, width: 1.4 },
      { key: 'telefono', header: 'Teléfono', value: (e) => e.telefono, width: 1.4 },
      { key: 'cargo', header: 'Cargo', value: (e) => e.cargo, width: 2 },
      {
        key: 'fechaIngreso',
        header: 'Fecha de ingreso',
        value: (e) => e.fechaIngreso,
        type: 'date',
        align: 'center',
        width: 1.4,
      },
      {
        key: 'estado',
        header: 'Estado',
        value: (e) => (e.estado === 1 ? 'Activo' : 'Desactivado'),
        width: 1.2,
      },
    ],
  };
}
