import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../utils/directives/click-outside.directive';
import { SelectFieldType } from '../../../utils';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-page-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClickOutsideDirective,
    TranslateModule,
  ],
  templateUrl: './page-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSelect {
  private translateService = inject(TranslateService);

  items = input.required<SelectFieldType<any>[]>();
  placeholder = input<string>('Select...');
  disabled = input<boolean>(false);
  label = input<string>('');
  required = input<boolean>(false);
  multiple = input<boolean>(false);
  control = input.required<FormControl<any>>();

  isOpen = signal(false);
  dropdownPosition = signal<{ top: string; left: string; width: string }>({
    top: '0px',
    left: '0px',
    width: '0px',
  });

  buttonRef = viewChild<ElementRef>('selectButton');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.updateDropdownPosition();
      }
    });
  }

  toggleDropdown() {
    if (!this.disabled()) {
      this.isOpen.set(!this.isOpen());
      if (this.isOpen()) {
        setTimeout(() => this.updateDropdownPosition(), 0);
      }
    }
  }

  private updateDropdownPosition() {
    const button = this.buttonRef()?.nativeElement;
    if (button) {
      const rect = button.getBoundingClientRect();
      this.dropdownPosition.set({
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    }
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  onSelectItem(item: SelectFieldType<any>, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (this.multiple()) {
      const currentValue = this.control().value || [];
      const index = currentValue.findIndex((v: any) => v === item.value);

      if (index > -1) {
        const newValue = currentValue.filter(
          (_: any, i: number) => i !== index
        );
        this.control().setValue(newValue.length > 0 ? newValue : []);
      } else {
        this.control().setValue([...currentValue, item.value]);
      }
      this.control().markAsTouched();
    } else {
      this.control().setValue(item.value);
      this.control().markAsTouched();
      this.closeDropdown();
    }
  }

  isSelected(item: SelectFieldType<any>): boolean {
    const value = this.control().value;

    if (this.multiple()) {
      return Array.isArray(value) && value.includes(item.value);
    }

    return value === item.value;
  }

  getDisplayText(): string {
    const value = this.control().value;

    if (this.multiple()) {
      if (!value || !Array.isArray(value) || value.length === 0) {
        return this.translateService.instant(this.placeholder());
      }

      const selectedItems = this.items().filter((item) =>
        value.includes(item.value)
      );

      if (selectedItems.length === 1) {
        return this.translateService.instant(selectedItems[0].label);
      }

      return this.translateService.instant(
        'COMPONENTS.FORM.SELECT.SELECTED_COUNT',
        {
          count: selectedItems.length,
        }
      );
    }

    if (!value) {
      return this.translateService.instant(this.placeholder());
    }

    const selectedItem = this.items().find((item) => item.value === value);
    return selectedItem
      ? this.translateService.instant(selectedItem.label)
      : this.translateService.instant(this.placeholder());
  }

  getSelectedLabels(): string {
    const value = this.control().value;

    if (
      !this.multiple() ||
      !value ||
      !Array.isArray(value) ||
      value.length === 0
    ) {
      return '';
    }

    const selectedItems = this.items().filter((item) =>
      value.includes(item.value)
    );
    return selectedItems.map((item) => item.label).join(', ');
  }

  removeItem(item: SelectFieldType<any>, event: Event) {
    event.stopPropagation();

    if (this.multiple()) {
      const currentValue = this.control().value || [];
      const newValue = currentValue.filter((v: any) => v !== item.value);
      this.control().setValue(newValue.length > 0 ? newValue : []);
      this.control().markAsTouched();
    }
  }

  clearAll(event: Event) {
    event.stopPropagation();
    this.control().setValue(this.multiple() ? [] : null);
    this.control().markAsTouched();
  }
}
