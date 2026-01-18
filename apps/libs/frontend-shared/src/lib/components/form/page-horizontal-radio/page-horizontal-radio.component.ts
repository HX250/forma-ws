import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RatingOption } from '../../../utils/types/radio-options.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-horizontal-radio',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './page-horizontal-radio.component.html',
})
export class PageHorizontalRadioComponent {
  control = input.required<FormControl<number | number[] | null>>();
  options = input.required<RatingOption[]>();
  label = input<string>('');
  leftLabel = input<string>('');
  rightLabel = input<string>('');

  selectRating(value: number) {
    this.control().setValue(value);
    this.control().markAsTouched();
  }

  isSelected(value: number): boolean {
    return this.control().value === value;
  }

  isRequired(): boolean {
    return this.control().hasValidator(Validators.required);
  }
}
