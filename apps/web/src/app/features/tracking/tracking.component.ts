import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaterTrackingComponent } from './components/water-tracking/water-tracking.component';
import { SleepTrackingComponent } from './components/sleep-tracking/sleep-tracking.component';
import { FoodTrackingComponent } from './components/food-tracking/food-tracking.component';
import { ExerciseTrackingComponent } from './components/exercise-tracking/exercise-tracking.component';
import { ClientPermissions, PermissionsEnum, UserType } from '@forma-ws/domain';
import { LoadingComponent } from '@forma-ws/frontend-shared';
import { TrackingService } from './services/tracking.service';
import { TrackingCardWrapperComponent } from './shared/tracking-card-wrapper/tracking-card-wrapper.component';
import { SecurityService } from '../../core/auth/security.service';

@Component({
  selector: 'app-tracking',
  imports: [
    CommonModule,
    ExerciseTrackingComponent,
    WaterTrackingComponent,
    SleepTrackingComponent,
    FoodTrackingComponent,
    LoadingComponent,
    TrackingCardWrapperComponent,
  ],
  templateUrl: './tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingComponent {
  private readonly trackingService = inject(TrackingService);
  private readonly securityService = inject(SecurityService);

  clientId = input.required<string>();

  currentUser = signal<UserType>(this.securityService.userType()!);
  loading = computed(() => this.trackingService.loading());

  permissions = PermissionsEnum;
  UserType = UserType;

  clientPermissions = computed(
    () =>
      this.trackingService.clientsTrackingPermissions() ??
      ({} as ClientPermissions)
  );

  trackingCards = computed(() =>
    [
      {
        permission: this.clientPermissions().canTrackExercise,
        permissionType: this.permissions.CAN_TRACK_EXERCISE,
        title: 'Exercise',
        component: 'exercise',
      },
      {
        permission: this.clientPermissions().canTrackSleep,
        permissionType: this.permissions.CAN_TRACK_SLEEP,
        title: 'Sleep',
        component: 'sleep',
      },
      {
        permission: this.clientPermissions().canTrackNutrition,
        permissionType: this.permissions.CAN_TRACK_NUTRITION,
        title: 'Nutrition',
        component: 'nutrition',
      },
      {
        permission: this.clientPermissions().canTrackWater,
        permissionType: this.permissions.CAN_TRACK_WATER,
        title: 'Water',
        component: 'water',
      },
    ].filter((card) => card.permission || this.currentUser() === UserType.COACH)
  );

  private clientIdEffect = effect(() => {
    const id = this.clientId();
    this.trackingService.loadPermissions(id);
  });
}
