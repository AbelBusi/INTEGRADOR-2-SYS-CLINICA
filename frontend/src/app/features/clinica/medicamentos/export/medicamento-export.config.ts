import { ExportModuleConfig } from '../../../../shared/export/interface/export.interface';
import { Medicamento } from '../interface/medicamento.interface';
import { textoGrupo, textoIndicacion } from '../utils/medicamento.util';

export function crearMedicamentoExportConfig(
  getFilters: () => string[],
): ExportModuleConfig<Medicamento> {
  return {
    title: 'Reporte de medicamentos',
    fileBaseName: 'reporte-medicamentos',
    sheetName: 'Medicamentos',
    formats: ['pdf', 'excel', 'csv'],
    defaultScope: 'filtered',
    getFilters,
    columns: [
      { key: 'nombre', header: 'Medicamento', value: (m) => m.nombre, width: 2.5 },
      {
        key: 'principioActivo',
        header: 'Principio activo',
        value: (m) => m.principioActivo,
        width: 2,
      },
      { key: 'laboratorio', header: 'Laboratorio', value: (m) => m.laboratorio, width: 2 },
      { key: 'concentracion', header: 'Concentración', value: (m) => m.concentracion, width: 1.4 },
      {
        key: 'grupoTerapeutico',
        header: 'Grupo terapéutico',
        value: (m) => textoGrupo(m.grupoTerapeutico),
        width: 2,
      },
      {
        key: 'indicacionTerapeutica',
        header: 'Indicación',
        value: (m) => textoIndicacion(m.indicacionTerapeutica),
        width: 3,
      },
      {
        key: 'requiereReceta',
        header: 'Receta',
        value: (m) => (m.requiereReceta ? 'Con receta' : 'Venta libre'),
        align: 'center',
        width: 1.2,
      },
      {
        key: 'estado',
        header: 'Estado',
        value: (m) => (m.estado === 1 ? 'Activo' : 'Desactivado'),
        width: 1.2,
      },
    ],
  };
}
