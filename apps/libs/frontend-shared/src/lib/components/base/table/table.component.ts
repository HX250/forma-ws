import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  output,
  input,
  computed,
} from '@angular/core';
import { TableRowComponent } from './components/table-row.component';
import { TableColumn, TableModel } from './models/table.models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'forma-table',
  standalone: true,
  imports: [CommonModule, TableRowComponent, TranslateModule],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  columns = input<TableColumn<T>[]>([]);
  data = input<T[]>([]);
  model = input<TableModel>();

  rowClick = output<{ data: T; index: number }>();

  protected computedColumns = computed((): TableColumn<T>[] => {
    const model = this.model();
    if (model) {
      return Object.entries(model).map(([field, header]) => ({
        header,
        field: field as keyof T,
      }));
    }
    return this.columns();
  });

  protected gridTemplateColumns = computed(() => {
    const cols = this.computedColumns();
    if (cols.length > 0) {
      return `repeat(${cols.length}, 1fr)`;
    }
    return 'repeat(5, 1fr)';
  });

  protected columnCount = computed(() => {
    return this.computedColumns().length || 5;
  });

  protected onRowClick(event: { data: T; index: number }): void {
    this.rowClick.emit(event);
  }

  protected getCellValue(item: T, column: TableColumn<T>): string {
    if (column.field) {
      const value = item[column.field];

      if (typeof value === 'boolean') {
        return value ? '✓' : '✗';
      }

      return String(value ?? '');
    }
    return '';
  }
}
