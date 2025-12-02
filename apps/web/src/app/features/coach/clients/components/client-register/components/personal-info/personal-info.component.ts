import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PageInput, PageSelect } from '@forma-ws/frontend-shared';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterClientService } from '../../services/register-client.service';
import { Gender } from '@forma-ws/frontend/domain';

@Component({
  selector: 'app-client-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageInput, PageSelect, TranslateModule],
  templateUrl: './personal-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPersonalInfoComponent {
  firstName = input.required<FormControl<string>>();
  lastName = input.required<FormControl<string>>();
  gender = input.required<FormControl<Gender>>();
  email = input.required<FormControl<string>>();
  birthDate = input.required<FormControl<string>>();

  private registerClientService = inject(RegisterClientService);
  
  genderOptions = this.registerClientService.getGenderFields();
}
