import {
  Component,
  HostListener,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../core/services/toast.service';
import {
  DEFAULT_CSV_OPTIONS,
  DEFAULT_EXCEL_OPTIONS,
  DEFAULT_EXPORT_FORMATS,
  DEFAULT_PDF_OPTIONS,
  EXPORT_FORMAT_META,
  PDF_PAGE_SIZES,
  PDF_PAGE_SIZE_OPTIONS,
} from '../../export/constants/export.constants';
import { ExportError } from '../../export/interface/export.error';
import {
  CsvOptions,
  ExcelOptions,
  ExportDataSource,
  ExportFormat,
  ExportModuleConfig,
  ExportRequest,
  ExportScope,
  PdfOptions,
  PdfOrientation,
} from '../../export/interface/export.interface';
import { ExportService } from '../../export/services/export.service';

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './export-modal.component.html',
})
export class ExportModalComponent<T> implements OnInit {
  private readonly exportService = inject(ExportService);
  private readonly toastService = inject(ToastService);

  config = input.required<ExportModuleConfig<T>>();
  dataSource = input.required<ExportDataSource<T>>();
  onClose = output<void>();

  readonly formatMeta = EXPORT_FORMAT_META;
  readonly pageSizes = PDF_PAGE_SIZE_OPTIONS.map((value) => ({
    value,
    label: PDF_PAGE_SIZES[value].label,
  }));
  readonly orientations: { value: PdfOrientation; label: string; icon: string }[] = [
    { value: 'portrait', label: 'Vertical', icon: 'crop_portrait' },
    { value: 'landscape', label: 'Horizontal', icon: 'crop_landscape' },
  ];
  readonly marginOptions = [5, 10, 15, 20];
  readonly fontSizeOptions = [7, 8, 9, 10, 11, 12];

  format = signal<ExportFormat>('pdf');
  reportName = signal('');
  fileName = signal('');
  scope = signal<ExportScope>('filtered');
  selectedKeys = signal<Set<string>>(new Set());
  includeGeneratedDate = signal(true);
  appendDateToFileName = signal(true);
  pdf = signal<PdfOptions>({ ...DEFAULT_PDF_OPTIONS });
  excel = signal<ExcelOptions>({ ...DEFAULT_EXCEL_OPTIONS });
  csv = signal<CsvOptions>({ ...DEFAULT_CSV_OPTIONS });
  processing = signal(false);

  formats = computed(() => this.config().formats ?? DEFAULT_EXPORT_FORMATS);

  scopes = computed<ExportScope[]>(() => {
    const source = this.dataSource();
    const scopes: ExportScope[] = [];

    if (source.getPageRows) {
      scopes.push('page');
    }
    if (source.getFilteredRows) {
      scopes.push('filtered');
    }

    return scopes;
  });

  allowColumnSelection = computed(
    () => this.config().allowColumnSelection !== false && this.config().columns.length > 1,
  );

  selectedCount = computed(() => this.selectedKeys().size);

  canExport = computed(
    () =>
      !this.processing() &&
      this.selectedCount() > 0 &&
      this.scopes().length > 0 &&
      this.reportName().trim().length > 0 &&
      this.fileName().trim().length > 0,
  );

  ngOnInit(): void {
    const config = this.config();
    const formats = this.formats();
    const scopes = this.scopes();
    const preferredScope = config.defaultScope ?? 'filtered';

    this.format.set(
      config.defaultFormat && formats.includes(config.defaultFormat)
        ? config.defaultFormat
        : formats[0],
    );
    this.reportName.set(config.title);
    this.fileName.set(config.fileBaseName);
    this.scope.set(scopes.includes(preferredScope) ? preferredScope : (scopes[0] ?? 'filtered'));
    this.selectedKeys.set(
      new Set(
        config.columns
          .filter((column) => column.required || column.defaultSelected !== false)
          .map((column) => column.key),
      ),
    );
    this.pdf.set({ ...DEFAULT_PDF_OPTIONS, ...config.pdfDefaults });
    this.excel.set({ ...DEFAULT_EXCEL_OPTIONS, ...config.excelDefaults });
    this.csv.set({ ...DEFAULT_CSV_OPTIONS, ...config.csvDefaults });
  }

  @HostListener('document:keydown.escape')
  cancel(): void {
    if (!this.processing()) {
      this.onClose.emit();
    }
  }

  isSelected(key: string): boolean {
    return this.selectedKeys().has(key);
  }

  toggleColumn(key: string): void {
    this.selectedKeys.update((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  selectAllColumns(): void {
    this.selectedKeys.set(new Set(this.config().columns.map((column) => column.key)));
  }

  clearColumns(): void {
    this.selectedKeys.set(
      new Set(
        this.config()
          .columns.filter((column) => column.required)
          .map((column) => column.key),
      ),
    );
  }

  setPdf<K extends keyof PdfOptions>(key: K, value: PdfOptions[K]): void {
    this.pdf.update((current) => ({ ...current, [key]: value }));
  }

  setExcel<K extends keyof ExcelOptions>(key: K, value: ExcelOptions[K]): void {
    this.excel.update((current) => ({ ...current, [key]: value }));
  }

  setCsv<K extends keyof CsvOptions>(key: K, value: CsvOptions[K]): void {
    this.csv.update((current) => ({ ...current, [key]: value }));
  }

  async generate(): Promise<void> {
    if (!this.canExport()) {
      return;
    }

    this.processing.set(true);

    try {
      await this.exportService.export(this.config(), this.dataSource(), this.buildRequest());
      this.toastService.success('Reporte generado correctamente.');
      this.onClose.emit();
    } catch (error) {
      if (error instanceof ExportError) {
        this.toastService.error(error.message);
      } else {
        console.error('Error al generar el reporte');
        this.toastService.error('No se pudo generar el reporte. Intenta nuevamente.');
      }
    } finally {
      this.processing.set(false);
    }
  }

  private buildRequest(): ExportRequest {
    const format = this.format();

    return {
      format,
      reportName: this.reportName().trim(),
      fileName: this.fileName().trim(),
      scope: this.scope(),
      columnKeys: [...this.selectedKeys()],
      includeGeneratedDate: format !== 'csv' && this.includeGeneratedDate(),
      appendDateToFileName: this.appendDateToFileName(),
      pdf: this.pdf(),
      excel: this.excel(),
      csv: this.csv(),
    };
  }
}
