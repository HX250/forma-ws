import { ChartSpaceValues } from '../../../enums';

export interface WeightTrendDto {
  weightTrend: number;
}

export interface WeightTrendResponse {
  span: ChartSpaceValues;
  labels: string[];
  data: (number | null)[];
}
