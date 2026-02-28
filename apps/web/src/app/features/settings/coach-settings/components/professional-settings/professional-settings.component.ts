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
  PageNumberComponent,
  PageSelect,
} from '@forma-ws/frontend-shared';
import { CoachProfessionalProfile } from '@forma-ws/domain';
import { CoachSettingsResourceService } from '../../../resources/coach-settings.resource.service';
import { RegisterCoachService } from '../../../../auth/components/register-coach/services/register-coach.service';
import { CoachSettingsModel } from '../../models/coach-settings.model';

@Component({
  selector: 'app-coach-professional-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    EnumLabelPipe,
    LoadingComponent,
    PageInputComponent,
    PageNumberComponent,
    PageSelect,
  ],
  templateUrl: './professional-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoachProfessionalSettingsComponent
  extends PageFormComponent<FormGroup<CoachSettingsModel.Form.Professional>>
  implements OnInit
{
  readonly professionalGroup =
    input.required<
      FormaFormContainer<FormGroup<CoachSettingsModel.Form.Professional>>
    >();
  readonly isReadOnly = input<boolean>(false);

  private readonly resource = inject(CoachSettingsResourceService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly registerCoachService = inject(RegisterCoachService);

  readonly ButtonProperties = ButtonProperties;

  isDataLoading = signal(true);
  isEditMode = signal(false);
  coachProfessional = signal<CoachProfessionalProfile | null>(null);

  specializationOptions = this.registerCoachService.getSpecializationFields();

  ngOnInit(): void {
    this.form = this.professionalGroup();
    this.loadData();
  }

  private loadData(): void {
    LoaderUtils.sendRequest(
      this.resource.getProfessionalProfile(),
      this.isDataLoading
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: CoachProfessionalProfile) => {
        this.coachProfessional.set(data);
        this.form.patchValue({
          yearsOfExperience: data.yearsOfExperience,
          specializationFields: data.specializationFields,
          bio: data.bio ?? '',
          pricing: data.pricing ?? 0,
        });
      });
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    const data = this.coachProfessional();
    if (data) {
      this.form.patchValue({
        yearsOfExperience: data.yearsOfExperience,
        specializationFields: data.specializationFields,
        bio: data.bio ?? '',
        pricing: data.pricing ?? 0,
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
      this.resource.updateProfessionalProfile(this.form.getRawValue())
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.coachProfessional.set(updated);
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
