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
import { WeightTrendResourceService } from './resources/weight-trend.resource.service';
import { Observable } from 'rxjs';
import { WeightTrendDto } from '@forma-ws/domain';

@Component({
  selector: 'app-weight-trend',
  imports: [CommonModule, TranslateModule, DashboardCommonComponent],
  templateUrl: './weight-trend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WeightTrendResourceService],
})
export class WeightTrendComponent extends DashboardCommon<WeightTrendDto> {
  private weightTrendResourceService = inject(WeightTrendResourceService);

  weightTrend = computed(() => this.dashBoardData() ?? { weightTrend: 0 });

  getWeightPercentage(weightTrend: number): number {
    return weightTrend ?? 0;
  }

  override getData(): Observable<WeightTrendDto> {
    return this.weightTrendResourceService.getWeightTrend();
  }
}
