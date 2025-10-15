import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface PageSelectItem {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-page-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSelect {
  items = input.required<PageSelectItem[]>();
  placeholder = input<string>('Select...');
  disabled = input<boolean>(false);
  label = input<string>('Select...');
  required = input<boolean>(false);
  multiple = input<boolean>(false);
  control = input.required<FormControl<any>>();

  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedItem = this.items().find(
      (item) => item.value == select.value
    );
    if (selectedItem) {
      this.control().setValue(selectedItem.value);
    }
  }

  isSelected(item: any): boolean {
    const value = this.control().value;

    return value && value.value === item.value;
  }
}
