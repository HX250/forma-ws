import { Injectable, signal } from '@angular/core';
import { ChartSpaceValues } from '@forma-ws/domain';
import { LineChartConfig } from '@forma-ws/frontend-shared';

@Injectable()
export class WeightTrackingService {
  private chartSpanCategories = signal<string[]>([]);

  setChartSpanCategories(span: ChartSpaceValues): void {
    let categories: string[];

    switch (span) {
      case ChartSpaceValues.DAY:
        categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;

      case ChartSpaceValues.THREE_MONTHS:
        categories = ['Month 1', 'Month 2', 'Month 3'];
        break;

      case ChartSpaceValues.SIX_MONTHS:
        categories = [
          'Month 1',
          'Month 2',
          'Month 3',
          'Month 4',
          'Month 5',
          'Month 6',
        ];
        break;

      default:
        categories = [
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
        ];
    }

    this.chartSpanCategories.set(categories);
  }

  getChartConfig(chartData: number[]): LineChartConfig {
    return {
      series: [
        {
          name: 'Weight',
          data: chartData,
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
        text: 'Weight Tracking',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: this.chartSpanCategories(),
      },
    };
  }
}
