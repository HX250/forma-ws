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
import { LoggingService } from './resources/logging.resource.service';

@Component({
  selector: 'app-logging',
  imports: [
    CommonModule,
    TranslateModule,
    LineChartComponent,
    DashboardCommonComponent,
  ],
  templateUrl: './logging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoggingService],
})
export class LoggingComponent extends DashboardCommon<LineChartConfig> {
  private loggingService = inject(LoggingService);

  chartConfig = computed(() => this.dashBoardData());

  override getData(): Observable<LineChartConfig> {
    return this.loggingService.getChartConfig();
  }
}
