import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  PageSelect,
} from '@forma-ws/frontend-shared';
import { CoachAvailabilityProfile } from '@forma-ws/domain';
import { CoachSettingsResourceService } from '../../../resources/coach-settings.resource.service';
import { RegisterCoachService } from '../../../../auth/components/register-coach/services/register-coach.service';
import { AvailabilitySelectorComponent } from '../../../../auth/components/register-coach/components/availability-communication/components/availability-selector/availability-selector.component';
import { CoachSettingsModel } from '../../models/coach-settings.model';

@Component({
  selector: 'app-coach-availability-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    EnumLabelPipe,
    LoadingComponent,
    PageSelect,
    AvailabilitySelectorComponent,
  ],
  templateUrl: './availability-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoachAvailabilitySettingsComponent
  extends PageFormComponent<FormGroup<CoachSettingsModel.Form.Availability>>
  implements OnInit
{
  readonly availabilityGroup =
    input.required<
      FormaFormContainer<FormGroup<CoachSettingsModel.Form.Availability>>
    >();
  readonly isReadOnly = input<boolean>(false);

  private readonly resource = inject(CoachSettingsResourceService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly registerCoachService = inject(RegisterCoachService);

  readonly ButtonProperties = ButtonProperties;

  isDataLoading = signal(true);
  isEditMode = signal(false);
  coachAvailability = signal<CoachAvailabilityProfile | null>(null);

  enabledAvailabilityDays = computed(() => {
    const av = this.coachAvailability()?.availability;
    return av?.filter((d) => d.enabled) ?? [];
  });

  communicationOptions =
    this.registerCoachService.getCommunicationMethodFields();

  ngOnInit(): void {
    this.form = this.availabilityGroup();
    this.loadData();
  }

  private loadData(): void {
    LoaderUtils.sendRequest(
      this.resource.getAvailabilityProfile(),
      this.isDataLoading
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: CoachAvailabilityProfile) => {
        this.coachAvailability.set(data);
        this.form.patchValue({
          availability: data.availability ?? [],
          communicationMethods: data.communicationMethods,
        });
      });
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    const data = this.coachAvailability();
    if (data) {
      this.form.patchValue({
        availability: data.availability ?? [],
        communicationMethods: data.communicationMethods,
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
      this.resource.updateAvailabilityProfile(this.form.getRawValue())
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.coachAvailability.set(updated);
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
