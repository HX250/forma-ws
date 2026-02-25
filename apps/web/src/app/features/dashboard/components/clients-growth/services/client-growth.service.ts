import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClientsGrowthResponse } from '@forma-ws/domain';
import { LineChartConfig } from '@forma-ws/frontend-shared';

@Injectable()
export class ClientGrowthService {
  private readonly translate = inject(TranslateService);

  getChartConfig(data: ClientsGrowthResponse | null): LineChartConfig {
    return {
      series: [
        {
          name: this.translate.instant('DASHBOARD.CLIENTS_GROWTH.SERIES_NAME'),
          data: data?.data ?? [],
        },
      ],
      chart: {
        height: 250,
        type: 'area',
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: {
        text: this.translate.instant('DASHBOARD.CLIENTS_GROWTH.CHART_TITLE'),
        align: 'left',
      },
      grid: {
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      xaxis: { categories: data?.labels ?? [] },
    };
  }
}
