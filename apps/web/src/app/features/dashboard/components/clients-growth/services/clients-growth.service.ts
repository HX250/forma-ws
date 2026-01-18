import { Injectable } from '@angular/core';
import { LineChartConfig } from '@forma-ws/frontend-shared';

@Injectable()
export class ClientsGrowthService {
  getChartConfig(): LineChartConfig {
    return {
      series: [
        {
          name: 'Clients',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 120, 110, 130],
        },
      ],
      chart: {
        height: 250,
        type: 'area',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'New Clients & Growth',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
    };
  }
}
