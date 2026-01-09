import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionSummary, UserType } from '@forma-ws/domain';
import { ModalService, LanguageSwitcherPipe } from '@forma-ws/frontend-shared';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';
import { FoodTrackingResourceService } from './resource/food-tracking.resource.service';
import { AddFoodRecordComponent } from './components/add-food-record.component';

@Component({
  selector: 'app-food-tracking',
  imports: [CommonModule, LanguageSwitcherPipe],
  templateUrl: './food-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FoodTrackingResourceService],
})
export class FoodTrackingComponent {
  private readonly modalService = inject(ModalService);
  private readonly foodResourceService = inject(FoodTrackingResourceService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly securityService = inject(SecurityService);

  todayDate = input.required<Date>();

  summary = signal<NutritionSummary>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalSugar: 0,
    totalFiber: 0,
    mealCount: 0,
    entries: [],
  });

  userId = signal<string>(this.activatedRoute.snapshot.paramMap.get('id')!);
  currentUserType = this.securityService.userType();
  UserType = UserType;

  private readonly todayEffect = effect(() => {
    const date = this.todayDate();
    const userId = this.userId();
    if (!date || !userId) return;
    this.loadTodayData();
  });

  loadTodayData() {
    const date = this.todayDate();
    this.foodResourceService
      .getNutritionEntries({
        clientId: this.userId(),
        date: date.toISOString(),
      })
      .subscribe((res) => {
        this.summary.set(res);
      });
  }

  removeEntry(entryId: string) {
    const confirmed = confirm(
      'Are you sure you want to remove this meal entry?'
    );

    if (!confirmed) return;

    this.foodResourceService
      .removeNutritionEntry({ clientId: this.userId(), id: entryId })
      .subscribe(() => {
        this.loadTodayData();
      });
  }

  async openLogMealModal(): Promise<void> {
    this.modalService
      .open<boolean>(AddFoodRecordComponent, {
        title: '🍽️ Log Meal',
        size: 'lg',
        showFooterButtons: false,
        showCloseButton: true,
        data: {
          clientId: this.userId,
        },
      })
      .subscribe((result) => {
        if (result) {
          this.loadTodayData();
        }
      });
  }
}
