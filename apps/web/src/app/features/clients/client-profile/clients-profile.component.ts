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
import { FitnessInfoComponent } from './components/fintess-info/fitness-info.component';
import { TrackingComponent } from '../../tracking/tracking.component';
import { FormsModule } from '@angular/forms';
import { UserType } from '@forma-ws/domain';
import { WeightTrackingComponent } from '../../tracking/components/weight-tracking/weight-tracking.component';
import { TrackingService } from '../../tracking/services/tracking.service';
import { EditClientGoalComponent } from './components/client-goals/edit-client-goals.component';
import { ModalService } from '@forma-ws/frontend-shared';

@Component({
  selector: 'app-clients-profile',
  imports: [
    CommonModule,
    TranslateModule,
    GeneralInfoComponent,
    FitnessInfoComponent,
    TrackingComponent,
    FormsModule,
    WeightTrackingComponent,
  ],
  templateUrl: './clients-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsProfileComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly trackingService = inject(TrackingService);
  private readonly modalService = inject(ModalService);

  clientId = signal<string>('');
  selectedDate = signal<Date>(new Date());
  memberSince = signal<Date | null>(null);
  today = signal<Date>(new Date());
  UserType = UserType;

  clientGoals = computed(() => this.trackingService.clientTrackingGoals());

  ngOnInit(): void {
    this.clientId.set(this.getClientId());
    this.trackingService.loadClientGoals(this.clientId());
  }

  onDateChange(value: string) {
    this.selectedDate.set(new Date(value));
  }

  previousDay() {
    const currentDate = this.selectedDate();
    const previousDate = new Date(currentDate);

    previousDate.setDate(previousDate.getDate() - 1);

    const minDate = new Date(this.memberSince() || '');

    if (minDate && previousDate < minDate) {
      return;
    }

    this.selectedDate.set(previousDate);
  }

  nextDay() {
    const currentDate = this.selectedDate();
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const maxDate = this.today();
    if (nextDate > maxDate) {
      return;
    }

    this.selectedDate.set(nextDate);
  }

  goToToday() {
    this.selectedDate.set(new Date());
  }

  openEditClientGoals() {
    this.modalService
      .open<boolean>(EditClientGoalComponent, {
        title: '🍽️ Log Meal',
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
