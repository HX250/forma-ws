import { Injectable } from '@angular/core';
import { ClientsGrowthResponse } from '@forma-ws/domain';
import { LineChartConfig } from '@forma-ws/frontend-shared';

@Injectable()
export class ClientGrowthService {
  getChartConfig(data: ClientsGrowthResponse | null): LineChartConfig {
    return {
      series: [
        {
          name: 'New Clients',
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
      title: { text: 'Client Growth', align: 'left' },
      grid: {
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      xaxis: { categories: data?.labels ?? [] },
    };
  }
}
