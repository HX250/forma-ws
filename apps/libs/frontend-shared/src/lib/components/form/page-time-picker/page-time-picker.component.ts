import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-time-picker',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './page-time-picker.component.html',
})
export class PageTimePickerComponent {
  control = input.required<FormControl<string>>();
  label = input<string>('');
  placeholder = input<string>('Select time');

  isRequired(): boolean {
    return this.control().hasValidator(Validators.required);
  }
}
