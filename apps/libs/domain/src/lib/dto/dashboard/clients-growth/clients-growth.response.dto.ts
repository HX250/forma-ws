import { ChartSpaceValues } from '../../../enums';

export interface ClientsGrowthResponse {
  span: ChartSpaceValues;
  labels: string[];
  data: number[];
  newThisMonth: number;
  totalActive: number;
}
