import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-client-permissions-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './permissions-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientPermissionsInfoComponent {
  canTrackExercise = input.required<FormControl<boolean>>();
  canTrackSleep = input.required<FormControl<boolean>>();
  canTrackNutrition = input.required<FormControl<boolean>>();
  canTrackWater = input.required<FormControl<boolean>>();
}
