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
import { RegisterClientService } from '../../services/register-client.service';
import { ActivityLevel, FitnessExperience } from '@forma-ws/frontend/domain';

@Component({
  selector: 'app-client-health-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageInputComponent,
    PageNumberComponent,
    PageSelect,
    TranslateModule,
  ],
  templateUrl: './health-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientHealthInfoComponent {
  currentWeight = input.required<FormControl<number>>();
  height = input.required<FormControl<number>>();
  activityLevel = input.required<FormControl<ActivityLevel>>();
  medicalConditions = input.required<FormControl<string>>();
  fitnessExperience = input.required<FormControl<FitnessExperience>>();

  private registerClientService = inject(RegisterClientService);

  fitnessExperienceOptions =
    this.registerClientService.getFitnessExperienceFields();
  activityLevelOptions = this.registerClientService.getActivityLevelFields();
}
