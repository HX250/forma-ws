import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeightTrackingService } from './services/weight-tracking.service';
import { LineChartComponent } from '@forma-ws/frontend-shared';
import { WeightTrackingResourceService } from './services/resources/weight-tracking.resource.service';
import { ChartSpaceVlues } from '@forma-ws/domain';

@Component({
  selector: 'app-weight-tracking',
  imports: [CommonModule, LineChartComponent],
  templateUrl: './weight-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WeightTrackingService, WeightTrackingResourceService],
})
export class WeightTrackingComponent {
  private weightTrackingService = inject(WeightTrackingService);
  private weightTrackingResourceService = inject(WeightTrackingResourceService);

  clientId = input.required<string>();
  targetWeightLoss = input.required<number>();

  chartSpan = signal<ChartSpaceVlues>(ChartSpaceVlues.YEAR);
  chartData = signal<number[]>([]);

  chartSpanLabel = computed(() => {
    switch (this.chartSpan()) {
      case ChartSpaceVlues.DAY:
        return 'Daily';

      case ChartSpaceVlues.THREE_MONTHS:
        return '3-Month';

      case ChartSpaceVlues.SIX_MONTHS:
        return '6-Month';

      case ChartSpaceVlues.YEAR:
        return 'Yearly';

      default:
        return '';
    }
  });
  chartConfig = this.weightTrackingService.getChartConfig([]);

  ChartSpaceVlues = ChartSpaceVlues;

  private chartSpanEffect = effect(() => {
    this.weightTrackingService.setChartSpanCategories(this.chartSpan());
    this.chartData.set(
      this.weightTrackingResourceService.getWeightData(this.chartSpan())
    );
    this.chartConfig = this.weightTrackingService.getChartConfig(
      this.chartData()
    );
  });
}
