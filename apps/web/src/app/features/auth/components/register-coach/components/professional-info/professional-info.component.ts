import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  PageInputComponent,
  PageNumberComponent,
  PageSelect,
} from '@forma-ws/frontend-shared';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterCoachService } from '../../services/register-coach.service';
import { AuthModel } from '../../../../models/auth.model';

@Component({
  selector: 'app-professional-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageInputComponent,
    PageNumberComponent,
    PageSelect,
    TranslateModule,
  ],
  templateUrl: './professional-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalInfoComponent {
  yearsOfExperience = input.required<FormControl<number>>();
  specializationFields =
    input.required<
      FormControl<AuthModel.Form.registerCoach['specializationFields']['value']>
    >();
  bio = input.required<FormControl<string>>();
  pricing = input.required<FormControl<number>>();

  private registerCoachService = inject(RegisterCoachService);

  specializationOptions = this.registerCoachService.getSpecializationFields();
}
