import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-input',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  standalone: true,
  templateUrl: './page-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageInput {
  control = input.required<FormControl<any>>();
  required = input<boolean>(false);
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
    this.valueChange.emit(target.value);
  }
}
