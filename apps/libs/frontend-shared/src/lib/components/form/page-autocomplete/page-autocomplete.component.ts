import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../utils/directives/click-outside.directive';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherPipe } from './../../../utils/pipes/language-swithcher-response.pipe';

export interface AutocompleteItem<T = any> {
  id: string;
  label: string;
  labelSk?: string;
  value: T;
}

@Component({
  selector: 'app-page-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClickOutsideDirective,
    TranslateModule,
    LanguageSwitcherPipe,
  ],
  templateUrl: './page-autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageAutocomplete<T = any> {
  control = input.required<FormControl<string>>();
  results = input<AutocompleteItem<T>[]>([]);
  placeholder = input<string>('COMPONENTS.FORM.AUTOCOMPLETE.PLACEHOLDER');
  disabled = input<boolean>(false);
  label = input<string>('');
  required = input<boolean>(false);
  loading = input<boolean>(false);
  minChars = input<number>(2);
  debounceTime = input<number>(300);
  noResultsText = input<string>('COMPONENTS.FORM.AUTOCOMPLETE.NO_RESULTS');

  searchChange = output<void>();
  itemSelected = output<AutocompleteItem<T>>();
  cleared = output<void>();

  isOpen = signal(false);
  dropdownPosition = signal<{ top: string; left: string; width: string }>({
    top: '0px',
    left: '0px',
    width: '0px',
  });

  inputRef = viewChild<ElementRef>('searchInput');

  private debounceTimeout: any;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.updateDropdownPosition();
      }
    });

    effect(() => {
      const value = this.control().value || '';
      const results = this.results();

      if (
        value.length >= this.minChars() &&
        results.length > 0 &&
        document.activeElement === this.inputRef()?.nativeElement
      ) {
        this.isOpen.set(true);
      }
    });
  }

  private handleSearch(value: string) {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.isOpen.set(true);
    }, this.debounceTime());
  }

  private updateDropdownPosition() {
    const input = this.inputRef()?.nativeElement;
    if (input) {
      const rect = input.getBoundingClientRect();
      this.dropdownPosition.set({
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    }
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.control().setValue(value);

    this.searchChange.emit();
  }

  onFocus() {
    const value = this.control().value;
    if (value && value.length >= this.minChars() && this.results().length > 0) {
      this.isOpen.set(true);
    }
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  onSelectItem(item: AutocompleteItem<T>, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.control().setValue(item.label);
    this.itemSelected.emit(item);
    this.closeDropdown();
  }

  clearInput(event: Event) {
    event.stopPropagation();
    this.control().setValue('');
    this.cleared.emit();
    this.closeDropdown();
    this.inputRef()?.nativeElement.focus();
  }
}
