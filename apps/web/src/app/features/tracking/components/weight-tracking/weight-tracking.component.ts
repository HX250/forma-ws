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
import { ChartSpaceValues } from '@forma-ws/domain';

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

  chartSpan = signal<ChartSpaceValues>(ChartSpaceValues.YEAR);
  chartData = signal<number[]>([]);

  chartSpanLabel = computed(() => {
    switch (this.chartSpan()) {
      case ChartSpaceValues.DAY:
        return 'Daily';

      case ChartSpaceValues.THREE_MONTHS:
        return '3-Month';

      case ChartSpaceValues.SIX_MONTHS:
        return '6-Month';

      case ChartSpaceValues.YEAR:
        return 'Yearly';

      default:
        return '';
    }
  });
  chartConfig = this.weightTrackingService.getChartConfig([]);

  ChartSpaceValues = ChartSpaceValues;

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
