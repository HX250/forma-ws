import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertService,
  AlertType,
  ButtonComponent,
  ButtonProperties,
  EnumLabelPipe,
  FormaFormContainer,
  LoaderUtils,
  LoadingComponent,
  PageFormComponent,
  PageInputComponent,
  PageSelect,
} from '@forma-ws/frontend-shared';
import { CoachPersonalProfile } from '@forma-ws/domain';
import { CoachSettingsResourceService } from '../../../resources/coach-settings.resource.service';
import { RegisterCoachService } from '../../../../auth/components/register-coach/services/register-coach.service';
import { CoachSettingsModel } from '../../models/coach-settings.model';

@Component({
  selector: 'app-coach-personal-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    EnumLabelPipe,
    LoadingComponent,
    PageInputComponent,
    PageSelect,
  ],
  templateUrl: './personal-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoachPersonalSettingsComponent
  extends PageFormComponent<FormGroup<CoachSettingsModel.Form.Personal>>
  implements OnInit
{
  readonly personalGroup =
    input.required<
      FormaFormContainer<FormGroup<CoachSettingsModel.Form.Personal>>
    >();
  readonly isReadOnly = input<boolean>(false);

  private readonly resource = inject(CoachSettingsResourceService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly registerCoachService = inject(RegisterCoachService);

  readonly ButtonProperties = ButtonProperties;

  isDataLoading = signal(true);
  isEditMode = signal(false);
  coachPersonal = signal<CoachPersonalProfile | null>(null);

  genderOptions = this.registerCoachService.getGenderFields();

  ngOnInit(): void {
    this.form = this.personalGroup();
    this.loadData();
  }

  private loadData(): void {
    LoaderUtils.sendRequest(
      this.resource.getPersonalProfile(),
      this.isDataLoading
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: CoachPersonalProfile) => {
        this.coachPersonal.set(data);
        this.form.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
        });
      });
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    const data = this.coachPersonal();
    if (data) {
      this.form.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
      });
    }
    this.isEditMode.set(false);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sendFormRequest(
      this.resource.updatePersonalProfile(this.form.getRawValue())
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.coachPersonal.set(updated);
          this.isEditMode.set(false);
          this.alertService.show(
            AlertType.SUCCESS,
            'SETTINGS.COACH_PROFILE.ALERTS.SUCCESS'
          );
        },
        error: () => {
          this.alertService.show(
            AlertType.ERROR,
            'SETTINGS.COACH_PROFILE.ALERTS.ERROR'
          );
        },
      });
  }
}
