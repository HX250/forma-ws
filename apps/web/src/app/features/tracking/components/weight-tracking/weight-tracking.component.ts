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
import { TranslateModule } from '@ngx-translate/core';
import { WeightTrackingService } from './services/weight-tracking.service';
import {
  LineChartComponent,
  ButtonComponent,
  ButtonProperties,
} from '@forma-ws/frontend-shared';
import { WeightTrackingResourceService } from './services/resources/weight-tracking.resource.service';
import { ChartSpaceValues, WeightTrackingResponse } from '@forma-ws/domain';

@Component({
  selector: 'app-weight-tracking',
  imports: [CommonModule, TranslateModule, LineChartComponent, ButtonComponent],
  templateUrl: './weight-tracking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WeightTrackingService, WeightTrackingResourceService],
})
export class WeightTrackingComponent {
  private weightTrackingService = inject(WeightTrackingService);
  private weightTrackingResourceService = inject(WeightTrackingResourceService);

  clientId = input.required<string>();
  targetWeightLoss = input.required<number>();

  chartSpan = signal<ChartSpaceValues>(ChartSpaceValues.DAY);
  trackingData = signal<WeightTrackingResponse | null>(null);
  isLoading = signal(false);

  chartSpanLabel = computed(() => {
    switch (this.chartSpan()) {
      case ChartSpaceValues.DAY:
        return 'Weekly';
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

  totalWeightLoss = computed(() => {
    const data = this.trackingData();
    if (!data || !data.data || data.data.length === 0) return 0;

    const validWeights = data.data.filter((w) => w !== null) as number[];
    if (validWeights.length < 2) return 0;

    const firstWeight = validWeights[0];
    const lastWeight = validWeights[validWeights.length - 1];
    return Math.round((firstWeight - lastWeight) * 100) / 100;
  });

  averageWeightLoss = computed(() => {
    const total = this.totalWeightLoss();
    const span = this.chartSpan();

    let divisor = 1;

    switch (span) {
      case ChartSpaceValues.DAY:
        divisor = 7;
        break;
      case ChartSpaceValues.THREE_MONTHS:
        divisor = 3;
        break;
      case ChartSpaceValues.SIX_MONTHS:
        divisor = 6;
        break;
      case ChartSpaceValues.YEAR:
        divisor = 12;
        break;
    }

    return Math.round((total / divisor) * 100) / 100;
  });

  averageLabel = computed(() => {
    switch (this.chartSpan()) {
      case ChartSpaceValues.DAY:
        return 'Avg Daily';
      case ChartSpaceValues.THREE_MONTHS:
      case ChartSpaceValues.SIX_MONTHS:
      case ChartSpaceValues.YEAR:
        return 'Avg Monthly';
      default:
        return 'Average';
    }
  });

  chartConfig = computed(() => {
    return this.weightTrackingService.getChartConfig(this.trackingData());
  });

  ChartSpaceValues = ChartSpaceValues;
  ButtonProperties = ButtonProperties;

  getFilterVariant(filter: ChartSpaceValues): ButtonProperties.ButtonVariant {
    return this.chartSpan() === filter
      ? ButtonProperties.ButtonVariant.PRIMARY
      : ButtonProperties.ButtonVariant.NEUTRAL;
  }

  private chartSpanEffect = effect(() => {
    const id = this.clientId();
    const span = this.chartSpan();

    if (id) {
      this.loadWeightData();
    }
  });

  private loadWeightData(): void {
    this.isLoading.set(true);
    this.weightTrackingResourceService
      .getWeightTracking(this.clientId(), this.chartSpan())
      .subscribe({
        next: (data) => {
          this.trackingData.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading weight tracking data:', err);
          this.isLoading.set(false);
        },
      });
  }
}
