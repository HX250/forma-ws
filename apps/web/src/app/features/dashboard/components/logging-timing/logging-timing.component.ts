import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import {
  DashboardCommon,
  DashboardCommonComponent,
} from '@forma-ws/frontend-shared';
import { Observable } from 'rxjs';
import { LoggingTimingResourceService } from './resources/logging-timing.resource.service';
import { LoggingTimingResponse } from '@forma-ws/domain';

@Component({
  selector: 'app-logging-timing',
  imports: [CommonModule, TranslateModule, DashboardCommonComponent],
  templateUrl: './logging-timing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoggingTimingResourceService],
})
export class LoggingTimingComponent extends DashboardCommon<LoggingTimingResponse> {
  private loggingTimingResourceService = inject(LoggingTimingResourceService);

  timingData = computed(
    () =>
      this.dashBoardData() ?? {
        morningTiming: 0,
        lunchTiming: 0,
        afternoonTiming: 0,
        nightTiming: 0,
      }
  );

  getLoggingTiming(timing: number): number {
    return timing ?? 0;
  }

  override getData(): Observable<LoggingTimingResponse> {
    return this.loggingTimingResourceService.getLoggingTiming();
  }
}
