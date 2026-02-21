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
import { ClientEngagementResourceService } from './resources/client-engagement.resource.service';
import { ClientEngagementResponse } from '@forma-ws/domain';

@Component({
  selector: 'app-client-engagement',
  imports: [CommonModule, TranslateModule, DashboardCommonComponent],
  templateUrl: './client-engagement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientEngagementResourceService],
})
export class ClientEngagementComponent extends DashboardCommon<ClientEngagementResponse> {
  private clientEngagementResourceService = inject(
    ClientEngagementResourceService
  );

  engagementData = computed(
    () =>
      this.dashBoardData() ?? {
        workoutEngagement: 0,
        nutritionEngagement: 0,
        sleepEngagement: 0,
        waterEngagement: 0,
      }
  );

  getEngagementPercentage(engagementNumber: number): number {
    return engagementNumber ?? 0;
  }

  override getData(): Observable<ClientEngagementResponse> {
    return this.clientEngagementResourceService.getClientEngagement();
  }
}
