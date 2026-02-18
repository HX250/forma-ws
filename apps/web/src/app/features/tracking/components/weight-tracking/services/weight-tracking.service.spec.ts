import { TestBed } from '@angular/core/testing';
import { WeightTrackingService } from './weight-tracking.service';
import { WeightTrackingResponse } from '@forma-ws/domain';

describe('WeightTrackingService', () => {
  let service: WeightTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeightTrackingService],
    });
    service = TestBed.inject(WeightTrackingService);
  });

  describe('getChartConfig', () => {
    it('should create chart config with provided data', () => {
      const mockData: WeightTrackingResponse = {
        span: 'week',
        data: [75.5, 74.8, 74.2, 73.9, 73.5],
        labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29'],
      };

      const config = service.getChartConfig(mockData);

      expect(config.series[0].name).toBe('Weight (kg)');
      expect(config.series[0].data).toEqual([75.5, 74.8, 74.2, 73.9, 73.5]);
      expect(config.xaxis.categories).toEqual([
        'Jan 1',
        'Jan 8',
        'Jan 15',
        'Jan 22',
        'Jan 29',
      ]);
    });

    it('should handle null tracking data', () => {
      const config = service.getChartConfig(null);

      expect(config.series[0].data).toEqual([]);
      expect(config.xaxis.categories).toEqual([]);
    });

    it('should handle empty data arrays', () => {
      const mockData: WeightTrackingResponse = {
        span: 'week',
        data: [],
        labels: [],
      };

      const config = service.getChartConfig(mockData);

      expect(config.series[0].data).toEqual([]);
      expect(config.xaxis.categories).toEqual([]);
    });

    it('should set correct chart configuration', () => {
      const mockData: WeightTrackingResponse = {
        span: 'week',
        data: [75.5],
        labels: ['Jan 1'],
      };

      const config = service.getChartConfig(mockData);

      expect(config.chart.height).toBe(250);
      expect(config.chart.type).toBe('area');
      expect(config.chart.zoom?.enabled).toBe(false);
      expect(config.dataLabels.enabled).toBe(false);
      expect(config.stroke.curve).toBe('smooth');
      expect(config.title.text).toBe('Weight Tracking');
      expect(config.title.align).toBe('left');
    });

    it('should configure grid with correct colors and opacity', () => {
      const mockData: WeightTrackingResponse = {
        span: 'week',
        data: [75.5],
        labels: ['Jan 1'],
      };

      const config = service.getChartConfig(mockData);

      expect(config.grid.row?.colors).toEqual(['#f3f3f3', 'transparent']);
      expect(config.grid.row?.opacity).toBe(0.5);
    });

    it('should handle single data point', () => {
      const mockData: WeightTrackingResponse = {
        span: 'week',
        data: [75.5],
        labels: ['Jan 1'],
      };

      const config = service.getChartConfig(mockData);

      expect(config.series[0].data).toEqual([75.5]);
      expect(config.xaxis.categories).toEqual(['Jan 1']);
    });

    it('should handle multiple data points', () => {
      const mockData: WeightTrackingResponse = {
        span: 'week',
        data: [75.5, 74.8, 74.2, 73.9, 73.5, 73.2, 72.8],
        labels: [
          'Week 1',
          'Week 2',
          'Week 3',
          'Week 4',
          'Week 5',
          'Week 6',
          'Week 7',
        ],
      };

      const config = service.getChartConfig(mockData);

      expect(config.series[0].data.length).toBe(7);
      expect(config.xaxis.categories.length).toBe(7);
    });

    it('should handle weight gain trend', () => {
      const mockData: WeightTrackingResponse = {
        span: 'month',
        data: [70.0, 71.5, 72.3, 73.1],
        labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4'],
      };

      const config = service.getChartConfig(mockData);

      expect(config.series[0].data).toEqual([70.0, 71.5, 72.3, 73.1]);
      expect(config.xaxis.categories).toEqual([
        'Month 1',
        'Month 2',
        'Month 3',
        'Month 4',
      ]);
    });

    it('should handle weight maintenance (stable weight)', () => {
      const mockData: WeightTrackingResponse = {
        span: 'day',
        data: [75.0, 75.1, 74.9, 75.0, 75.2],
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
      };

      const config = service.getChartConfig(mockData);

      expect(config.series[0].data).toEqual([75.0, 75.1, 74.9, 75.0, 75.2]);
    });
  });
});
