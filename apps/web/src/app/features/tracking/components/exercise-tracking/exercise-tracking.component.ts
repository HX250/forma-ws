import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseSummary, UserType } from '@forma-ws/domain';
import {
  LanguageSwitcherPipe,
  ModalService,
  ButtonComponent,
  ButtonProperties,
} from '@forma-ws/frontend-shared';
import { SecurityService } from 'apps/web/src/app/core/auth/security.service';
import { AddExerciseRecordComponent } from './components/add-exercise-record.component';
import { ExerciseTrackingResourceService } from './resources/exercise-tracking.resource.service';

@Component({
  selector: 'app-exercise-tracking',
  imports: [
    CommonModule,
    TranslateModule,
    LanguageSwitcherPipe,
    ButtonComponent,
  ],
  templateUrl: './exercise-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExerciseTrackingResourceService],
})
export class ExerciseTrackingComponent {
  private readonly modalService = inject(ModalService);
  private readonly exerciseResourceService = inject(
    ExerciseTrackingResourceService
  );
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly securityService = inject(SecurityService);

  todayDate = input.required<Date>();
  goal = input.required<number>();

  summary = signal<ExerciseSummary>({
    totalExercises: 0,
    totalDuration: 0,
    totalSets: 0,
    totalReps: 0,
    entries: [],
  });

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
    this.exerciseResourceService
      .getExerciseData({
        clientId: this.userId(),
        date: this.todayDate().toISOString(),
      })
      .subscribe((res) => {
        this.summary.set(res);
      });
  }

  removeEntry(entryId: string) {
    const confirmed = confirm(
      'Are you sure you want to remove this exercise entry?'
    );
    if (!confirmed) return;

    this.exerciseResourceService
      .removeExerciseEntry({ clientId: this.userId(), entryId })
      .subscribe(() => this.loadTodayData());
  }

  async openLogExerciseModal(): Promise<void> {
    this.modalService
      .open<boolean>(AddExerciseRecordComponent, {
        title: 'TRACKING.MODALS.LOG_EXERCISE_TITLE',
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
