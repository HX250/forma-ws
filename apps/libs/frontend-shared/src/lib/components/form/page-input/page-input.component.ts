import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormProperties } from '../../../core/forms/form-properties';

@Component({
  selector: 'app-page-input',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  standalone: true,
  templateUrl: './page-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageInput extends FormProperties {
  control = input.required<FormControl<any>>();
  type = input<string>('text');
  placeholder = input<string>('');
  label = input<string>('');
  id = input<string>('');
  name = input<string>('');
  readonly = input<boolean>(false);

  valueChange = output<any>();
  blur = output<any>();
  focus = output<any>();
  enter = output<any>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let value: any = target.value;

    if (this.type() === 'number' && value !== '') {
      value = Number(value);
    }

    this.control().setValue(value);
    this.valueChange.emit(value);
  }
}
