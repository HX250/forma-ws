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
import { ClientEngagementService } from './resources/client-engagement.resource.service';

@Component({
  selector: 'app-client-engagement',
  imports: [
    CommonModule,
    TranslateModule,
    LineChartComponent,
    DashboardCommonComponent,
  ],
  templateUrl: './client-engagement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientEngagementService],
})
export class ClientEngagementComponent extends DashboardCommon<LineChartConfig> {
  private clientEngagementService = inject(ClientEngagementService);

  chartConfig = computed(() => this.dashBoardData());

  override getData(): Observable<LineChartConfig> {
    return this.clientEngagementService.getChartConfig();
  }
}
