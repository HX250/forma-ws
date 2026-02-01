import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SleepEntryData, UserType } from '@forma-ws/domain';
import { AddSleepRecordComponent } from './components/add-sleep-record/add-sleep-record.component';
import {
  ModalService,
  ButtonComponent,
  ButtonProperties,
} from '@forma-ws/frontend-shared';
import { SleepTrackingResourceService } from './resource/sleep-tracking.resource.service';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';

@Component({
  selector: 'app-sleep-tracking',
  imports: [CommonModule, TranslateModule, ButtonComponent],
  templateUrl: './sleep-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SleepTrackingResourceService],
})
export class SleepTrackingComponent {
  private readonly modalService = inject(ModalService);
  private readonly sleepResourceService = inject(SleepTrackingResourceService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly securityService = inject(SecurityService);

  todayDate = input.required<Date>();
  goal = input.required<number>();

  todayEntry = signal<SleepEntryData | null>(null);
  userId = signal<string>(this.activatedRoute.snapshot.paramMap.get('id')!);

  currentUserType = this.securityService.userType();

  UserType = UserType;
  ButtonProperties = ButtonProperties;

  private readonly todayEffect = effect(() => {
    const date = this.todayDate();
    const userId = this.userId();

    if (!date || !userId) return;

    this.loadTodayData();
  });

  loadTodayData() {
    const date = this.todayDate();

    this.sleepResourceService
      .getSleepEntry({
        clientId: this.userId(),
        createdAt: date.toISOString(),
      })
      .subscribe((res) => {
        this.todayEntry.set(res);
      });
  }

  removeTodaySleepRecord() {
    if (!this.todayEntry()) return;

    const confirmed = confirm(
      'Are you sure you want to remove today’s sleep record?'
    );
    if (!confirmed) return;

    this.sleepResourceService
      .removeSleepEntry({ clientId: this.userId(), id: this.todayEntry()!.id })
      .subscribe(() => {
        this.loadTodayData();
      });
  }

  async openAddSleepRecordModal(): Promise<void> {
    this.modalService
      .open<boolean>(AddSleepRecordComponent, {
        title: 'TRACKING.MODALS.LOG_SLEEP_TITLE',
        size: 'lg',
        showFooterButtons: false,
        showCloseButton: true,
        data: {
          today: this.todayDate,
          clientId: this.userId,
        },
      })
      .subscribe((result) => {
        if (result) {
          this.loadTodayData();
        }
      });
  }
  formatTime(dateString: Date): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
