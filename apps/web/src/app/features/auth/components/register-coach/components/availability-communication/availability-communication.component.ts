import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PageSelect } from '@forma-ws/frontend-shared';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterCoachService } from '../../services/register-coach.service';
import { AuthModel } from '../../../../models/auth.model';
import { AvailabilitySelectorComponent } from './components/availability-selector/availability-selector.component';
import { AvailabilityModel } from '@forma-ws/frontend/domain';

@Component({
  selector: 'app-availability-communication',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageSelect,
    TranslateModule,
    AvailabilitySelectorComponent,
  ],
  templateUrl: './availability-communication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilityCommunicationComponent {
  private registerCoachService = inject(RegisterCoachService);

  availability = input.required<FormControl<AvailabilityModel[]>>();
  communicationMethods =
    input.required<
      FormControl<AuthModel.Form.registerCoach['communicationMethods']['value']>
    >();

  communicationOptions =
    this.registerCoachService.getCommunicationMethodFields();
}
