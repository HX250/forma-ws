export interface SleepEntry {
  id: string;
  clientId: string;
  bedTime: Date;
  wakeTime: Date;
  hoursSlept: number;
  sleepQuality?: number;
  notes?: string;
  createdAt: Date;
}
