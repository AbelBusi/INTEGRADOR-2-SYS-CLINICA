import { Injectable } from '@angular/core';
import { firstValueFrom, isObservable } from 'rxjs';

import { EXPORT_FORMAT_META } from '../constants/export.constants';
import { ExportError } from '../interface/export.error';
import {
  ExportDataSource,
  ExportModuleConfig,
  ExportRequest,
  ExportScope,
  ExportTable,
} from '../interface/export.interface';
import { buildFileName, downloadBlob } from '../utils/export-format.util';
import { buildExportTable } from '../utils/export-table.builder';

@Injectable({ providedIn: 'root' })
export class ExportService {
  async export<T>(
    config: ExportModuleConfig<T>,
    dataSource: ExportDataSource<T>,
    request: ExportRequest,
  ): Promise<void> {
    const formats = config.formats ?? ['pdf', 'excel', 'csv'];

    if (!formats.includes(request.format)) {
      throw new ExportError('El formato seleccionado no está disponible para este reporte.');
    }

    const rows = await this.resolveRows(dataSource, request.scope);

    if (!rows.length) {
      throw new ExportError('No hay registros para exportar.');
    }

    const table = buildExportTable(config, request, rows);
    const blob = await this.generate(table, request, config);
    const extension = EXPORT_FORMAT_META[request.format].extension;

    downloadBlob(
      blob,
      buildFileName(
        request.fileName,
        extension,
        request.appendDateToFileName ? new Date() : undefined,
      ),
    );
  }

  private async resolveRows<T>(dataSource: ExportDataSource<T>, scope: ExportScope): Promise<T[]> {
    if (scope === 'page') {
      return dataSource.getPageRows?.() ?? [];
    }

    const result = dataSource.getFilteredRows?.();

    if (!result) {
      return [];
    }

    return isObservable(result) ? firstValueFrom(result) : await result;
  }

  private async generate<T>(
    table: ExportTable,
    request: ExportRequest,
    config: ExportModuleConfig<T>,
  ): Promise<Blob> {
    switch (request.format) {
      case 'pdf': {
        const { generatePdf } = await import('../generators/pdf.generator');
        return generatePdf(table, request.pdf);
      }
      case 'excel': {
        const { generateExcel } = await import('../generators/excel.generator');
        return generateExcel(table, request.excel, config.sheetName ?? request.reportName);
      }
      case 'csv': {
        const { generateCsv } = await import('../generators/csv.generator');
        return generateCsv(table, request.csv);
      }
    }
  }
}
