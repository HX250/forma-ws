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
