import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonComponent,
  ButtonProperties,
  PageNumberComponent,
} from '@forma-ws/frontend-shared';
import { WaterTrackingResourceService } from './resource/water-tracking.resource.service';
import { UserType, WaterData } from '@forma-ws/domain';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-water-tracking',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonComponent,
    PageNumberComponent,
  ],
  templateUrl: './water-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WaterTrackingResourceService],
})
export class WaterTrackingComponent {
  private readonly waterResourceService = inject(WaterTrackingResourceService);
  private readonly securityService = inject(SecurityService);
  private readonly activatedRoute = inject(ActivatedRoute);

  todayDate = input.required<Date>();
  goal = input.required<number>();

  waterEntries = signal<WaterData[]>([]);
  totalWater = signal<number>(0);
  userId = signal<string>(this.activatedRoute.snapshot.paramMap.get('id')!);
  currentUserType = this.securityService.userType();
  customAmountControl = new FormControl<number | null>(null);
  showCustomInput = signal<boolean>(false);

  UserType = UserType;
  ButtonProperties = ButtonProperties;

  private readonly todayEffect = effect(() => {
    const date = this.todayDate();
    const userId = this.userId();

    if (!date || !userId) return;

    this.loadTodayData();
  });

  loadTodayData() {
    this.waterResourceService
      .getWaterData({
        clientId: this.userId(),
        createdAt: this.todayDate().toISOString(),
      })
      .subscribe((data) => {
        this.waterEntries.set(data);
        this.calculateTotal(data);
      });
  }

  calculateTotal(data: WaterData[]) {
    const total = data.reduce((sum, entry) => sum + Number(entry.amount), 0);
    this.totalWater.set(total / 1000);
  }

  addWater(amountInLiters: number) {
    const amountInMl = amountInLiters * 1000;

    this.waterResourceService
      .logWaterData({
        clientId: this.userId(),
        amount: amountInMl,
      })
      .subscribe(() => {
        this.loadTodayData();
      });
  }

  removeWaterEntry(entryId: string) {
    this.waterResourceService
      .removeWaterEntry({
        clientId: this.userId(),
        id: entryId,
      })
      .subscribe(() => {
        this.loadTodayData();
      });
  }

  getProgressPercentage(): number {
    return Math.min((this.totalWater() / this.goal()) * 100, 100);
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  toggleCustomInput(): void {
    this.showCustomInput.set(!this.showCustomInput());
    if (!this.showCustomInput()) {
      this.customAmountControl.setValue(null);
    }
  }

  addCustomWater(): void {
    const amount = this.customAmountControl.value;
    if (amount && amount > 0) {
      this.addWater(amount);
      this.customAmountControl.setValue(null);
      this.showCustomInput.set(false);
    }
  }
}
