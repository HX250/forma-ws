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
import { RegisterCoachService } from '../../services/register-coach.service';
import { AuthModel } from '../../../../models/auth.model';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageInput, PageSelect, TranslateModule],
  templateUrl: './personal-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfoComponent {
  firstName = input.required<FormControl<string>>();
  lastName = input.required<FormControl<string>>();
  gender = input.required<FormControl<AuthModel.Form.registerCoach['gender']['value']>>();
  email = input.required<FormControl<string>>();
  password = input.required<FormControl<string>>();

  private registerCoachService = inject(RegisterCoachService);
  
  genderOptions = this.registerCoachService.getGenderFields();
}

