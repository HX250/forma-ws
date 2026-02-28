import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { switchMap } from 'rxjs';
import {
  ButtonComponent,
  ButtonProperties,
  FormaFormContainer,
  FormUtils,
  AlertService,
  AlertType,
} from '@forma-ws/frontend-shared';
import { AuthResourceService } from '../../auth/resources/auth.resource.service';
import { CoachSettingsResourceService } from '../resources/coach-settings.resource.service';
import {
  AvailabilityModel,
  CommunicationMethod,
  Gender,
  SpecializationField,
} from '@forma-ws/frontend/domain';
import { UserType } from '@forma-ws/domain';
import { SecurityService } from '../../../core/auth/security.service';
import { CoachSettingsModel } from './models/coach-settings.model';
import { CoachPersonalSettingsComponent } from './components/personal-settings/personal-settings.component';
import { CoachProfessionalSettingsComponent } from './components/professional-settings/professional-settings.component';
import { CoachAvailabilitySettingsComponent } from './components/availability-settings/availability-settings.component';

@Component({
  selector: 'app-coach-settings',
  standalone: true,
  imports: [
    TranslateModule,
    ButtonComponent,
    CoachPersonalSettingsComponent,
    CoachProfessionalSettingsComponent,
    CoachAvailabilitySettingsComponent,
  ],
  templateUrl: './coach-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoachSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly securityService = inject(SecurityService);
  private readonly alertService = inject(AlertService);
  private readonly authResourceService = inject(AuthResourceService);
  private readonly coachSettingsResourceService = inject(
    CoachSettingsResourceService
  );
  private readonly router = inject(Router);

  readonly ButtonProperties = ButtonProperties;
  readonly isReadOnly = computed(
    () => this.securityService.userType() === UserType.CLIENT
  );

  confirmDelete = signal(false);
  activeTab = signal<'personal' | 'professional' | 'availability'>('personal');

  personalForm!: FormaFormContainer<
    FormGroup<CoachSettingsModel.Form.Personal>
  >;
  professionalForm!: FormaFormContainer<
    FormGroup<CoachSettingsModel.Form.Professional>
  >;
  availabilityForm!: FormaFormContainer<
    FormGroup<CoachSettingsModel.Form.Availability>
  >;

  ngOnInit(): void {
    this.personalForm = FormUtils.createFormGroup(
      this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: [Gender.MALE, Validators.required],
      }) as FormGroup<CoachSettingsModel.Form.Personal>
    );

    this.professionalForm = FormUtils.createFormGroup(
      this.fb.group({
        yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
        specializationFields: [
          [SpecializationField.BODYBUILDING],
          Validators.required,
        ],
        bio: [''],
        pricing: [0, [Validators.required, Validators.min(0)]],
      }) as FormGroup<CoachSettingsModel.Form.Professional>
    );

    this.availabilityForm = FormUtils.createFormGroup(
      this.fb.group({
        availability: [[] as AvailabilityModel[]],
        communicationMethods: [
          [CommunicationMethod.EMAIL],
          Validators.required,
        ],
      }) as FormGroup<CoachSettingsModel.Form.Availability>
    );
  }

  setActiveTab(tab: 'personal' | 'professional' | 'availability'): void {
    this.activeTab.set(tab);
  }

  onDeleteAccount(): void {
    this.coachSettingsResourceService
      .deleteAccount()
      .pipe(switchMap(() => this.authResourceService.logout()))
      .subscribe({
        next: () => {
          this.securityService.clear();
          this.router.navigate(['/']);
        },
        error: () => {
          this.confirmDelete.set(false);
          this.alertService.show(
            AlertType.ERROR,
            'SETTINGS.COACH_PROFILE.DELETE_ACCOUNT.ALERTS.ERROR'
          );
        },
      });
  }
}
