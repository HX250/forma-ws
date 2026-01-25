import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  PageDateComponent,
  PageInputComponent,
  PageSelect,
} from '@forma-ws/frontend-shared';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterClientService } from '../../services/register-client.service';
import { Gender } from '@forma-ws/frontend/domain';

@Component({
  selector: 'app-client-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageInputComponent,
    PageSelect,
    PageDateComponent,
    TranslateModule,
  ],
  templateUrl: './personal-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPersonalInfoComponent {
  firstName = input.required<FormControl<string>>();
  lastName = input.required<FormControl<string>>();
  gender = input.required<FormControl<Gender>>();
  email = input.required<FormControl<string>>();
  birthDate = input.required<FormControl<Date>>();

  private registerClientService = inject(RegisterClientService);

  genderOptions = this.registerClientService.getGenderFields();

  today = new Date();
  minBirthDate = new Date(
    this.today.getFullYear() - 99,
    this.today.getMonth(),
    this.today.getDate()
  );

  dateValidations = {
    min: this.formatDate(this.minBirthDate),
    max: this.formatDate(this.today),
  };

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
