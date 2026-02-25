import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonComponent,
  ButtonProperties,
  DashboardCommon,
  DashboardCommonComponent,
  LineChartComponent,
} from '@forma-ws/frontend-shared';
import { ClientsGrowthResourceService } from './resources/clients-growth.resource.service';
import { Observable } from 'rxjs';
import { ChartSpaceValues, ClientsGrowthResponse } from '@forma-ws/domain';
import { ClientGrowthService } from './services/client-growth.service';

@Component({
  selector: 'app-clients-growth',
  imports: [
    CommonModule,
    TranslateModule,
    LineChartComponent,
    DashboardCommonComponent,
    ButtonComponent,
  ],
  templateUrl: './clients-growth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClientGrowthService, ClientsGrowthResourceService],
})
export class ClientsGrowthComponent extends DashboardCommon<ClientsGrowthResponse> {
  private clientsGrowthResourceService = inject(ClientsGrowthResourceService);
  private clientGrowthService = inject(ClientGrowthService);

  chartSpan = signal<ChartSpaceValues>(ChartSpaceValues.YEAR);

  chartConfig = computed(() =>
    this.clientGrowthService.getChartConfig(this.dashBoardData())
  );

  growthData = computed(
    () =>
      this.dashBoardData() ?? {
        span: ChartSpaceValues.YEAR,
        labels: [],
        data: [],
        newThisMonth: 0,
        totalActive: 0,
      }
  );

  private chartSpanEffect = effect(() => {
    const span = this.chartSpan();
    if (span) {
      this.getDashBoardData(this.getData());
    }
  });

  ChartSpaceValues = ChartSpaceValues;
  ButtonProperties = ButtonProperties;

  getFilterVariant(filter: ChartSpaceValues): ButtonProperties.ButtonVariant {
    return this.chartSpan() === filter
      ? ButtonProperties.ButtonVariant.PRIMARY
      : ButtonProperties.ButtonVariant.NEUTRAL;
  }

  override getData(): Observable<ClientsGrowthResponse> {
    return this.clientsGrowthResourceService.getChartConfig(this.chartSpan());
  }
}
