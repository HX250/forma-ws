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
import { WeightTrendService } from './resources/weight-trend.resource.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weight-trend',
  imports: [
    CommonModule,
    TranslateModule,
    LineChartComponent,
    DashboardCommonComponent,
  ],
  templateUrl: './weight-trend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WeightTrendService],
})
export class WeightTrendComponent extends DashboardCommon<LineChartConfig> {
  private weightTrendService = inject(WeightTrendService);

  chartConfig = computed(() => this.dashBoardData());

  override getData(): Observable<LineChartConfig> {
    return this.weightTrendService.getChartConfig();
  }
}
