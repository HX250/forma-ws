import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { ClientActionsComponent } from './components/client-actions/client-actions.component';
import { FitnessInfoComponent } from './components/fintess-info/fitness-info.component';
import { TrackingComponent } from '../../tracking/tracking.component';
import { FormControl, FormsModule } from '@angular/forms';
import { UserType } from '@forma-ws/domain';
import { WeightTrackingComponent } from '../../tracking/components/weight-tracking/weight-tracking.component';
import { TrackingService } from '../../tracking/services/tracking.service';
import { EditClientGoalComponent } from './components/client-goals/edit-client-goals.component';
import {
  AlertService,
  AlertType,
  DateValidations,
  ModalService,
  PageDateComponent,
  ButtonComponent,
  ButtonProperties,
} from '@forma-ws/frontend-shared';
import { SecurityService } from '../../../core/auth/security.service';

@Component({
  selector: 'app-clients-profile',
  imports: [
    CommonModule,
    TranslateModule,
    GeneralInfoComponent,
    FitnessInfoComponent,
    PageDateComponent,
    TrackingComponent,
    FormsModule,
    WeightTrackingComponent,
    ButtonComponent,
    ClientActionsComponent,
  ],
  templateUrl: './clients-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsProfileComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly trackingService = inject(TrackingService);
  private readonly modalService = inject(ModalService);
  private readonly securityService = inject(SecurityService);

  clientId = signal<string>('');
  memberSince = signal<Date>(new Date());
  today = signal<Date>(new Date());

  selectedDate: FormControl<Date> = new FormControl<Date>(this.today(), {
    nonNullable: true,
  });

  dateValidations: DateValidations = {
    min: this.memberSince().toISOString(),
    max: this.today().toISOString(),
  };

  user = this.securityService.userType();
  UserType = UserType;
  AlertType = AlertType;
  ButtonProperties = ButtonProperties;

  clientGoals = computed(() => this.trackingService.clientTrackingGoals());
  clientGoalsVerification = computed(() => {
    return (
      this.clientGoals().generalGoals.goalType &&
      this.clientGoals().generalGoals.weightGoal
    );
  });

  ngOnInit(): void {
    this.clientId.set(this.getClientId());
    this.trackingService.loadClientGoals(this.clientId());
  }

  onDateChange(value: Date | null) {
    if (!value) {
      return;
    }

    this.selectedDate.patchValue(value);
  }

  previousDay() {
    const currentDate = new Date(this.selectedDate.value);
    const previousDate = new Date(currentDate);

    previousDate.setDate(previousDate.getDate() - 1);

    const minDate = new Date(this.memberSince() || '');

    if (minDate && previousDate < minDate) {
      this.alertService.show(
        AlertType.WARNING,
        'CLIENT_PROFILE.ALERTS.CANNOT_GO_PAST_CREATION'
      );
      return;
    }

    this.selectedDate.patchValue(previousDate);
  }

  nextDay() {
    const currentDate = new Date(this.selectedDate.value);
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const maxDate = new Date();
    if (nextDate > maxDate) {
      this.alertService.show(
        AlertType.WARNING,
        'CLIENT_PROFILE.ALERTS.CANNOT_GO_TO_FUTURE'
      );
      return;
    }

    this.selectedDate.patchValue(nextDate);
  }

  goToToday() {
    this.selectedDate.patchValue(new Date());
  }

  openEditClientGoals() {
    this.modalService
      .open<boolean>(EditClientGoalComponent, {
        title: 'CLIENT_PROFILE.MODALS.EDIT_GOALS_TITLE',
        size: 'lg',
        showFooterButtons: false,
        showCloseButton: true,
        data: {
          clientId: this.clientId(),
          currentGoal: this.clientGoals(),
        },
      })
      .subscribe((result) => {
        if (result) {
          this.trackingService.loadClientGoals(this.clientId());
        }
      });
  }

  redirectToClientList() {
    this.router.navigateByUrl('/clients');
  }

  private getClientId(): string {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.redirectToClientList();
      return '';
    }
    return id;
  }
}
