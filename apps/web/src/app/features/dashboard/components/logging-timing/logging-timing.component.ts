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
  LineChartComponent,
  LineChartConfig,
} from '@forma-ws/frontend-shared';
import { Observable } from 'rxjs';
import { LoggingTimingService } from './resources/logging-timing.resource.service';

@Component({
  selector: 'app-logging-timing',
  imports: [
    CommonModule,
    TranslateModule,
    LineChartComponent,
    DashboardCommonComponent,
  ],
  templateUrl: './logging-timing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoggingTimingService],
})
export class LoggingTimingComponent extends DashboardCommon<LineChartConfig> {
  private loggingTimingService = inject(LoggingTimingService);

  chartConfig = computed(() => this.dashBoardData());

  override getData(): Observable<LineChartConfig> {
    return this.loggingTimingService.getChartConfig();
  }
}
