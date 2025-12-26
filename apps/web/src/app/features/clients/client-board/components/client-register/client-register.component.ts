import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
  DestroyRef,
  output,
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
  ModalRef,
} from '@forma-ws/frontend-shared';
import { PageFormComponent, ButtonProperties } from '@forma-ws/frontend-shared';
import {
  Gender,
  ActivityLevel,
  FitnessExperience,
} from '@forma-ws/frontend/domain';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientPersonalInfoComponent } from './components/personal-info/personal-info.component';
import { ClientHealthInfoComponent } from './components/health-info/health-info.component';
import { ClientPermissionsInfoComponent } from './components/permissions-info/permissions-info.component';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';
import { ClientFormControls } from './models/client-form.model';
import { ClientsBoardResourceService } from '../../../resources/clients-board.resource.service';

@Component({
  selector: 'app-client-register',
  imports: [
    CommonModule,
    ButtonComponent,
    TranslateModule,
    BreadcrumbsComponent,
    ClientPersonalInfoComponent,
    ClientHealthInfoComponent,
    ClientPermissionsInfoComponent,
  ],
  templateUrl: './client-register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientRegisterComponent
  extends PageFormComponent<FormGroup<ClientFormControls>>
  implements OnInit
{
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);
  private securityService = inject(SecurityService);
  private clientsBoardResourceService = inject(ClientsBoardResourceService);
  private translate = inject(TranslateService);

  readonly ButtonProperties = ButtonProperties;
  readonly totalSteps = 3;

  private gender = Gender;
  private activityLevel = ActivityLevel;
  private fitnessExperience = FitnessExperience;

  modalRef?: ModalRef<boolean>;

  currentStep = signal<number>(1);
  formValidityTrigger = signal<number>(0);
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'REGISTER_CLIENT.PERSONAL_INFORMATION', step: 1 },
    { label: 'REGISTER_CLIENT.HEALTH_INFORMATION', step: 2 },
    { label: 'REGISTER_CLIENT.PERMISSIONS_INFORMATION', step: 3 },
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

  constructor() {
    super();
  }

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
      this.clientsBoardResourceService.register(this.form.getRawValue())
    ).subscribe({
      next: () => {
        this.alertService.show(
          AlertType.SUCCESS,
          this.translate.instant('REGISTER_CLIENT.SUCCESS_MESSAGE')
        );
        this.modalRef?.close(true);
      },
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
          this.form.controls.birthDate.valid
        );
      case 2:
        return (
          this.form.controls.currentWeight.valid &&
          this.form.controls.height.valid &&
          this.form.controls.activityLevel.valid &&
          this.form.controls.medicalConditions.valid &&
          this.form.controls.fitnessExperience.valid
        );
      case 3:
        return (
          this.form.controls.canTrackExercise.valid &&
          this.form.controls.canTrackSleep.valid &&
          this.form.controls.canTrackNutrition.valid &&
          this.form.controls.canTrackWater.valid
        );
      default:
        return false;
    }
  }

  private buildForm() {
    const loggedInCoachId = this.securityService.getCurrentUser()()?.id;

    return FormUtils.createFormGroup(
      this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: [this.gender.MALE, Validators.required],
        birthDate: ['', Validators.required],
        currentWeight: [0, [Validators.required, Validators.min(15)]],
        height: [0, [Validators.required, Validators.min(30)]],
        activityLevel: [this.activityLevel.SEDENTARY, Validators.required],
        medicalConditions: [''],
        fitnessExperience: [
          this.fitnessExperience.BEGINNER,
          Validators.required,
        ],
        coachId: [loggedInCoachId, Validators.required],
        canTrackExercise: [false, Validators.required],
        canTrackSleep: [false, Validators.required],
        canTrackNutrition: [false, Validators.required],
        canTrackWater: [false, Validators.required],
      }) as FormGroup<ClientFormControls>
    );
  }
}
