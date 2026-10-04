export interface TableColumn<T> {
  header: string;
  field: keyof T | string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'actions' | 'custom';
}
