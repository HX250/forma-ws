import { ChartSpaceValues } from '../../../enums';

export interface WeighIn {
  id: string;
  clientId: string;
  weight: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  notes?: string;
  date: Date;
  createdAt: Date;
}

export interface WeighInResponse {
  id: string;
  weight: number;
  bodyFatPercentage: number;
  muscleMass: number;
  notes: string;
  createdAt: Date;
}

export interface WeightTrackingResponse {
  span: ChartSpaceValues;
  labels: string[];
  data: (number | null)[];
}
