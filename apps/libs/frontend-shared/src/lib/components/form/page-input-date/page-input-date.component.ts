import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
  effect,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormProperties } from '../../../core/forms/form-properties';
import { DateValidations } from '../models/date-validation.model';

@Component({
  selector: 'app-date-input',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  standalone: true,
  templateUrl: './page-input-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDateComponent extends FormProperties {
  control = input.required<FormControl<Date | null>>();
  type = input<'date' | 'datetime-local' | 'time'>('date');
  placeholder = input<string>('');
  label = input<string>('');
  name = input<string>('');
  readonly = input<boolean>(false);
  validations = input<DateValidations>();
  stylingClass = input<string>(
    'w-full text-base px-2 py-3 text-primary-dark dark:text-primary border-secondary/20 bg-primary dark:border-secondary-dark/20 dark:bg-primary-dark shadow-sm placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:bg-muted dark:disabled:bg-muted-dark disabled:text-muted dark:disabled:text-muted-dark disabled:cursor-not-allowed readonly:bg-secondary dark:readonly:bg-secondary-dark readonly:cursor-default transition-colors duration-200'
  );

  valueChange = output<Date | null>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();
  enter = output<Event>();

  private currentValue = signal<Date | null>(null);

  constructor() {
    super();
    effect(() => {
      const ctrl = this.control();
      this.currentValue.set(ctrl.value);
      const subscription = ctrl.valueChanges.subscribe((value) => {
        this.currentValue.set(value);
      });
      return () => subscription.unsubscribe();
    });
  }

  inputValue = computed(() => {
    let date = this.currentValue();

    if (!date) return '';

    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  });

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value ? new Date(target.value) : null;

    if (!value) {
      return;
    }

    this.control().setValue(value);
    this.valueChange.emit(value);
  }
}
