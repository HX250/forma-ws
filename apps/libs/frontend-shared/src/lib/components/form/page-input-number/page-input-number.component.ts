import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormProperties } from '../../../core/forms/form-properties';

export interface NumberValidations {
  min: string | number | null;
  max: string | number | null;
}

@Component({
  selector: 'app-number-input',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  standalone: true,
  templateUrl: './page-input-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNumberComponent extends FormProperties {
  control = input.required<FormControl<number | null>>();
  placeholder = input<string>('');
  label = input<string>('');
  name = input<string>('');
  step = input<number | string>('any');
  readonly = input<boolean>(false);
  validations = input<NumberValidations>({ min: null, max: null });

  valueChange = output<number | null>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();
  enter = output<Event>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value === '' ? null : Number(target.value);
    this.control().setValue(value);
    this.valueChange.emit(value);
  }
}
