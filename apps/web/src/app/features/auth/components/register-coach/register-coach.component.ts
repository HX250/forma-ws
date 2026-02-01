import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AlertService,
  AlertType,
  BreadcrumbItem,
  BreadcrumbsComponent,
  ButtonComponent,
  FormUtils,
} from '@forma-ws/frontend-shared';
import { PageFormComponent, ButtonProperties } from '@forma-ws/frontend-shared';
import {
  AvailabilityModel,
  CommunicationMethod,
  Gender,
  SpecializationField,
} from '@forma-ws/frontend/domain';
import { AuthModel } from '../../models/auth.model';
import { AuthResourceService } from '../../resources/auth.resource.service';
import { TranslateModule } from '@ngx-translate/core';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { ProfessionalInfoComponent } from './components/professional-info/professional-info.component';
import { AvailabilityCommunicationComponent } from './components/availability-communication/availability-communication.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-coach',
  imports: [
    CommonModule,
    ButtonComponent,
    TranslateModule,
    BreadcrumbsComponent,
    PersonalInfoComponent,
    ProfessionalInfoComponent,
    AvailabilityCommunicationComponent,
  ],
  templateUrl: './register-coach.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCoachComponent
  extends PageFormComponent<FormGroup<AuthModel.Form.registerCoach>>
  implements OnInit
{
  private gender = Gender;
  private specializationFields = SpecializationField;
  private communicationMethod = CommunicationMethod;

  readonly ButtonProperties = ButtonProperties;
  readonly totalSteps = 3;

  currentStep = signal<number>(1);
  formValidityTrigger = signal<number>(0);

  private fb = inject(FormBuilder);
  private authResourceService = inject(AuthResourceService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'AUTH.REGISTER_COACH.PERSONAL_INFORMATION', step: 1 },
    { label: 'AUTH.REGISTER_COACH.PROFESSIONAL_INFORMATION', step: 2 },
    { label: 'AUTH.REGISTER_COACH.AVAILABILITY_COMMUNICATION', step: 3 },
  ]);

  stepValidity = computed<Record<number, boolean>>(() => {
    this.formValidityTrigger();
    const validity: Record<number, boolean> = {};
    for (let step = 1; step <= this.totalSteps; step++) {
      validity[step] = this.isStepValid(step);
    }
    return validity;
  });

  canGoNext = computed(() => {
    this.formValidityTrigger();
    const step = this.currentStep();
    return this.isStepValid(step) && step < this.totalSteps;
  });

  canGoPrevious = computed(() => {
    return this.currentStep() > 1;
  });

  isLastStep = computed(() => {
    return this.currentStep() === this.totalSteps;
  });

  ngOnInit(): void {
    this.form = this.buildForm();
    this.setupFormValidationTracking();
  }

  private setupFormValidationTracking(): void {
    if (this.form) {
      this.form.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.formValidityTrigger.update((v) => v + 1);
        });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sendFormRequest(
      this.authResourceService.register(this.form.getRawValue())
    ).subscribe(() => {
      this.alertService.show(AlertType.SUCCESS, 'AUTH.ALERTS.COACH_CREATED');
      this.router.navigateByUrl('/');
    });
  }

  onStepClick(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      if (step <= this.currentStep()) {
        this.currentStep.set(step);
      } else {
        if (this.isStepValid(this.currentStep())) {
          this.currentStep.set(step);
        }
      }
    }
  }

  nextStep(): void {
    if (this.canGoNext()) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  previousStep(): void {
    if (this.canGoPrevious()) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  isStepValid(step: number): boolean {
    if (!this.form) {
      return false;
    }

    switch (step) {
      case 1:
        return (
          this.form.controls.firstName.valid &&
          this.form.controls.lastName.valid &&
          this.form.controls.gender.valid &&
          this.form.controls.email.valid &&
          this.form.controls.password.valid
        );
      case 2:
        return (
          this.form.controls.yearsOfExperience.valid &&
          this.form.controls.specializationFields.valid &&
          this.form.controls.bio.valid &&
          this.form.controls.pricing.valid
        );
      case 3:
        return (
          this.form.controls.availability.valid &&
          this.form.controls.communicationMethods.valid
        );
      default:
        return false;
    }
  }

  private buildForm() {
    return FormUtils.createFormGroup(
      this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: [this.gender.MALE, Validators.required],
        yearsOfExperience: [0, Validators.required],
        specializationFields: [
          [this.specializationFields.BODYBUILDING],
          Validators.required,
        ],
        bio: [''],
        pricing: [0, Validators.required],
        availability: [[] as AvailabilityModel[], [Validators.required]],
        communicationMethods: [
          [this.communicationMethod.EMAIL],
          Validators.required,
        ],
      }) as FormGroup<AuthModel.Form.registerCoach>
    );
  }
}
