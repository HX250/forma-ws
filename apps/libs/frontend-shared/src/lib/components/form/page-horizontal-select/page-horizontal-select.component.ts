import { Component, input, computed, effect, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SelectOption } from '../../../utils/types/horizontal-select-options.model';

@Component({
  selector: 'app-page-horizontal-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './page-horizontal-select.component.html',
})
export class HorizontalSelectComponent<T> {
  control = input.required<FormControl<T[]>>();
  options = input.required<SelectOption<T>[]>();

  readonly value = signal<T[]>([]);

  ngOnInit() {
    this.value.set(this.control().value ?? []);

    this.control().valueChanges.subscribe((v) => {
      this.value.set(v ?? []);
    });
  }

  isSelected(option: T) {
    return computed(() => this.value().includes(option));
  }

  toggle(option: T) {
    const current = this.value();
    const exists = current.includes(option);

    const next = exists
      ? current.filter((v) => v !== option)
      : [...current, option];

    this.control().setValue(next);
    this.control().markAsDirty();
    this.control().markAsTouched();
  }
}
